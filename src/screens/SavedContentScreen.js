import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ScrollView, RefreshControl, View } from 'react-native';
import Header from 'components/common/Header';
import _ from 'lodash';
import Tag from 'components/post/Tag';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TitleText from 'components/common/TitleText';
import * as navigationConstants from 'constants/navigation';
import { fetchSavedTags, fetchSavedPosts, fetchSavedUsers } from 'state/actions/firebaseActions';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import BackButton from 'components/common/BackButton';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { fetchSavedOfflinePosts } from 'state/actions/postsActions';
import {
  getSavedTags,
  getSavedPosts,
  getSavedUsers,
  getLoadingSavedTags,
  getLoadingSavedPosts,
  getLoadingSavedUsers,
  getCustomTheme,
  getIntl,
  getSavedOfflinePosts,
} from '../state/rootReducer';
import PostPreview from '../components/saved-content/PostPreview';
import SaveTagButton from '../components/common/SaveTagButton';
import Avatar from '../components/common/Avatar';
import SaveUserButton from '../components/common/SaveUserButton';
import { jsonParse } from '../util/bsteemUtils';

const MenuContent = styled.View`
  flex-direction: row;
  padding: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${props =>
    props.selected ? props.customTheme.primaryColor : 'transparent'};
  width: 50px;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
`;

const TagOption = styled(StyledViewPrimaryBackground)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin: 5px 0;
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

const UserContainer = styled(StyledViewPrimaryBackground)`
  padding: 5px 10px;
  margin: 5px 0;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const Username = styled(TitleText)`
  margin: 0 5px;
  font-size: 18px;
`;

const EmptyContent = styled(StyledViewPrimaryBackground)`
  padding: 20px;
`;

const EmptyText = styled(StyledTextByBackground)`
  font-size: 18px;
`;

const MENU = {
  USERS: 'USERS',
  TAGS: 'TAGS',
  POSTS: 'POSTS',
};

@connect(
  state => ({
    customTheme: getCustomTheme(state),
    loadingSavedTags: getLoadingSavedTags(state),
    loadingSavedPosts: getLoadingSavedPosts(state),
    loadingSavedUsers: getLoadingSavedUsers(state),
    savedTags: getSavedTags(state),
    savedPosts: getSavedPosts(state),
    savedUsers: getSavedUsers(state),
    savedOfflinePosts: getSavedOfflinePosts(state),
    intl: getIntl(state),
  }),
  dispatch => ({
    fetchSavedTags: () => dispatch(fetchSavedTags.action()),
    fetchSavedPosts: () => dispatch(fetchSavedPosts.action()),
    fetchSavedUsers: () => dispatch(fetchSavedUsers.action()),
    fetchSavedOfflinePosts: postDataString =>
      dispatch(fetchSavedOfflinePosts.success({ postDataString })),
  }),
)
class SavedContentScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    fetchSavedTags: PropTypes.func.isRequired,
    fetchSavedPosts: PropTypes.func.isRequired,
    fetchSavedUsers: PropTypes.func.isRequired,
    savedTags: PropTypes.arrayOf(PropTypes.string),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
    savedUsers: PropTypes.arrayOf(PropTypes.string),
    savedOfflinePosts: PropTypes.shape().isRequired,
    loadingSavedTags: PropTypes.bool.isRequired,
    loadingSavedPosts: PropTypes.bool.isRequired,
    fetchSavedOfflinePosts: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSavedTags: props.savedTags,
      currentSavedPosts: props.savedPosts,
      currentSavedUsers: props.savedUsers,
      menu: MENU.TAGS,
      refreshing: false,
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
    this.setState({
      refreshing: true,
    });
    this.props.fetchSavedTags();
    this.props.fetchSavedPosts();
    this.props.fetchSavedUsers();
    this.props.fetchSavedOfflinePosts();
    this.setState({
      refreshing: false,
    });
  }

  handleNavigateTag(tag) {
    this.props.navigation.push(navigationConstants.FEED, {
      tag,
    });
  }

  handleNavigatePost(author, permlink) {
    this.props.navigation.push(navigationConstants.POST, {
      author,
      permlink,
    });
  }

  handleNavigateToOfflinePost(postData) {
    const { title, category, author, json_metadata, body, permlink, id } = postData;
    const parsedJsonMetadata = jsonParse(json_metadata);
    this.props.navigation.push(navigationConstants.POST, {
      title,
      body,
      permlink,
      author,
      parsedJsonMetadata,
      category,
      postId: id,
      postData,
    });
  }

  handleNavigateUser(username) {
    this.props.navigation.push(navigationConstants.USER, { username });
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
    const { loadingSavedTags, intl } = this.props;
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
          <EmptyText>{intl.saved_empty_tags}</EmptyText>
        </EmptyContent>
      ) : (
        savedTags
      );
    }

    return null;
  }

  renderSavedUser() {
    const { loadingSavedUsers, intl } = this.props;
    if (_.isEqual(this.state.menu, MENU.USERS) && !loadingSavedUsers) {
      const savedUsers = _.map(this.state.currentSavedUsers, username => (
        <UserContainer key={username}>
          <UserTouchable onPress={() => this.handleNavigateUser(username)}>
            <Avatar username={username} size={40} />
            <Username>{`${username}`}</Username>
          </UserTouchable>
          <SaveUserButton username={username} />
        </UserContainer>
      ));

      return _.isEmpty(savedUsers) ? (
        <EmptyContent>
          <EmptyText>{intl.saved_empty_users}</EmptyText>
        </EmptyContent>
      ) : (
        savedUsers
      );
    }

    return null;
  }

  renderSavedPosts() {
    const { intl, savedOfflinePosts, customTheme } = this.props;
    if (_.isEqual(this.state.menu, MENU.POSTS)) {
      const savedOfflinePostsComponents = _.compact(
        _.map(savedOfflinePosts, post => {
          if (_.isEmpty(post)) {
            return null;
          }

          return (
            <PostPreview
              key={`saved-offline-${post.id}`}
              handleNavigatePost={() => this.handleNavigateToOfflinePost(post)}
              handleNavigateUser={() => this.handleNavigateUser(post.author)}
              author={post.author}
              created={post.created}
              title={post.title}
              actionComponent={
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.contentSave}
                  size={ICON_SIZES.actionIcon}
                  color={customTheme.primaryColor}
                />
              }
            />
          );
        }),
      );
      const savedPosts = _.compact(
        _.map(this.state.currentSavedPosts, post => {
          const isSavedOffline = _.get(savedOfflinePosts, post.id, null);

          if (!_.isEmpty(isSavedOffline)) {
            return null;
          }

          return (
            <PostPreview
              key={post.id}
              handleNavigatePost={() => this.handleNavigatePost(post.author, post.permlink)}
              handleNavigateUser={() => this.handleNavigateUser(post.author)}
              author={post.author}
              created={post.created}
              title={post.title}
            />
          );
        }),
      );
      const combinedSavedPosts = _.concat(savedOfflinePostsComponents, savedPosts);

      return _.isEmpty(combinedSavedPosts) ? (
        <EmptyContent>
          <EmptyText>{intl.saved_empty_posts}</EmptyText>
        </EmptyContent>
      ) : (
        combinedSavedPosts
      );
    }
    return null;
  }

  render() {
    const { customTheme } = this.props;
    const { menu, refreshing } = this.state;
    const selectedUsers = _.isEqual(menu, MENU.USERS);
    const selectedTags = _.isEqual(menu, MENU.TAGS);
    const selectedPosts = _.isEqual(menu, MENU.POSTS);

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
          <Menu>
            <MenuTouchable onPress={this.handleShowTags}>
              <MenuContent selected={selectedTags} customTheme={customTheme}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.tag}
                  size={ICON_SIZES.menuIcon}
                  color={selectedTags ? customTheme.primaryColor : customTheme.secondaryColor}
                />
              </MenuContent>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowUsers}>
              <MenuContent selected={selectedUsers} customTheme={customTheme}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.account}
                  size={ICON_SIZES.menuIcon}
                  color={selectedUsers ? customTheme.primaryColor : customTheme.secondaryColor}
                />
              </MenuContent>
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowPosts}>
              <MenuContent selected={selectedPosts} customTheme={customTheme}>
                <MaterialCommunityIcons
                  name={MATERIAL_COMMUNITY_ICONS.posts}
                  size={ICON_SIZES.menuIcon}
                  color={selectedPosts ? customTheme.primaryColor : customTheme.secondaryColor}
                />
              </MenuContent>
            </MenuTouchable>
          </Menu>
        </Header>
        <ScrollView
          style={{ backgroundColor: customTheme.primaryBackgroundColor }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefreshContent}
              colors={[customTheme.primaryColor]}
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
