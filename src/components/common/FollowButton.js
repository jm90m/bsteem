import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCurrentUserFollowList, getAuthUsername } from 'state/rootReducer';
import {
  currentUserFollowUser,
  currentUserUnfollowUser,
  currentUserFollowListFetch,
} from 'state/actions/currentUserActions';
import { fetchUserFollowCount } from 'state/actions/usersActions';
import { Button } from 'react-native-elements';
import { COLORS } from 'constants/styles';

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  currentUserFollowList: getCurrentUserFollowList(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserFollowUser: (username, followSuccessCallback) =>
    dispatch(currentUserFollowUser.action({ username, followSuccessCallback })),
  currentUserUnfollowUser: (username, unfollowSuccessCallback) =>
    dispatch(currentUserUnfollowUser.action({ username, unfollowSuccessCallback })),
  fetchCurrentUserFollowList: () => dispatch(currentUserFollowListFetch.action()),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class FollowButton extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    authUsername: PropTypes.string.isRequired,
    currentUserFollowUser: PropTypes.func.isRequired,
    currentUserUnfollowUser: PropTypes.func.isRequired,
    fetchCurrentUserFollowList: PropTypes.func.isRequired,
    fetchUserFollowCount: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { username, currentUserFollowList } = this.props;
    const isFollowing = _.get(currentUserFollowList, username, false);

    this.state = {
      isFollowing,
      loadingIsFollowing: false,
    };

    this.loadingFollowing = this.loadingFollowing.bind(this);
    this.successFollow = this.successFollow.bind(this);
    this.successUnfollow = this.successUnfollow.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
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
    const { username, authUsername } = this.props;
    this.setState({
      isFollowing: true,
      loadingIsFollowing: false,
    });
    this.props.fetchCurrentUserFollowList();
    this.props.fetchUserFollowCount(username);
    this.props.fetchUserFollowCount(authUsername);
  }

  successUnfollow() {
    const { username, authUsername } = this.props;
    this.setState({
      isFollowing: false,
      loadingIsFollowing: false,
    });
    this.props.fetchCurrentUserFollowList();
    this.props.fetchUserFollowCount(username);
    this.props.fetchUserFollowCount(authUsername);
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

  render() {
    const { loadingIsFollowing, isFollowing } = this.state;

    return isFollowing
      ? <Button
          title="Unfollow"
          onPress={this.handleUnfollow}
          borderRadius={10}
          backgroundColor={COLORS.RED.VALENCIA}
          loading={loadingIsFollowing}
        />
      : <Button
          title="Follow"
          onPress={this.handleFollow}
          borderRadius={10}
          backgroundColor={COLORS.PRIMARY_COLOR}
          loading={loadingIsFollowing}
        />;
  }
}

export default FollowButton;
