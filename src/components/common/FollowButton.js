import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCurrentUserFollowList, getAuthUsername, getIntl } from 'state/rootReducer';
import {
  currentUserFollowUser,
  currentUserUnfollowUser,
  currentUserFollowListFetch,
} from 'state/actions/currentUserActions';
import { fetchUserFollowCount } from 'state/actions/usersActions';
import { MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import withAuthActions from 'components/common/withAuthActions';
import PrimaryButton from './PrimaryButton';
import DangerButton from './DangerButton';

const mapStateToProps = state => ({
  authUsername: getAuthUsername(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  currentUserFollowUser: (username, followSuccessCallback, followFailCallback) =>
    dispatch(currentUserFollowUser.action({ username, followSuccessCallback, followFailCallback })),
  currentUserUnfollowUser: (username, unfollowSuccessCallback, unfollowFailCallback) =>
    dispatch(
      currentUserUnfollowUser.action({ username, unfollowSuccessCallback, unfollowFailCallback }),
    ),
  fetchCurrentUserFollowList: () => dispatch(currentUserFollowListFetch.action()),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
});

@withAuthActions
@connect(mapStateToProps, mapDispatchToProps)
class FollowButton extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    authUsername: PropTypes.string.isRequired,
    currentUserFollowUser: PropTypes.func.isRequired,
    currentUserUnfollowUser: PropTypes.func.isRequired,
    fetchCurrentUserFollowList: PropTypes.func.isRequired,
    fetchUserFollowCount: PropTypes.func.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    useIcon: PropTypes.bool,
  };

  static defaultProps = {
    useIcon: false,
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
    const { useIcon, intl } = this.props;
    const { loadingIsFollowing, isFollowing } = this.state;
    const dangerIcon = useIcon
      ? { name: MATERIAL_COMMUNITY_ICONS.unfollowIcon, type: 'material-community' }
      : null;
    const primaryIcon = useIcon
      ? { name: MATERIAL_COMMUNITY_ICONS.followIcon, type: 'material-community' }
      : null;

    return isFollowing ? (
      <DangerButton
        title={useIcon ? '' : intl.unfollow}
        onPress={() => this.props.onActionInitiated(this.handleUnfollow)}
        loading={loadingIsFollowing}
        icon={dangerIcon}
      />
    ) : (
      <PrimaryButton
        title={useIcon ? '' : intl.follow}
        onPress={() => this.props.onActionInitiated(this.handleFollow)}
        loading={loadingIsFollowing}
        icon={primaryIcon}
      />
    );
  }
}

export default FollowButton;
