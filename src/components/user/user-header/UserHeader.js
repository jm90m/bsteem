import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from 'react-native';
import { connect } from 'react-redux';
import steem from 'steem';
import { getUsersDetails, getUsersFollowCount } from 'state/rootReducer';
import UserProfile from 'components/user/user-profile/UserProfile';
import * as navigationConstants from 'constants/navigation';
import UserStats from './UserStats';
import UserCover from './UserCover';
import UserFollowButton from './UserFollowButton';

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  usersFollowCount: getUsersFollowCount(state),
});

@connect(mapStateToProps)
class UserHeader extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    hideFollowButton: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    hideFollowButton: false,
  };

  constructor(props) {
    super(props);
    this.handleOnPressFollowers = this.handleOnPressFollowers.bind(this);
    this.handleOnPressFollowing = this.handleOnPressFollowing.bind(this);
  }

  handleOnPressFollowers() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWERS, { username });
  }

  handleOnPressFollowing() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWING, { username });
  }

  renderFollowButton() {
    const { hideFollowButton, username } = this.props;

    if (hideFollowButton) return <View />;

    return <UserFollowButton username={username} />;
  }

  render() {
    const { usersDetails, username, usersFollowCount } = this.props;
    const userDetails = usersDetails[username] || {};
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
    const hasCover = _.has(userProfile, 'cover_image');
    const userReputation = _.has(userDetails, 'reputation')
      ? steem.formatter.reputation(userDetails.reputation)
      : 0;
    const userFollowCount = usersFollowCount[username];
    const followerCount = _.get(userFollowCount, 'follower_count', 0);
    const followingCount = _.get(userFollowCount, 'following_count', 0);
    const postCount = _.get(userDetails, 'post_count', 0);

    return (
      <View>
        <UserCover username={username} hasCover={hasCover} userReputation={userReputation} />
        {this.renderFollowButton()}
        <UserProfile userProfile={userProfile} />
        <UserStats
          postCount={postCount}
          followerCount={followerCount}
          followingCount={followingCount}
          onPressFollowers={this.handleOnPressFollowers}
          onPressFollowing={this.handleOnPressFollowing}
        />
      </View>
    );
  }
}

export default UserHeader;
