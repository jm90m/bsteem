import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Modal, Text } from 'react-native';
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
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
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
} from 'state/rootReducer';
import UserMenu from 'components/user/UserMenu';
import Header from 'components/common/Header';
import UserBlog from './UserBlog';
import UserComments from './UserComments';

const Container = styled.View`
  flex: 1;
`;

const Loading = styled.ActivityIndicator`
  margin-top: 10px;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TouchableMenu = styled.TouchableOpacity``;

const TouchableMenuContainer = styled.View`
  padding: 5px;
`;

const CurrentUserDisplay = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CurrentUserDisplayText = styled.Text`
  margin-left: 5px;
  color: ${COLORS.BLUE.MARINER};
`;

const mapStateToProps = state => ({
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
  };

  static propTypes = {
    refreshUserBlogLoading: PropTypes.bool,
    authUsername: PropTypes.string,
    navigation: PropTypes.shape().isRequired,
    refreshUserBlog: PropTypes.func.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersComments: PropTypes.shape().isRequired,
    usersBlog: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
    fetchUser: PropTypes.func.isRequired,
    fetchUserBlog: PropTypes.func.isRequired,
    fetchUserComments: PropTypes.func.isRequired,
    fetchUserFollowCount: PropTypes.func.isRequired,
    loadingUsersComments: PropTypes.bool,
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
    this.setMenuVisible = this.setMenuVisible.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleChangeUserMenu = this.handleChangeUserMenu.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.fetchMoreUserComments = this.fetchMoreUserComments.bind(this);
    this.handleUserBlogRefresh = this.handleUserBlogRefresh.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    const { usersDetails, usersComments, usersBlog, usersFollowCount } = this.props;
    const userDetails = usersDetails[username];
    const userComments = usersComments[username];
    const userBlog = usersBlog[username];
    const userFollowCount = usersFollowCount[username];

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

  setMenuVisible(menuVisible) {
    this.setState({ menuVisible });
  }

  handleHideMenu() {
    this.setMenuVisible(false);
  }

  handleUserBlogRefresh() {
    const { username } = this.props.navigation.state.params;
    this.props.refreshUserBlog(username);
  }

  fetchMoreUserPosts() {
    const { username } = this.props.navigation.state.params;
    const { usersBlog } = this.props;
    const userBlog = usersBlog[username];

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
    const { username } = this.props.navigation.state.params;
    const { usersComments } = this.props;
    const userComments = usersComments[username];

    if (_.isEmpty(usersComments)) {
      const query = { start_author: username, limit: 10 };
      this.props.fetchUserComments(username, query, true);
    } else {
      const lastComment = _.last(userComments);
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
      usersFollowCount,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    const { usersComments, usersBlog } = this.props;
    const userComments = usersComments[username] || [];
    const userBlog = usersBlog[username] || [];

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
      case userMenuConstants.FOLLOWERS.id:
        return <Text>Followers</Text>;
      case userMenuConstants.FOLLOWING.id:
        return <Text>Following</Text>;
      case userMenuConstants.WALLET.id:
        return <Text>Wallet</Text>;
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
            loadingUserBlog={refreshUserBlogLoading}
            refreshUserBlog={this.handleUserBlogRefresh}
          />
        );
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
    const { menuVisible, currentMenuOption } = this.state;

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <CurrentUserDisplay>
            <MaterialIcons
              size={ICON_SIZES.menuIcon}
              name={currentMenuOption.icon}
              color={COLORS.BLUE.MARINER}
            />
            <CurrentUserDisplayText>{currentMenuOption.label}</CurrentUserDisplayText>
          </CurrentUserDisplay>
          <TouchableMenu onPress={() => this.setMenuVisible(!menuVisible)}>
            <TouchableMenuContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              />
            </TouchableMenuContainer>
          </TouchableMenu>
        </Header>
        <Modal
          animationType="slide"
          transparent
          visible={this.state.menuVisible}
          onRequestClose={this.handleHideMenu}
        >
          <UserMenu
            hideMenu={this.handleHideMenu}
            handleChangeUserMenu={this.handleChangeUserMenu}
          />
        </Modal>
        {this.renderUserContent()}
        {this.renderLoader()}
      </Container>
    );
  }
}

export default UserScreen;
