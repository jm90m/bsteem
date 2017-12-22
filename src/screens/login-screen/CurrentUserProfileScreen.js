import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, AsyncStorage } from 'react-native';
import _ from 'lodash';
import sc2 from 'api/sc2';
import styled from 'styled-components/native';
import {
  fetchUser,
  fetchUserComments,
  fetchUserBlog,
  fetchUserFollowCount,
  refreshUserBlog,
} from 'state/actions/usersActions';
import {
  getAuthUsername,
  getUsersDetails,
  getUsersComments,
  getUsersBlog,
  getUsersFollowCount,
  getLoadingUsersBlog,
  getLoadingUsersComments,
  getLoadingUsersDetails,
  getLoadingUsersFollowCount,
  getCurrentUserFollowList,
  getRefreshUserBlogLoading,
} from 'state/rootReducer';
import {
  STEEM_ACCESS_TOKEN,
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
} from 'constants/asyncStorageKeys';
import { logoutUser } from 'state/actions/authActions';
import { currentUserFollowListFetch } from 'state/actions/currentUserActions';
import { COLORS } from 'constants/styles';
import * as userMenuConstants from 'constants/userMenu';
import * as navigationConstants from 'constants/navigation';
import UserBlog from 'screens/user-screen/UserBlog';
import UserComments from 'screens/user-screen/UserComments';
import CurrentUserHeader from './CurrentUserHeader';
import CurrentUserMenu from './CurrentUserMenu';

const Container = styled.View`
  flex: 1;
`;

const Loading = styled.ActivityIndicator`
  margin-top: 10px;
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  usersComments: getUsersComments(state),
  usersBlog: getUsersBlog(state),
  usersFollowCount: getUsersFollowCount(state),
  username: getAuthUsername(state),
  loadingUsersBlog: getLoadingUsersBlog(state),
  loadingUsersComments: getLoadingUsersComments(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  loadingUsersFollowCount: getLoadingUsersFollowCount(state),
  currentUserFollowList: getCurrentUserFollowList(state),
  refreshUserBlogLoading: getRefreshUserBlogLoading(state),
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  fetchUser: username => dispatch(fetchUser.action({ username })),
  fetchUserComments: (username, query) => dispatch(fetchUserComments.action({ username, query })),
  fetchUserBlog: (username, query) => dispatch(fetchUserBlog.action({ username, query })),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
  fetchCurrentUserFollowList: () => dispatch(currentUserFollowListFetch.action()),
  refreshUserBlog: username => dispatch(refreshUserBlog.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class CurrentUserProfileScreen extends Component {
  static propTypes = {
    currentUserFollowList: PropTypes.shape().isRequired,
    fetchCurrentUserFollowList: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchUserBlog: PropTypes.func.isRequired,
    fetchUserComments: PropTypes.func.isRequired,
    fetchUserFollowCount: PropTypes.func.isRequired,
    loadingUsersBlog: PropTypes.bool.isRequired,
    loadingUsersComments: PropTypes.bool.isRequired,
    logoutUser: PropTypes.func.isRequired,
    refreshUserBlog: PropTypes.func.isRequired,
    refreshUserBlogLoading: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    usersBlog: PropTypes.shape().isRequired,
    usersComments: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    refreshUserBlogLoading: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentMenuOption: userMenuConstants.BLOG,
      menuVisible: false,
    };

    this.toggleCurrentUserMenu = this.toggleCurrentUserMenu.bind(this);
    this.hideCurrentUserMenu = this.hideCurrentUserMenu.bind(this);
    this.showCurrentUserMenu = this.showCurrentUserMenu.bind(this);
    this.handleChangeUserMenu = this.handleChangeUserMenu.bind(this);
    this.fetchMoreUserComments = this.fetchMoreUserComments.bind(this);
    this.fetchMoreUserPosts = this.fetchMoreUserPosts.bind(this);
    this.handleRefreshUserBlog = this.handleRefreshUserBlog.bind(this);
  }

  componentDidMount() {
    const {
      username,
      usersDetails,
      usersComments,
      usersBlog,
      usersFollowCount,
      currentUserFollowList,
    } = this.props;
    const userDetails = _.get(usersDetails, username, []);
    const userComments = _.get(usersComments, username, []);
    const userBlog = _.get(usersBlog, username, []);
    const userFollowCount = _.get(usersFollowCount, username, {});

    if (_.isEmpty(userDetails)) {
      this.props.fetchUser(username);
    }

    if (_.isEmpty(userBlog)) {
      const query = { tag: username, limit: 10 };
      this.props.fetchUserBlog(username, query);
    }

    if (_.isEmpty(userComments)) {
      const query = { start_author: username, limit: 10 };
      this.props.fetchUserComments(username, query);
    }

    if (_.isEmpty(userFollowCount)) {
      this.props.fetchUserFollowCount(username);
    }

    if (_.isEmpty(currentUserFollowList)) {
      this.props.fetchCurrentUserFollowList();
    }
  }

  toggleCurrentUserMenu() {
    const { menuVisible } = this.state;
    if (menuVisible) {
      this.hideCurrentUserMenu();
    } else {
      this.showCurrentUserMenu();
    }
  }

  hideCurrentUserMenu() {
    this.setState({
      menuVisible: false,
    });
  }

  showCurrentUserMenu() {
    this.setState({
      menuVisible: true,
    });
  }

  resetAuthUserInAsyncStorage = async () => {
    try {
      AsyncStorage.setItem(STEEM_ACCESS_TOKEN, '');
      AsyncStorage.setItem(AUTH_EXPIRATION, '');
      AsyncStorage.setItem(AUTH_USERNAME, '');
      AsyncStorage.setItem(AUTH_MAX_EXPIRATION_AGE, '');
    } catch (e) {
      console.log('FAILED TO RESET ASYNC STORAGE FOR AUTH USER');
    }
  };

  handleRefreshUserBlog() {
    const { username } = this.props;
    this.props.refreshUserBlog(username);
  }

  handleChangeUserMenu(option) {
    const { username } = this.props;
    switch (option.id) {
      case userMenuConstants.FOLLOWERS.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.navigate(navigationConstants.USER_FOLLOWERS, { username }),
        );
        break;
      case userMenuConstants.FOLLOWING.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.navigate(navigationConstants.USER_FOLLOWING, { username }),
        );
        break;
      case userMenuConstants.ACTIVITY.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.navigate(navigationConstants.USER_ACTIVITY, { username }),
        );
        break;
      case userMenuConstants.WALLET.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.navigate(navigationConstants.USER_WALLET, { username }),
        );
        break;
      case userMenuConstants.LOGOUT.id:
        sc2
          .revokeToken()
          .then(() => {
            this.resetAuthUserInAsyncStorage();
            this.props.logoutUser();
          })
          .catch(() => {
            // TODO errors out here, still need to fix why sc2 is breaking
            this.resetAuthUserInAsyncStorage();
            this.props.logoutUser();
          });
        break;
      default:
        this.setState({
          currentMenuOption: option,
          menuVisible: false,
        });
        break;
    }
  }

  fetchMoreUserPosts() {
    const { username, usersBlog } = this.props;
    const userBlog = _.get(usersBlog, username, []);

    if (_.isEmpty(userBlog)) {
      const query = { tag: username, limit: 10 };
      this.props.fetchUserBlog(username, query, true);
    } else {
      const lastPost = _.last(userBlog);
      const query = {
        tag: username,
        start_author: lastPost.author,
        start_permlink: lastPost.permlink,
        limit: 10,
      };
      this.props.fetchUserBlog(username, query);
    }
  }

  fetchMoreUserComments() {
    const { usersComments, username } = this.props;
    const userComments = _.get(usersComments, username, []);

    if (_.isEmpty(usersComments)) {
      const query = { start_author: username, limit: 10 };
      this.props.fetchUserComments(username, query, true);
    } else {
      const lastComment = _.last(userComments);
      const query = { start_author: username, limit: 10, start_permlink: lastComment.permlink };
      this.props.fetchUserComments(username, query);
    }
  }

  renderUserContent() {
    const { currentMenuOption } = this.state;
    const { username, usersComments, usersBlog, refreshUserBlogLoading } = this.props;
    const userComments = _.get(usersComments, username, []);
    const userBlog = _.get(usersBlog, username, []);

    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return (
          <UserComments
            userComments={userComments}
            navigation={this.props.navigation}
            fetchMoreUserComments={this.fetchMoreUserComments}
            isCurrentUser
            username={username}
          />
        );
      case userMenuConstants.BLOG.id:
        return (
          <UserBlog
            navigation={this.props.navigation}
            userBlog={userBlog}
            username={username}
            fetchMoreUserPosts={this.fetchMoreUserPosts}
            isCurrentUser
            refreshUserBlog={this.handleRefreshUserBlog}
            loadingUserBlog={refreshUserBlogLoading}
          />
        );
      default:
        return null;
    }
  }

  renderLoader() {
    const { currentMenuOption } = this.state;
    const { loadingUsersComments, loadingUsersBlog } = this.props;

    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return loadingUsersComments && <Loading color={COLORS.BLUE.MARINER} size="large" />;
      case userMenuConstants.BLOG.id:
        return loadingUsersBlog && <Loading color={COLORS.BLUE.MARINER} size="large" />;
      default:
        return null;
    }
  }

  render() {
    const { currentMenuOption, menuVisible } = this.state;
    return (
      <Container>
        <CurrentUserHeader
          currentMenuOption={currentMenuOption}
          toggleCurrentUserMenu={this.toggleCurrentUserMenu}
        />
        {this.renderUserContent()}
        {this.renderLoader()}
        <Modal
          animationType="slide"
          transparent
          visible={menuVisible}
          onRequestClose={this.hideCurrentUserMenu}
        >
          <CurrentUserMenu
            hideMenu={this.hideCurrentUserMenu}
            handleChangeUserMenu={this.handleChangeUserMenu}
          />
        </Modal>
      </Container>
    );
  }
}

export default CurrentUserProfileScreen;
