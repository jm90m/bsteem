import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ScrollView, RefreshControl, View } from 'react-native';
import Header from 'components/common/Header';
import _ from 'lodash';
import Tag from 'components/post/Tag';
import i18n from 'i18n/i18n';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as navigationConstants from 'constants/navigation';
import { fetchSavedTags, fetchSavedPosts, fetchSavedUsers } from 'state/actions/firebaseActions';
import { COLORS, MATERIAL_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from '../constants/styles';
import {
  getSavedTags,
  getSavedPosts,
  getSavedUsers,
  getLoadingSavedTags,
  getLoadingSavedPosts,
  getLoadingSavedUsers,
} from '../state/rootReducer';
import PostPreview from '../components/saved-content/PostPreview';
import SaveTagButton from '../components/common/SaveTagButton';
import Avatar from '../components/common/Avatar';

const MenuContent = styled.View`
  flex-direction: row;
  padding: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${props => (props.selected ? COLORS.PRIMARY_COLOR : 'transparent')};
  width: 50px;
  justify-content: center;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View``;

const TagOption = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
  background-color: ${COLORS.PRIMARY_BACKGROUND_COLOR};
`;

const TagTouchble = styled.TouchableOpacity``;

const Menu = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const MenuTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
  padding: 0 20px;
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const UserContainer = styled.View`
  padding: 5px 10px;
  margin: 5px 0;
  background-color: ${COLORS.WHITE.WHITE};
`;

const Username = styled.Text`
  margin: 0 5px;
  color: ${COLORS.PRIMARY_COLOR};
  font-size: 18px;
  font-weight: bold;
`;

const EmptyContent = styled.View`
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const EmptyText = styled.Text`
  font-size: 18px;
`;

const MENU = {
  USERS: 'USERS',
  TAGS: 'TAGS',
  POSTS: 'POSTS',
};

@connect(
  state => ({
    loadingSavedTags: getLoadingSavedTags(state),
    loadingSavedPosts: getLoadingSavedPosts(state),
    loadingSavedUsers: getLoadingSavedUsers(state),
    savedTags: getSavedTags(state),
    savedPosts: getSavedPosts(state),
    savedUsers: getSavedUsers(state),
  }),
  dispatch => ({
    fetchSavedTags: () => dispatch(fetchSavedTags.action()),
    fetchSavedPosts: () => dispatch(fetchSavedPosts.action()),
    fetchSavedUsers: () => dispatch(fetchSavedUsers.action()),
  }),
)
class SavedContentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchSavedTags: PropTypes.func.isRequired,
    fetchSavedPosts: PropTypes.func.isRequired,
    fetchSavedUsers: PropTypes.func.isRequired,
    savedTags: PropTypes.arrayOf(PropTypes.string),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
    savedUsers: PropTypes.arrayOf(PropTypes.string),
    loadingSavedTags: PropTypes.bool.isRequired,
    loadingSavedPosts: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSavedTags: props.savedTags,
      currentSavedPosts: props.savedPosts,
      currentSavedUsers: props.savedUsers,
      menu: MENU.TAGS,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleNavigateTag = this.handleNavigateTag.bind(this);
    this.handleNavigatePost = this.handleNavigatePost.bind(this);
    this.handleNavigateUser = this.handleNavigateUser.bind(this);
    this.onRefreshContent = this.onRefreshContent.bind(this);
    this.handleShowTags = this.handleShowTags.bind(this);
    this.handleShowPosts = this.handleShowPosts.bind(this);
    this.handleShowUsers = this.handleShowUsers.bind(this);
  }

  componentDidMount() {
    this.props.fetchSavedTags();
    this.props.fetchSavedPosts();
    this.props.fetchSavedUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSavedTags: _.union(this.state.currentSavedTags, nextProps.savedTags),
      currentSavedPosts: _.unionBy(this.state.currentSavedPosts, nextProps.savedPosts, 'id'),
      currentSavedUsers: _.union(this.state.currentSavedUsers, nextProps.savedUsers),
    });
  }

  onRefreshContent() {
    this.props.fetchSavedTags();
    this.props.fetchSavedPosts();
    this.props.fetchSavedUsers();
  }

  handleNavigateTag(tag) {
    this.props.navigation.navigate(navigationConstants.FEED, {
      tag,
    });
  }

  handleNavigatePost(author, permlink) {
    this.props.navigation.navigate(navigationConstants.FETCH_POST, {
      author,
      permlink,
    });
  }

  handleNavigateUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  handleShowTags() {
    this.setState({
      menu: MENU.TAGS,
    });
  }

  handleShowPosts() {
    this.setState({
      menu: MENU.POSTS,
    });
  }

  handleShowUsers() {
    this.setState({
      menu: MENU.USERS,
    });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderSavedTags() {
    const { loadingSavedTags } = this.props;
    if (_.isEqual(this.state.menu, MENU.TAGS) && !loadingSavedTags) {
      const savedTags = _.map(this.state.currentSavedTags, tag => (
        <TagOption key={tag}>
          <TagTouchble onPress={() => this.handleNavigateTag(tag)}>
            <Tag tag={tag} />
          </TagTouchble>
          <SaveTagButton tag={tag} />
        </TagOption>
      ));
      return _.isEmpty(savedTags) ? (
        <EmptyContent>
          <EmptyText>{i18n.saved.emptyTags}</EmptyText>
        </EmptyContent>
      ) : (
        savedTags
      );
    }

    return null;
  }

  renderSavedUser() {
    const { loadingSavedUsers } = this.props;
    if (_.isEqual(this.state.menu, MENU.USERS) && !loadingSavedUsers) {
      const savedUsers = _.map(this.state.currentSavedUsers, username => (
        <UserContainer key={username}>
          <UserTouchable onPress={() => this.handleNavigateUser(username)}>
            <Avatar username={username} size={40} />
            <Username>{`@${username}`}</Username>
          </UserTouchable>
        </UserContainer>
      ));

      return _.isEmpty(savedUsers) ? (
        <EmptyContent>
          <EmptyText>{i18n.saved.emptyUsers}</EmptyText>
        </EmptyContent>
      ) : (
        savedUsers
      );
    }

    return null;
  }

  renderSavedPosts() {
    const { loadingSavedPosts } = this.props;
    if (_.isEqual(this.state.menu, MENU.POSTS) && !loadingSavedPosts) {
      const savedPosts = _.map(this.state.currentSavedPosts, post => (
        <PostPreview
          key={post.id}
          handleNavigatePost={() => this.handleNavigatePost(post.author, post.permlink)}
          handleNavigateUser={() => this.handleNavigateUser(post.author)}
          author={post.author}
          created={post.created}
          title={post.title}
        />
      ));
      return _.isEmpty(savedPosts) ? (
        <EmptyContent>
          <EmptyText>{i18n.saved.emptyPosts}</EmptyText>
        </EmptyContent>
      ) : (
        savedPosts
      );
    }
    return null;
  }

  render() {
    const { loadingSavedTags, loadingSavedPosts } = this.props;
    const loading = loadingSavedTags;
    const { menu } = this.state;
    const selectedUsers = _.isEqual(menu, MENU.USERS);
    const selectedTags = _.isEqual(menu, MENU.TAGS);
    const selectedPosts = _.isEqual(menu, MENU.POSTS);

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Menu>
            <MenuTouchable onPress={this.handleShowTags}>
              <MenuContent selected={selectedTags}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.tag}
                  size={ICON_SIZES.menuIcon}
                  color={selectedTags ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
                />
              </MenuContent>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowUsers}>
              <MenuContent selected={selectedUsers}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.account}
                  size={ICON_SIZES.menuIcon}
                  color={selectedUsers ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
                />
              </MenuContent>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowPosts}>
              <MenuContent selected={selectedPosts}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.posts}
                  size={ICON_SIZES.menuIcon}
                  color={selectedPosts ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
                />
              </MenuContent>
            </MenuTouchable>
          </Menu>
        </Header>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.onRefreshContent}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        >
          {this.renderSavedTags()}
          {this.renderSavedPosts()}
          {this.renderSavedUser()}
          <View style={{ height: 100 }} />
        </ScrollView>
      </Container>
    );
  }
}

export default SavedContentScreen;
