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
  getFilterFeedByFollowers,
  getCurrentUserFollowList,
  getCustomTheme,
  getCompactViewEnabled,
  getIntl,
} from 'state/rootReducer';
import {
  fetchDiscussions,
  fetchMoreDiscussions,
  enableFilterHomeFeedByFollowers,
  disableFilterHomeFeedByFollowers,
} from 'state/actions/homeActions';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import BSteemModal from 'components/common/BSteemModal';
import TitleText from 'components/common/TitleText';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledFlatList from 'components/common/StyledFlatList';
import CompactViewFeedHeaderSetting from 'components/common/CompactViewFeedHeaderSetting';
import FeedHeader from 'components/feed/FeedHeader';
import { displayPriceModal } from '../state/actions/appActions';

const TouchableMenu = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const FilterMenuIcon = styled.View`
  margin-top: 3px;
`;

const EmptyContainer = styled(StyledViewPrimaryBackground)`
  margin: 5px 0;
  padding: 20px;
`;

const EmptyText = styled(StyledTextByBackground)``;

const mapStateToProps = state => ({
  compactViewEnabled: getCompactViewEnabled(state),
  customTheme: getCustomTheme(state),
  posts: getHomeFeedPosts(state),
  loadingFetchDiscussions: getLoadingFetchDiscussions(state),
  loadingFetchMoreDiscussions: getLoadingFetchMoreDiscussions(state),
  networkConnection: getHasNetworkConnection(state),
  filterFeedByFollowers: getFilterFeedByFollowers(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  fetchMoreDiscussions: (startAuthor, startPermlink, filter) =>
    dispatch(fetchMoreDiscussions(startAuthor, startPermlink, filter)),
  displayPriceModal: symbols => dispatch(displayPriceModal(symbols)),
  enableFilterHomeFeedByFollowers: () => dispatch(enableFilterHomeFeedByFollowers()),
  disableFilterHomeFeedByFollowers: () => dispatch(disableFilterHomeFeedByFollowers()),
});

class HomeScreen extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    customTheme: PropTypes.shape().isRequired,
    loadingFetchDiscussions: PropTypes.bool.isRequired,
    loadingFetchMoreDiscussions: PropTypes.bool.isRequired,
    filterFeedByFollowers: PropTypes.bool.isRequired,
    fetchDiscussions: PropTypes.func.isRequired,
    fetchMoreDiscussions: PropTypes.func.isRequired,
    displayPriceModal: PropTypes.func.isRequired,
    enableFilterHomeFeedByFollowers: PropTypes.func.isRequired,
    disableFilterHomeFeedByFollowers: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    currentUserFollowList: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    currentUserFollowList: {},
  };

  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);

    this.state = {
      currentFilter: TRENDING,
    };

    this.setMenuVisibile = this.setMenuVisibile.bind(this);
    this.handleSortPost = this.handleSortPost.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
    this.handleFilterFeedByFollowers = this.handleFilterFeedByFollowers.bind(this);
    this.handleDisplayPriceModal = this.handleDisplayPriceModal.bind(this);
    this.renderEmptyText = this.renderEmptyText.bind(this);
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

  handleFilterFeedByFollowers() {
    const { filterFeedByFollowers } = this.props;

    if (filterFeedByFollowers) {
      this.props.disableFilterHomeFeedByFollowers();
    } else {
      this.props.enableFilterHomeFeedByFollowers();
    }
  }

  handleDisplayPriceModal() {
    this.props.displayPriceModal(['STEEM', 'SBD*']);
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

  renderEmptyText() {
    const { intl } = this.props;
    return (
      <EmptyContainer>
        <EmptyText>{intl.empty_feed_check_filters}</EmptyText>
      </EmptyContainer>
    );
  }

  render() {
    const {
      loadingFetchDiscussions,
      posts,
      filterFeedByFollowers,
      currentUserFollowList,
      customTheme,
    } = this.props;
    const displayedPosts = filterFeedByFollowers
      ? _.filter(posts, post => _.get(currentUserFollowList, post.author, false))
      : posts;
    return (
      <View style={{ flex: 1 }}>
        <StyledFlatList
          ListHeaderComponent={
            <FeedHeader
              filteredFeedByFollowers={filterFeedByFollowers}
              handleFilterFeedByFollowers={this.handleFilterFeedByFollowers}
              fetchDiscussions={this.props.fetchDiscussions}
            />
          }
          data={displayedPosts}
          renderItem={this.renderRow}
          enableEmptySections
          initialNumToRender={4}
          onEndReached={this.onEndReached}
          keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchDiscussions}
              onRefresh={this.onRefreshCurrentFeed}
              tintColor={customTheme.primaryColor}
              colors={[customTheme.primaryColor]}
            />
          }
        />
        {_.isEmpty(displayedPosts) && !loadingFetchDiscussions && this.renderEmptyText()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
