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

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withFollowActions(WrappedComponent) {
  const mapStateToProps = state => ({
    authUsername: getAuthUsername(state),
    currentUserFollowList: getCurrentUserFollowList(state),
  });

  const mapDispatchToProps = dispatch => ({
    currentUserFollowUser: (username, followSuccessCallback, followFailCallback) =>
      dispatch(
        currentUserFollowUser.action({ username, followSuccessCallback, followFailCallback }),
      ),
    currentUserUnfollowUser: (username, unfollowSuccessCallback, unfollowFailCallback) =>
      dispatch(
        currentUserUnfollowUser.action({ username, unfollowSuccessCallback, unfollowFailCallback }),
      ),
    fetchCurrentUserFollowList: () => dispatch(currentUserFollowListFetch.action()),
    fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
  });

  @connect(mapStateToProps, mapDispatchToProps)
  class Wrapper extends Component {
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
      this.failFollow = this.failFollow.bind(this);
      this.failUnfollow = this.failUnfollow.bind(this);
      this.handleFollow = this.handleFollow.bind(this);
      this.handleUnfollow = this.handleUnfollow.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const isFollowing = _.get(nextProps.currentUserFollowList, this.props.username, false);
      if (isFollowing !== this.state.isFollowing) {
        this.setState({
          isFollowing,
        });
      }
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

    failFollow() {
      this.setState({
        loadingIsFollowing: false,
      });
    }

    failUnfollow() {
      this.setState({
        loadingIsFollowing: false,
      });
    }

    handleFollow() {
      this.loadingFollowing();
      const { username } = this.props;
      this.props.currentUserFollowUser(username, this.successFollow, this.failFollow);
    }

    handleUnfollow() {
      this.loadingFollowing();
      const { username } = this.props;
      this.props.currentUserUnfollowUser(username, this.successUnfollow, this.failUnfollow);
    }

    render() {
      const { loadingIsFollowing, isFollowing } = this.state;

      return (
        <WrappedComponent
          loadingIsFollowing={loadingIsFollowing}
          handleUnfollow={this.handleUnfollow}
          handleFollow={this.handleFollow}
          isFollowing={isFollowing}
          {...this.props}
        />
      );
    }
  }

  Wrapper.displayName = `withFollowActions(${getDisplayName(WrappedComponent)})`;

  return Wrapper;
}
