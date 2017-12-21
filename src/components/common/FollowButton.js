import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCurrentUserFollowList } from 'state/rootReducer';
import { currentUserFollowUser, currentUserUnfollowUser } from 'state/actions/currentUserActions';
import { Button } from 'react-native-elements';
import { COLORS } from 'constants/styles';

const mapStateToProps = state => ({
  currentUserFollowList: getCurrentUserFollowList(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserFollowUser: (username, followSuccessCallback) =>
    dispatch(currentUserFollowUser.action({ username, followSuccessCallback })),
  currentUserUnfollowUser: (username, unfollowSuccessCallback) =>
    dispatch(currentUserUnfollowUser.action({ username, unfollowSuccessCallback })),
});

@connect(mapStateToProps, mapDispatchToProps)
class FollowButton extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    currentUserFollowUser: PropTypes.func.isRequired,
    currentUserUnfollowUser: PropTypes.func.isRequired,
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
          backgroundColor={COLORS.BLUE.MARINER}
          loading={loadingIsFollowing}
        />;
  }
}

export default FollowButton;
