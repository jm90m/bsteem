import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, View } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import steem from 'steem';
import { COLORS } from 'constants/styles';
import PostPreview from 'components/post-preview/PostPreview';
import UserHeader from 'components/user/UserHeader';
import UserStats from 'components/user/UserStats';
import UserProfile from 'components/user/user-profile/UserProfile';

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class UserBlog extends Component {
  static propTypes = {
    fetchMoreUserPosts: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    userBlog: PropTypes.arrayOf(PropTypes.shape()),
    username: PropTypes.string,
  };

  static defaultProps = {
    username: '',
    userBlog: [],
  };

  constructor(props) {
    super(props);
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
  }

  renderUserHeader() {
    const {
      usersDetails,
      authUsername,
      currentUserFollowList,
      username,
      usersFollowCount,
    } = this.props;
    const userDetails = usersDetails[username] || {};
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
    const hasCover = _.has(userProfile, 'cover_image');
    const userReputation = _.has(userDetails, 'reputation')
      ? steem.formatter.reputation(userDetails.reputation)
      : 0;
    const userFollowCount = usersFollowCount[username];
    const displayFollowButton = !_.has(currentUserFollowList, username);
    const followerCount = _.get(userFollowCount, 'follower_count', 0);
    const followingCount = _.get(userFollowCount, 'following_count', 0);
    const postCount = _.get(userDetails, 'post_count', 0);
    console.log('RENDER USER HEADER');
    return (
      <View>
        <UserHeader
          username={username}
          hasCover={hasCover}
          userReputation={userReputation}
          displayFollowButton={displayFollowButton}
        />
        <UserProfile userProfile={userProfile} />
        <UserStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
        />
      </View>
    );
  }

  renderUserPostRow(rowData) {
    const { username, navigation } = this.props;
    if (_.has(rowData, 'renderUserHeader')) {
      return this.renderUserHeader();
    }
    return <PostPreview postData={rowData} navigation={navigation} currentUsername={username} />;
  }

  render() {
    const { userBlog, fetchMoreUserPosts } = this.props;
    const userHeaderData = [{ renderUserHeader: true }];
    const userBlogDataSource = _.concat(userHeaderData, userBlog);
    return (
      <StyledListView
        dataSource={ds.cloneWithRows(userBlogDataSource)}
        renderRow={this.renderUserPostRow}
        enableEmptySections
        onEndReached={fetchMoreUserPosts}
      />
    );
  }
}

export default UserBlog;
