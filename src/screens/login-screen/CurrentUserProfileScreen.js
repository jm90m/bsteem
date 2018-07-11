import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
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
import { logoutUser } from 'state/actions/authActions';
import sc2 from 'api/sc2';
import { AsyncStorage } from 'react-native';
import { getCurrentUserSettings } from 'state/actions/settingsActions';
import { currentUserFollowListFetch } from 'state/actions/currentUserActions';
import * as userMenuConstants from 'constants/userMenu';
import * as navigationConstants from 'constants/navigation';
import { getUserDetailsHelper } from 'util/bsteemUtils';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from 'constants/asyncStorageKeys';
import UserBlog from 'screens/user-screen/UserBlog';
import UserComments from 'screens/user-screen/UserComments';
import BSteemModal from 'components/common/BSteemModal';
import CurrentUserHeader from './CurrentUserHeader';
import CurrentUserMenu from './CurrentUserMenu';
import commonStyles from 'styles/common';

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
  getCurrentUserSettings: () => dispatch(getCurrentUserSettings.action()),
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
    refreshUserBlog: PropTypes.func.isRequired,
    refreshUserBlogLoading: PropTypes.bool,
    navigation: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    usersBlog: PropTypes.shape().isRequired,
    usersComments: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    getCurrentUserSettings: PropTypes.func.isRequired,
    loadingUsersBlog: PropTypes.bool.isRequired,
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
    this.handleNavigateToEditProfile = this.handleNavigateToEditProfile.bind(this);
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
    const userDetails = getUserDetailsHelper(usersDetails, username, []);
    const userComments = getUserDetailsHelper(usersComments, username, []);
    const userBlog = getUserDetailsHelper(usersBlog, username, []);
    const userFollowCount = getUserDetailsHelper(usersFollowCount, username, {});

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

  handleRefreshUserBlog() {
    const { username } = this.props;
    this.props.refreshUserBlog(username);
  }

  async resetAuthUserInAsyncStorage() {
    try {
      AsyncStorage.setItem(STEEM_ACCESS_TOKEN, '');
      AsyncStorage.setItem(AUTH_EXPIRATION, '');
      AsyncStorage.setItem(AUTH_USERNAME, '');
      AsyncStorage.setItem(AUTH_MAX_EXPIRATION_AGE, '');
    } catch (e) {
      console.log('FAILED TO RESET ASYNC STORAGE FOR AUTH USER');
    }
  }

  handleLogout() {
    sc2
      .revokeToken()
      .then(() => {
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
        this.props.getCurrentUserSettings();
      })
      .catch(() => {
        console.log('SC2 fail - but logout anyways');
        // TODO errors out here, still need to fix why sc2 is breaking
        this.resetAuthUserInAsyncStorage();
        this.props.logoutUser();
      });
  }

  handleChangeUserMenu(option) {
    const { username } = this.props;
    switch (option.id) {
      case userMenuConstants.FOLLOWERS.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.push(navigationConstants.USER_FOLLOWERS, { username }),
        );
        break;
      case userMenuConstants.FOLLOWING.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.push(navigationConstants.USER_FOLLOWING, { username }),
        );
        break;
      case userMenuConstants.ACTIVITY.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.push(navigationConstants.USER_ACTIVITY, { username }),
        );
        break;
      case userMenuConstants.WALLET.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.push(navigationConstants.USER_WALLET, { username }),
        );
        break;
      case userMenuConstants.REPLIES.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.push(navigationConstants.USER_REPLIES, { username }),
        );
        break;
      case userMenuConstants.LOGOUT.id:
        this.handleLogout();
        break;
      case userMenuConstants.SETTINGS.id:
        this.setState(
          {
            menuVisible: false,
          },
          () => this.props.navigation.navigate(navigationConstants.SETTINGS),
        );
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
    const userBlog = getUserDetailsHelper(usersBlog, username, []);

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
    const userComments = getUserDetailsHelper(usersComments, username, []);

    if (_.isEmpty(usersComments)) {
      const query = { start_author: username, limit: 10 };
      this.props.fetchUserComments(username, query, true);
    } else {
      const lastComment = _.last(userComments) || {};
      const query = { start_author: username, limit: 10, start_permlink: lastComment.permlink };
      this.props.fetchUserComments(username, query);
    }
  }

  handleNavigateToEditProfile() {
    this.props.navigation.navigate(navigationConstants.EDIT_PROFILE);
  }

  renderUserContent() {
    const { currentMenuOption } = this.state;
    const {
      username,
      usersComments,
      usersBlog,
      refreshUserBlogLoading,
      loadingUsersBlog,
    } = this.props;
    const userComments = getUserDetailsHelper(usersComments, username, []);
    const userBlog = getUserDetailsHelper(usersBlog, username, []);

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
            loadingUserBlog={loadingUsersBlog}
            refreshUserBlogLoading={refreshUserBlogLoading}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const { currentMenuOption, menuVisible } = this.state;
    return (
      <View style={commonStyles.container}>
        <CurrentUserHeader
          currentMenuOption={currentMenuOption}
          toggleCurrentUserMenu={this.toggleCurrentUserMenu}
          handleNavigateToEditProfile={this.handleNavigateToEditProfile}
        />
        {this.renderUserContent()}
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.hideCurrentUserMenu}>
            <CurrentUserMenu
              hideMenu={this.hideCurrentUserMenu}
              handleChangeUserMenu={this.handleChangeUserMenu}
            />
          </BSteemModal>
        )}
      </View>
    );
  }
}

export default CurrentUserProfileScreen;
