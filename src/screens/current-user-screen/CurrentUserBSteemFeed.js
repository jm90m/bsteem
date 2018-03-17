import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { COLORS } from 'constants/styles';
import { connect } from 'react-redux';
import {
  getCurrentUserBSteemFeed,
  getLoadingFetchCurrentUserBSteemFeed,
  getLoadingFetchMoreCurrentBSteemUserFeed,
} from 'state/rootReducer';
import {
  currentUserBSteemFeedFetch,
  currentUserBSteemFeedFetchMore,
} from 'state/actions/currentUserActions';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import PostPreview from 'components/post-preview/PostPreview';
import { TRENDING } from 'constants/feedFilters';
import FeedSort from 'components/feed-sort/FeedSort';
import BSteemModal from 'components/common/BSteemModal';
import i18n from '../../i18n/i18n';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from '../../constants/styles';
import { getCurrentUserFollowList } from '../../state/rootReducer';

const Container = styled.View`
  flex: 1;
`;

const StyledFlatList = styled.FlatList`
  flex: 1;
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const EmptyContainer = styled.View`
  margin: 5px 0;
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const TouchableFilter = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top: 5px;
`;

const FilterMenuIcon = styled.View`
  margin-top: 3px;
`;

const FilterText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin-left: 3px;
`;

const EmptyText = styled.Text``;

const mapStateToProps = state => ({
  currentUserBSteemFeed: getCurrentUserBSteemFeed(state),
  loadingFetchCurrentUserBSteemFeed: getLoadingFetchCurrentUserBSteemFeed(state),
  loadingFetchMoreCurrentBSteemUserFeed: getLoadingFetchMoreCurrentBSteemUserFeed(state),
  currentUserFollowList: getCurrentUserFollowList(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserBSteemFeedFetch: filter => dispatch(currentUserBSteemFeedFetch.action({ filter })),
  currentUserBSteemFeedFetchMore: filter =>
    dispatch(currentUserBSteemFeedFetchMore.action({ filter })),
});

class CurrentUserBSteemFeed extends Component {
  static propTypes = {
    loadingFetchCurrentUserBSteemFeed: PropTypes.bool.isRequired,
    loadingFetchMoreCurrentBSteemUserFeed: PropTypes.bool.isRequired,
    currentUserBSteemFeedFetch: PropTypes.func.isRequired,
    currentUserBSteemFeedFetchMore: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    currentUserBSteemFeed: PropTypes.arrayOf(PropTypes.shape()),
    currentUserFollowList: PropTypes.shape(),
    hideFeed: PropTypes.bool,
  };

  static defaultProps = {
    currentUserBSteemFeed: [],
    currentUserFollowList: {},
    hideFeed: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentFilter: TRENDING,
      menuVisible: false,
      filterFeedByFollowers: false,
    };

    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.onEndReached = this.onEndReached.bind(this);

    this.renderRow = this.renderRow.bind(this);
    this.renderEmptyComponent = this.renderEmptyComponent.bind(this);
    this.renderHeaderComponent = this.renderHeaderComponent.bind(this);

    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleSortPost = this.handleSortPost.bind(this);
    this.toggleFilterFeedByFollowers = this.toggleFilterFeedByFollowers.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.currentUserBSteemFeed)) {
      this.props.currentUserBSteemFeedFetch(this.state.currentFilter.id);
    }
  }

  onRefreshCurrentFeed() {
    this.props.currentUserBSteemFeedFetch(this.state.currentFilter.id);
  }

  onEndReached() {
    this.props.currentUserBSteemFeedFetchMore(this.state.currentFilter.id);
  }

  handleHideMenu() {
    this.setState({
      menuVisible: false,
    });
  }

  handleDisplayMenu() {
    this.setState({
      menuVisible: true,
    });
  }

  handleSortPost(currentFilter) {
    this.setState(
      {
        currentFilter,
        menuVisible: false,
      },
      () => this.props.currentUserBSteemFeedFetch(currentFilter.id),
    );
  }

  enableFilterFeedByFollowers() {
    this.setState({
      filterFeedByFollowers: true,
      menuVisible: false,
    });
  }

  disableFilterFeedByFollowers() {
    this.setState({
      filterFeedByFollowers: false,
      menuVisible: false,
    });
  }

  toggleFilterFeedByFollowers() {
    const { filterFeedByFollowers } = this.state;
    if (filterFeedByFollowers) {
      this.disableFilterFeedByFollowers();
    } else {
      this.enableFilterFeedByFollowers();
    }
  }

  renderHeaderComponent() {
    const { currentFilter } = this.state;
    return (
      <TouchableFilter onPress={this.handleDisplayMenu}>
        <MaterialIcons
          name={currentFilter.icon}
          size={ICON_SIZES.menuIcon}
          color={COLORS.PRIMARY_COLOR}
        />
        <FilterText>{currentFilter.label}</FilterText>
        <FilterMenuIcon>
          <MaterialCommunityIcons
            name={MATERIAL_COMMUNITY_ICONS.chevronDown}
            size={ICON_SIZES.menuIcon}
            color={COLORS.PRIMARY_COLOR}
          />
        </FilterMenuIcon>
      </TouchableFilter>
    );
  }
  renderRow(rowData) {
    return <PostPreview postData={rowData.item} navigation={this.props.navigation} />;
  }

  renderEmptyComponent = displayedPosts => () => {
    const { currentUserBSteemFeed, loadingFetchCurrentUserBSteemFeed } = this.props;

    if (_.isEmpty(currentUserBSteemFeed) && !loadingFetchCurrentUserBSteemFeed) {
      return (
        <EmptyContainer>
          <EmptyText>{i18n.feed.currentUserBSteemFeedEmpty}</EmptyText>
        </EmptyContainer>
      );
    } else if (_.isEmpty(displayedPosts) && !loadingFetchCurrentUserBSteemFeed) {
      return (
        <EmptyContainer>
          <EmptyText>{i18n.feed.emptyFeedCheckFilters}</EmptyText>
        </EmptyContainer>
      );
    }

    return null;
  };

  render() {
    const {
      currentUserBSteemFeed,
      loadingFetchCurrentUserBSteemFeed,
      currentUserFollowList,
      hideFeed,
    } = this.props;
    const { menuVisible, filterFeedByFollowers } = this.state;
    const displayedPosts = filterFeedByFollowers
      ? _.filter(currentUserBSteemFeed, post => _.get(currentUserFollowList, post.author, false))
      : currentUserBSteemFeed;

    return (
      <Container style={hideFeed && { height: 0, width: 0, display: 'none' }}>
        <StyledFlatList
          data={displayedPosts}
          renderItem={this.renderRow}
          enableEmptySections
          keyExtractor={(item, index) => `${_.get(item, 'id', '')}${index}`}
          ListHeaderComponent={this.renderHeaderComponent}
          ListEmptyComponent={this.renderEmptyComponent(displayedPosts)}
          onEndReached={this.onEndReached}
          initialNumToRender={4}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchCurrentUserBSteemFeed}
              onRefresh={this.onRefreshCurrentFeed}
              tintColor={COLORS.PRIMARY_COLOR}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <FeedSort
              hideMenu={this.handleHideMenu}
              handleSortPost={this.handleSortPost}
              handleFilterFeedByFollowers={this.toggleFilterFeedByFollowers}
              filterFeedByFollowers={filterFeedByFollowers}
            />
          </BSteemModal>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUserBSteemFeed);
