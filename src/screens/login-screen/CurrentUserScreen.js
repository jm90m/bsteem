import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, ListView, AsyncStorage } from 'react-native';
import _ from 'lodash';
import sc2 from 'api/sc2';
import steem from 'steem';
import styled from 'styled-components/native';
import {
  fetchUser,
  fetchUserComments,
  fetchUserBlog,
  fetchUserFollowCount,
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
import PostPreview from 'components/post-preview/PostPreview';
import CommentsPreview from 'components/user/user-comments/CommentsPreview';
import UserHeader from 'components/user/user-header/UserHeader';
import CurrentUserHeader from './CurrentUserHeader';
import CurrentUserMenu from './CurrentUserMenu';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View`
  flex: 1;
`;

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
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
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  fetchUser: username => dispatch(fetchUser.action({ username })),
  fetchUserComments: (username, query) => dispatch(fetchUserComments.action({ username, query })),
  fetchUserBlog: (username, query) => dispatch(fetchUserBlog.action({ username, query })),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
  fetchCurrentUserFollowList: () => dispatch(currentUserFollowListFetch.action()),
});

@connect(mapStateToProps, mapDispatchToProps)
class CurrentUserScreen extends Component {
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
    navigation: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    usersBlog: PropTypes.shape().isRequired,
    usersComments: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    usersFollowCount: PropTypes.shape().isRequired,
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
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
    this.renderUserCommentsRow = this.renderUserCommentsRow.bind(this);
    this.fetchMoreUserComments = this.fetchMoreUserComments.bind(this);
    this.fetchMoreUserPosts = this.fetchMoreUserPosts.bind(this);
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

  handleChangeUserMenu(option) {
    if (option.id === userMenuConstants.LOGOUT.id) {
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
    } else {
      this.setState({
        currentMenuOption: option,
        menuVisible: false,
      });
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

  renderUserPostRow(rowData) {
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  }

  renderUserCommentsRow(rowData) {
    return <CommentsPreview commentData={rowData} navigation={this.props.navigation} />;
  }

  renderUserContent() {
    const { currentMenuOption } = this.state;
    const { username, usersComments, usersBlog } = this.props;
    const userComments = _.get(usersComments, username, []);
    const userBlog = _.get(usersBlog, username, []);

    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return (
          <StyledListView
            dataSource={ds.cloneWithRows(userComments)}
            enableEmptySections
            renderRow={this.renderUserCommentsRow}
            onEndReached={this.fetchMoreUserComments}
          />
        );
      case userMenuConstants.BLOG.id:
      default:
        return (
          <StyledListView
            dataSource={ds.cloneWithRows(userBlog)}
            renderRow={this.renderUserPostRow}
            enableEmptySections
            onEndReached={this.fetchMoreUserPosts}
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
    const { currentMenuOption, menuVisible } = this.state;
    const { username } = this.props;

    return (
      <Container>
        <CurrentUserHeader
          currentMenuOption={currentMenuOption}
          toggleCurrentUserMenu={this.toggleCurrentUserMenu}
        />
        <UserHeader username={username} hideFollowButton />
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

export default CurrentUserScreen;
