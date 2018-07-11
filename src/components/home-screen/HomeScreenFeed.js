import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RefreshControl, View, FlatList } from 'react-native';
import commonStyles from 'styles/common';
import _ from 'lodash';
import {
  getCurrentUserFollowList,
  getCustomTheme,
  getFilterFeedByFollowers,
  getHomeFeedPosts,
  getLoadingFetchDiscussions,
} from 'state/rootReducer';
import { TRENDING } from 'constants/feedFilters';
import { fetchDiscussions, fetchMoreDiscussions } from 'state/actions/homeActions';
import EmptyText from 'components/home-screen/EmptyText';
import { jsonStringify } from 'util/bsteemUtils';
import CompactViewFeedHeaderSetting from 'components/common/CompactViewFeedHeaderSetting';
import PostPreview from 'components/post-preview/PostPreview';

class HomeScreenFeed extends React.Component {
  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const diffPostData = jsonStringify(this.props.posts) !== jsonStringify(nextProps.posts);
    const diffCustomTheme =
      jsonStringify(this.props.customTheme) !== jsonStringify(nextProps.customTheme);
    const diffCurrentFilter =
      jsonStringify(this.props.currentFilter) !== jsonStringify(nextProps.currentFilter);
    const diffCurrentUserFollowList =
      jsonStringify(this.props.currentUserFollowList) !==
      jsonStringify(nextProps.currentUserFollowList);
    const diffLoadingFetchDiscussions =
      this.props.loadingFetchDiscussions !== nextProps.loadingFetchDiscussions;
    const diffFilterFeedByFollowers =
      this.props.filterFeedByFollowers !== nextProps.filterFeedByFollowers;

    return (
      diffPostData ||
      diffCustomTheme ||
      diffCurrentFilter ||
      diffCurrentUserFollowList ||
      diffLoadingFetchDiscussions ||
      diffFilterFeedByFollowers
    );
  }

  onRefreshCurrentFeed() {
    this.props.fetchDiscussions(this.props.currentFilter);
  }

  onEndReached() {
    const { posts, loadingFetchDiscussions, currentFilter } = this.props;
    const loadMoreDiscussions = !loadingFetchDiscussions && !_.isEmpty(posts);
    if (loadMoreDiscussions) {
      const lastPost = posts[posts.length - 1];
      this.props.fetchMoreDiscussions(lastPost.author, lastPost.permlink, currentFilter);
    }
  }

  keyExtractor(item) {
    return `${_.get(item, 'author', '')}/${_.get(item, 'permlink', '')}`;
  }

  renderRow(rowData) {
    const postData = rowData.item;
    return <PostPreview postData={postData} />;
  }

  render() {
    const {
      customTheme,
      posts,
      filterFeedByFollowers,
      loadingFetchDiscussions,
      currentUserFollowList,
    } = this.props;
    const displayedPosts = filterFeedByFollowers
      ? _.filter(posts, post => _.get(currentUserFollowList, post.author, false))
      : posts;
    const flatListStyles = {
      flex: 1,
      backgroundColor: customTheme.primaryBackgroundColor,
    };

    return (
      <View style={commonStyles.container}>
        {_.isEmpty(displayedPosts) && !loadingFetchDiscussions && <EmptyText />}
        <FlatList
          style={flatListStyles}
          ListHeaderComponent={<CompactViewFeedHeaderSetting />}
          data={displayedPosts}
          renderItem={this.renderRow}
          enableEmptySections
          initialNumToRender={4}
          onEndReached={this.onEndReached}
          keyExtractor={this.keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchDiscussions}
              onRefresh={this.onRefreshCurrentFeed}
              tintColor={customTheme.primaryColor}
              colors={[customTheme.primaryColor]}
            />
          }
        />
      </View>
    );
  }
}

HomeScreenFeed.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  customTheme: PropTypes.shape().isRequired,
  loadingFetchDiscussions: PropTypes.bool.isRequired,
  filterFeedByFollowers: PropTypes.bool.isRequired,
  fetchDiscussions: PropTypes.func.isRequired,
  fetchMoreDiscussions: PropTypes.func.isRequired,
  currentUserFollowList: PropTypes.shape().isRequired,
  currentFilter: PropTypes.shape(),
};

HomeScreenFeed.defaultProps = {
  currentFilter: TRENDING,
};

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  fetchMoreDiscussions: (startAuthor, startPermlink, filter) =>
    dispatch(fetchMoreDiscussions(startAuthor, startPermlink, filter)),
});

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  posts: getHomeFeedPosts(state),
  filterFeedByFollowers: getFilterFeedByFollowers(state),
  loadingFetchDiscussions: getLoadingFetchDiscussions(state),
  currentUserFollowList: getCurrentUserFollowList(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenFeed);
