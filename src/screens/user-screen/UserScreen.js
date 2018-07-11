import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import {
  fetchUser,
  fetchUserComments,
  fetchUserBlog,
  fetchUserFollowCount,
  refreshUserBlog,
} from 'state/actions/usersActions';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import * as userMenuConstants from 'constants/userMenu';
import * as navigationConstants from 'constants/navigation';
import {
  getUsersDetails,
  getUsersComments,
  getUsersBlog,
  getUsersFollowCount,
  getLoadingUsersBlog,
  getLoadingUsersComments,
  getLoadingUsersDetails,
  getLoadingUsersFollowCount,
  getAuthUsername,
  getRefreshUserBlogLoading,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { getUserDetailsHelper } from 'util/bsteemUtils';
import Header from 'components/common/Header';
import Touchable from 'components/common/Touchable';
import BackButton from 'components/common/BackButton';
import PrimaryText from 'components/common/text/PrimaryText';
import commonStyles from 'styles/common';
import UserBlog from './UserBlog';
import UserComments from './UserComments';

let UserMenu = null;

const CurrentUserDisplayText = styled(PrimaryText)`
  margin-left: 5px;
  color: ${props => props.customTheme.primaryColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  usersDetails: getUsersDetails(state),
  usersComments: getUsersComments(state),
  usersBlog: getUsersBlog(state),
  usersFollowCount: getUsersFollowCount(state),
  loadingUsersBlog: getLoadingUsersBlog(state),
  loadingUsersComments: getLoadingUsersComments(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  loadingUsersFollowCount: getLoadingUsersFollowCount(state),
  refreshUserBlogLoading: getRefreshUserBlogLoading(state),
  authUsername: getAuthUsername(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser.action({ username })),
  fetchUserComments: (username, query) => dispatch(fetchUserComments.action({ username, query })),
  fetchUserBlog: (username, query) => dispatch(fetchUserBlog.action({ username, query })),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
  refreshUserBlog: username => dispatch(refreshUserBlog.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    refreshUserBlogLoading: PropTypes.bool,
    authUsername: PropTypes.string,
    navigation: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    refreshUserBlog: PropTypes.func.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersComments: PropTypes.shape().isRequired,
    usersBlog: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchUserBlog: PropTypes.func.isRequired,
    fetchUserComments: PropTypes.func.isRequired,
    fetchUserFollowCount: PropTypes.func.isRequired,
    loadingUsersBlog: PropTypes.bool,
  };

  static defaultProps = {
    authUsername: '',
    refreshUserBlogLoading: false,
    loadingUsersComments: false,
    loadingUsersBlog: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      menuVisible: false,
      currentMenuOption: userMenuConstants.BLOG,
    };

    this.fetchMoreUserPosts = this.fetchMoreUserPosts.bind(this);
    this.handleDisplayMenu = this.handleDisplayMenu.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleChangeUserMenu = this.handleChangeUserMenu.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.fetchMoreUserComments = this.fetchMoreUserComments.bind(this);
    this.handleUserBlogRefresh = this.handleUserBlogRefresh.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    const { usersDetails, usersComments, usersBlog, usersFollowCount } = this.props;
    const userDetails = getUserDetailsHelper(usersDetails, username, {});
    const userComments = getUserDetailsHelper(usersComments, username, []);
    const userBlog = getUserDetailsHelper(usersBlog, username, []);
    const userFollowCount = getUserDetailsHelper(usersFollowCount, username, {});

    if (_.isEmpty(userDetails)) {
      this.props.fetchUser(username);
    }

    if (_.isEmpty(userBlog)) {
      const query = { tag: username, limit: 10 };
      this.props.fetchUserBlog(username, query, true);
    }

    if (_.isEmpty(userComments)) {
      const query = { start_author: username, limit: 10 };
      this.props.fetchUserComments(username, query, true);
    }

    if (_.isEmpty(userFollowCount)) {
      this.props.fetchUserFollowCount(username);
    }
  }

  handleDisplayMenu() {
    if (UserMenu === null) {
      UserMenu = require('components/user/UserMenu').default;
    }
    this.setState({ menuVisible: true });
  }

  handleHideMenu() {
    this.setState({ menuVisible: false });
  }

  handleUserBlogRefresh() {
    const { username } = this.props.navigation.state.params;
    this.props.refreshUserBlog(username);
  }

  fetchMoreUserPosts() {
    const { username } = this.props.navigation.state.params;
    const { usersBlog } = this.props;
    const userBlog = getUserDetailsHelper(usersBlog, username, []);

    if (_.isEmpty(userBlog)) {
      const query = { tag: username, limit: 10 };
      this.props.fetchUserBlog(username, query, true);
    } else {
      const lastPost = _.last(userBlog);
      const query = {
        tag: username,
        start_author: _.get(lastPost, 'author', ''),
        start_permlink: _.get(lastPost, 'permlink', ''),
        limit: 10,
      };
      this.props.fetchUserBlog(username, query);
    }
  }

  fetchMoreUserComments() {
    const { username } = this.props.navigation.state.params;
    const { usersComments } = this.props;
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

  handleChangeUserMenu(option) {
    const { username } = this.props.navigation.state.params;
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
      default:
        this.setState({
          currentMenuOption: option,
          menuVisible: false,
        });
        break;
    }
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderUserContent() {
    const { currentMenuOption } = this.state;
    const {
      navigation,
      usersDetails,
      authUsername,
      refreshUserBlogLoading,
      loadingUsersBlog,
      usersFollowCount,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    const { usersComments, usersBlog } = this.props;
    const userComments = getUserDetailsHelper(usersComments, username, []);
    const userBlog = getUserDetailsHelper(usersBlog, username, []);

    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return (
          <UserComments
            userComments={userComments}
            fetchMoreUserComments={this.fetchMoreUserComments}
            navigation={navigation}
            username={username}
          />
        );
      case userMenuConstants.BLOG.id:
      default:
        return (
          <UserBlog
            username={username}
            userBlog={userBlog}
            navigation={navigation}
            fetchMoreUserPosts={this.fetchMoreUserPosts}
            usersDetails={usersDetails}
            authUsername={authUsername}
            usersFollowCount={usersFollowCount}
            loadingUserBlog={loadingUsersBlog}
            refreshUserBlogLoading={refreshUserBlogLoading}
            refreshUserBlog={this.handleUserBlogRefresh}
          />
        );
    }
  }

  render() {
    const { customTheme, intl } = this.props;
    const { menuVisible, currentMenuOption } = this.state;
    const currentOption = _.capitalize(intl[currentMenuOption.label]);

    return (
      <View style={commonStyles.container}>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <View style={commonStyles.rowAlignedCenterContainer}>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={customTheme.primaryColor}
            />
            <CurrentUserDisplayText customTheme={customTheme}>
              {currentOption}
            </CurrentUserDisplayText>
          </View>
          <Touchable onPress={this.handleDisplayMenu}>
            <View style={commonStyles.headerMenuIconContainer}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color={customTheme.secondaryColor}
              />
            </View>
          </Touchable>
        </Header>
        {menuVisible && (
          <UserMenu
            hideMenu={this.handleHideMenu}
            handleChangeUserMenu={this.handleChangeUserMenu}
            menuVisible={menuVisible}
          />
        )}
        {this.renderUserContent()}
      </View>
    );
  }
}

export default UserScreen;
