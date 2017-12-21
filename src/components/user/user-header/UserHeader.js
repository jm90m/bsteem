import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from 'react-native';
import { connect } from 'react-redux';
import steem from 'steem';
import { getUsersDetails, getCurrentUserFollowList, getUsersFollowCount } from 'state/rootReducer';
import { currentUserFollowUser, currentUserUnfollowUser } from 'state/actions/currentUserActions';
import UserProfile from 'components/user/user-profile/UserProfile';
import * as navigationConstants from 'constants/navigation';
import UserStats from './UserStats';
import UserCover from './UserCover';

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  usersFollowCount: getUsersFollowCount(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserFollowUser: (username, followSuccessCallback) =>
    dispatch(currentUserFollowUser.action({ username, followSuccessCallback })),
  currentUserUnfollowUser: (username, unfollowSuccessCallback) =>
    dispatch(currentUserUnfollowUser.action({ username, unfollowSuccessCallback })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserHeader extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    hideFollowButton: PropTypes.bool,
    currentUserFollowUser: PropTypes.func.isRequired,
    currentUserUnfollowUser: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    hideFollowButton: false,
  };

  constructor(props) {
    super(props);
    const { username, currentUserFollowList } = this.props;
    const isFollowing = _.get(currentUserFollowList, username, false);

    this.state = {
      isFollowing,
      loadingIsFollowing: false,
    };

    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.loadingFollowing = this.loadingFollowing.bind(this);
    this.successFollow = this.successFollow.bind(this);
    this.successUnfollow = this.successUnfollow.bind(this);
    this.handleOnPressFollowers = this.handleOnPressFollowers.bind(this);
    this.handleOnPressFollowing = this.handleOnPressFollowing.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const isFollowing = _.get(nextProps.currentUserFollowList, nextProps.username, false);
    this.setState({
      isFollowing,
    });
  }

  loadingFollowing() {
    this.setState({
      loadingIsFollowing: true,
    });
  }

  successFollow() {
    this.setState({
      isFollowing: true,
      loadingIsFollowing: false,
    });
  }

  successUnfollow() {
    this.setState({
      isFollowing: false,
      loadingIsFollowing: false,
    });
  }

  handleFollow() {
    this.loadingFollowing();
    const { username } = this.props;
    this.props.currentUserFollowUser(username, this.successFollow);
  }

  handleUnfollow() {
    this.loadingFollowing();
    const { username } = this.props;
    this.props.currentUserUnfollowUser(username, this.successUnfollow);
  }

  handleOnPressFollowers() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWERS, { username });
  }

  handleOnPressFollowing() {
    const { username } = this.props;
    this.props.navigation.navigate(navigationConstants.USER_FOLLOWING, { username });
  }

  render() {
    const { usersDetails, username, usersFollowCount, hideFollowButton } = this.props;
    const { isFollowing, loadingIsFollowing } = this.state;
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
        <UserCover
          username={username}
          hasCover={hasCover}
          userReputation={userReputation}
          displayFollowButton={isFollowing}
          hideFollowButton={hideFollowButton}
          loadingIsFollowing={loadingIsFollowing}
          handleFollow={this.handleFollow}
          handleUnFollow={this.handleUnfollow}
        />
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
