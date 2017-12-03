import React, { Component } from 'react';
import styled from 'styled-components/native';
import { ListView, Modal } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { fetchUser } from 'state/actions/usersActions';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { BLOG } from 'constants/userMenu';
import API from 'api/api';
import PostPreview from 'components/post-preview/PostPreview';
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
      menuVisible: false,
      currentMenuOption: BLOG,
    };
  }

  componentDidMount() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUser(username);
    const query = { tag: username, limit: 10 };
    API.getDiscussionsByBlog(query).then(result => {
      this.setState({
        userPostsDataSource: ds.cloneWithRows(result),
        userPosts: result,
      });
    });
  }

  fetchMoreUserPosts = () => {
    const { username } = this.props.navigation.state.params;
    const { userPosts } = this.state;
    const lastPost = _.last(userPosts);
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
  };

  setMenuVisible = menuVisible => this.setState({ menuVisible });
  handleHideMenu = () => this.setMenuVisible(false);
  handleChangeUserMenu = option =>
    this.setState({
      currentMenuOption: option,
      menuVisible: false,
    });
  renderRow = rowData => {
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  };

  navigateBack = () => this.props.navigation.goBack();

  render() {
    const { usersMap } = this.props;
    const { username } = this.props.navigation.state.params;
    const { menuVisible, currentMenuOption } = this.state;

    console.log(usersMap[username]);

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
        <UserHeader username={username} />
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
        <StyledListView
          dataSource={this.state.userPostsDataSource}
          renderRow={this.renderRow}
          enableEmptySections={true}
          onEndReached={this.fetchMoreUserPosts}
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
