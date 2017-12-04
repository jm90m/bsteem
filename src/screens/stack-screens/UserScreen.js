import React, { Component } from 'react';
import styled from 'styled-components/native';
import steem from 'steem';
import { ListView, Modal, Text, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { fetchUser } from 'state/actions/usersActions';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import * as userMenuConstants from 'constants/userMenu';
import { BLOG } from 'constants/userMenu';
import API from 'api/api';
import PostPreview from 'components/post-preview/PostPreview';
import CommentsPreview from 'components/user/CommentsPreview';
import UserHeader from 'components/user/UserHeader';
import UserMenu from 'components/user/UserMenu';

const Container = styled.View`
  flex: 1;
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
  flex-direction: row;
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
  usersMap: state.users.usersMap,
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser(username)),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class UserScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      userPostsDataSource: ds.cloneWithRows([]),
      userPosts: [],
      userComments: [],
      userCommentsDataSource: ds.cloneWithRows([]),
      menuVisible: false,
      currentMenuOption: BLOG,
      followingCount: 0,
      followerCount: 0,
    };

    this.fetchMoreUserPosts = this.fetchMoreUserPosts.bind(this);
    this.setMenuVisible = this.setMenuVisible.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleChangeUserMenu = this.handleChangeUserMenu.bind(this);
    this.renderUserPostRow = this.renderUserPostRow.bind(this);
    this.renderUserCommentsRow = this.renderUserCommentsRow.bind(this);
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUser(username);
    const query = { tag: username, limit: 10 };
    const commentsQuery = { start_author: username, limit: 10 };

    API.getDiscussionsByBlog(query).then(result => {
      this.setState({
        userPostsDataSource: ds.cloneWithRows(result),
        userPosts: result,
      });
    });

    API.getDiscussionsByComments(commentsQuery).then(result => {
      this.setState({
        userCommentsDataSource: ds.cloneWithRows(result),
        userComments: result,
      });
    });

    API.getFollowCount(username).then(result => {
      this.setState({
        followingCount: result.following_count,
        followerCount: result.follower_count,
      });
    });
  }

  fetchMoreUserPosts() {
    const { username } = this.props.navigation.state.params;
    const { userPosts } = this.state;
    const lastPost = _.last(userPosts);
    if (!_.isEmpty(lastPost)) {
      const query = {
        tag: username,
        limit: 11,
        start_permlink: lastPost.permlink,
        start_author: lastPost.author,
      };

      API.getDiscussionsByBlog(query).then(result => {
        const posts = this.state.userPosts.concat(_.slice(result, 1, result.length - 1));
        this.setState({
          userPostsDataSource: ds.cloneWithRows(posts),
          userPosts: posts,
        });
      });
    }
  }

  setMenuVisible(menuVisible) {
    this.setState({ menuVisible });
  }

  handleHideMenu() {
    this.setMenuVisible(false);
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

  navigateBack = () => this.props.navigation.goBack();

  renderUserContent() {
    const { currentMenuOption, userPostsDataSource, userCommentsDataSource } = this.state;
    switch (currentMenuOption.id) {
      case userMenuConstants.COMMENTS.id:
        return (
          <StyledListView
            dataSource={userCommentsDataSource}
            renderRow={this.renderUserCommentsRow}
            enableEmptySections={true}
          />
        );
      case userMenuConstants.FOLLOWING.id:
        return <Text>Following</Text>;
      case userMenuConstants.WALLET.id:
        return <Text>Wallet</Text>;
      case userMenuConstants.BLOG.id:
      default:
        return (
          <StyledListView
            dataSource={userPostsDataSource}
            renderRow={this.renderUserPostRow}
            enableEmptySections={true}
            onEndReached={this.fetchMoreUserPosts}
          />
        );
    }
  }

  render() {
    const { usersMap } = this.props;
    const { username } = this.props.navigation.state.params;
    const userDetails = usersMap[username] || {};
    const userJsonMetaData = _.attempt(JSON.parse, userDetails.json_metadata);
    const userProfile = _.isError(userJsonMetaData) ? {} : userJsonMetaData.profile;
    const hasCover = _.has(userProfile, 'cover_image');
    const { menuVisible, currentMenuOption } = this.state;
    const userReputation = _.has(userDetails, 'reputation')
      ? steem.formatter.reputation(userDetails.reputation)
      : 0;

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
          {this.renderUserContent()}
        </ScrollView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
