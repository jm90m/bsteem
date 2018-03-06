import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, RefreshControl, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getLoadingFetchDiscussions,
  getLoadingFetchMoreDiscussions,
  getHomeFeedPosts,
  getHasNetworkConnection,
} from 'state/rootReducer';
import { fetchDiscussions, fetchMoreDiscussions } from 'state/actions/homeActions';
import { MATERIAL_COMMUNITY_ICONS, COLORS, ICON_SIZES } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';
import LargeLoading from 'components/common/LargeLoading';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import BSteemModal from 'components/common/BSteemModal';
import { displayPriceModal } from '../state/actions/appActions';

const StyledFlatList = styled.FlatList`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const HomeText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin-left: 3px;
`;
const TouchableMenu = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const FilterMenuIcon = styled.View`
  margin-top: 3px;
`;

const LoadingMoreContainer = styled.View`
  align-items: center;
  justify-content: center;
  z-index: 1;
  margin-top: 20px;
`;

const mapStateToProps = state => ({
  posts: getHomeFeedPosts(state),
  loadingFetchDiscussions: getLoadingFetchDiscussions(state),
  loadingFetchMoreDiscussions: getLoadingFetchMoreDiscussions(state),
  networkConnection: getHasNetworkConnection(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  fetchMoreDiscussions: (startAuthor, startPermlink, filter) =>
    dispatch(fetchMoreDiscussions(startAuthor, startPermlink, filter)),
  displayPriceModal: symbols => dispatch(displayPriceModal(symbols)),
});

class HomeScreen extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loadingFetchDiscussions: PropTypes.bool.isRequired,
    loadingFetchMoreDiscussions: PropTypes.bool.isRequired,
    fetchDiscussions: PropTypes.func.isRequired,
    fetchMoreDiscussions: PropTypes.func.isRequired,
    displayPriceModal: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      currentFilter: TRENDING,
    };

    this.setMenuVisibile = this.setMenuVisibile.bind(this);
    this.handleSortPost = this.handleSortPost.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleDisplayPriceModal = this.handleDisplayPriceModal.bind(this);
  }

  onEndReached() {
    const { posts, loadingFetchDiscussions } = this.props;
    const loadMoreDiscussions = !loadingFetchDiscussions && !_.isEmpty(posts);
    if (loadMoreDiscussions) {
      const lastPost = posts[posts.length - 1];
      this.props.fetchMoreDiscussions(lastPost.author, lastPost.permlink, this.state.currentFilter);
    }
  }

  onRefreshCurrentFeed() {
    this.props.fetchDiscussions(this.state.currentFilter);
  }

  setMenuVisibile(visible) {
    this.setState({ menuVisible: visible });
  }

  handleSortPost(filter) {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.props.fetchDiscussions(filter),
    );
  }

  handleDisplayPriceModal() {
    this.props.displayPriceModal(['STEEM', 'SBD']);
  }

  handleHideMenu() {
    this.setMenuVisibile(false);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  renderRow(rowData) {
    const postData = rowData.item;
    return <PostPreview postData={postData} navigation={this.props.navigation} />;
  }

  render() {
    const { loadingFetchDiscussions, loadingFetchMoreDiscussions, posts } = this.props;
    const { menuVisible, currentFilter } = this.state;
    return (
      <View>
        <Header>
          <TouchableOpacity onPress={this.handleDisplayPriceModal}>
            <MaterialCommunityIcons
              name={MATERIAL_COMMUNITY_ICONS.lineChart}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
              style={{ padding: 5 }}
            />
          </TouchableOpacity>
          <TouchableMenu onPress={() => this.setMenuVisibile(!menuVisible)}>
            <MaterialIcons
              name={currentFilter.icon}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
            />
            <HomeText>{currentFilter.label}</HomeText>
            <FilterMenuIcon>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.chevronDown}
                size={ICON_SIZES.menuIcon}
                color={COLORS.PRIMARY_COLOR}
              />
            </FilterMenuIcon>
          </TouchableMenu>
          <TouchableOpacity onPress={this.handleNavigateToSavedTags}>
            <MaterialCommunityIcons
              name="star"
              size={ICON_SIZES.menuIcon}
              style={{ padding: 5 }}
              color={COLORS.PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </Header>
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <FeedSort hideMenu={this.handleHideMenu} handleSortPost={this.handleSortPost} />
          </BSteemModal>
        )}
        <StyledFlatList
          data={posts}
          renderItem={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
          keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchDiscussions}
              onRefresh={this.onRefreshCurrentFeed}
              tintColor={COLORS.PRIMARY_COLOR}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {(loadingFetchMoreDiscussions || loadingFetchDiscussions) && (
          <LoadingMoreContainer>
            <LargeLoading />
          </LoadingMoreContainer>
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
