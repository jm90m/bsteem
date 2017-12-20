import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from 'react-native';
import { connect } from 'react-redux';
import steem from 'steem';
import { getUsersDetails, getCurrentUserFollowList, getUsersFollowCount } from 'state/rootReducer';
import UserProfile from 'components/user/user-profile/UserProfile';
import UserStats from './UserStats';
import UserCover from './UserCover';

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  usersFollowCount: getUsersFollowCount(state),
});

@connect(mapStateToProps)
class UserHeader extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    hideFollowButton: PropTypes.bool,
  };

  static defaultProps = {
    hideFollowButton: false,
  };

  render() {
    const {
      usersDetails,
      currentUserFollowList,
      username,
      usersFollowCount,
      hideFollowButton,
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

    return (
      <View>
        <UserCover
          username={username}
          hasCover={hasCover}
          userReputation={userReputation}
          displayFollowButton={displayFollowButton}
          hideFollowButton={hideFollowButton}
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
}

export default UserHeader;
