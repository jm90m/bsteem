import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import steem from 'steem';
import { ListView, Modal, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import {
  fetchUser,
  fetchUserComments,
  fetchUserBlog,
  fetchUserFollowCount,
} from 'state/actions/usersActions';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import * as userMenuConstants from 'constants/userMenu';
import {
  getUsersDetails,
  getUsersComments,
  getUsersBlog,
  getUsersFollowCount,
  getLoadingUsersBlog,
  getLoadingUsersComments,
  getLoadingUsersDetails,
  getLoadingUsersFollowCount,
} from 'state/rootReducer';
import PostPreview from 'components/post-preview/PostPreview';
import CommentsPreview from 'components/user/user-comments/CommentsPreview';
import UserHeader from 'components/user/UserHeader';
import UserMenu from 'components/user/UserMenu';
import UserStats from 'components/user/UserStats';
import UserProfile from 'components/user/user-profile/UserProfile';

const Container = styled.View`
  flex: 1;
`;

const Loading = styled.ActivityIndicator`
  margin-top: 10px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  width: 100%;
  padding-top: 10px;
  min-height: 45px;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TouchableMenu = styled.TouchableOpacity`
  padding: 5px;
`;

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
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
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser.action({ username })),
  fetchUserComments: (username, query) => dispatch(fetchUserComments.action({ username, query })),
  fetchUserBlog: (username, query) => dispatch(fetchUserBlog.action({ username, query })),
  fetchUserFollowCount: username => dispatch(fetchUserFollowCount.action({ username })),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class UserScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
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
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
    this.renderUserCommentsRow = this.renderUserCommentsRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.fetchMoreUserComments = this.fetchMoreUserComments.bind(this);
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

  fetchMoreUserPosts() {
    const { username } = this.props.navigation.state.params;
    const { usersBlog, usersDetails } = this.props;
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

  setMenuVisible(menuVisible) {
    this.setState({ menuVisible });
  }

  handleHideMenu() {
    this.setMenuVisible(false);
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
    this.setState({
      currentMenuOption: option,
      menuVisible: false,
    });
  }

  renderUserPostRow(rowData) {
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  }

  renderUserCommentsRow(rowData) {
    return <CommentsPreview commentData={rowData} navigation={this.props.navigation} />;
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderUserContent() {
    const { currentMenuOption } = this.state;
    const { username } = this.props.navigation.state.params;
    const { usersComments, usersBlog } = this.props;
    const userComments = usersComments[username] || [];
    const userBlog = usersBlog[username] || [];

    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return (
          <StyledListView
            dataSource={ds.cloneWithRows(userComments)}
            renderRow={this.renderUserCommentsRow}
            enableEmptySections
            onEndReached={this.fetchMoreUserComments}
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
    const { usersDetails, usersFollowCount } = this.props;
    const { username } = this.props.navigation.state.params;
    const userDetails = usersDetails[username] || {};
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
    const userFollowCount = usersFollowCount[username];
    const hasCover = _.has(userProfile, 'cover_image');
    const { menuVisible, currentMenuOption } = this.state;
    const userReputation = _.has(userDetails, 'reputation')
      ? steem.formatter.reputation(userDetails.reputation)
      : 0;
    const followerCount = _.get(userFollowCount, 'follower_count', 0);
    const followingCount = _.get(userFollowCount, 'following_count', 0);
    const postCount = _.get(userDetails, 'post_count', 0);

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
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
            />
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
        <ScrollView>
          <UserHeader username={username} hasCover={hasCover} userReputation={userReputation} />
          <UserStats
            postCount={postCount}
            followerCount={followerCount}
            followingCount={followingCount}
          />
          <UserProfile userProfile={userProfile} />
          {this.renderUserContent()}
          {this.renderLoader()}
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
