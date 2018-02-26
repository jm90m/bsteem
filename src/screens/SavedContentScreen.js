import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { ScrollView, RefreshControl, View } from 'react-native';
import Header from 'components/common/Header';
import _ from 'lodash';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Tag from 'components/post/Tag';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import i18n from 'i18n/i18n';
import * as navigationConstants from 'constants/navigation';
import { fetchSavedTags, fetchSavedPosts } from 'state/actions/firebaseActions';
import { COLORS, MATERIAL_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from '../constants/styles';
import {
  getLoadingSavedTags,
  getSavedPosts,
  getSavedTags,
  getLoadingSavedPosts,
} from '../state/rootReducer';
import PostPreview from '../components/saved-content/PostPreview';
import SaveTagButton from '../components/common/SaveTagButton';

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const Container = styled.View``;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

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
`;

const MENU = {
  TAGS: 'tags',
  POSTS: 'posts',
};

@connect(
  state => ({
    loadingSavedTags: getLoadingSavedTags(state),
    loadingSavedPosts: getLoadingSavedPosts(state),
    savedTags: getSavedTags(state),
    savedPosts: getSavedPosts(state),
  }),
  dispatch => ({
    fetchSavedTags: () => dispatch(fetchSavedTags.action()),
    fetchSavedPosts: () => dispatch(fetchSavedPosts.action()),
  }),
)
class SavedContentScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    fetchSavedTags: PropTypes.func.isRequired,
    fetchSavedPosts: PropTypes.func.isRequired,
    savedTags: PropTypes.arrayOf(PropTypes.string),
    savedPosts: PropTypes.arrayOf(PropTypes.shape()),
    loadingSavedTags: PropTypes.bool.isRequired,
    loadingSavedPosts: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSavedTags: props.savedTags,
      currentSavedPosts: props.savedPosts,
      menu: MENU.TAGS,
    };

    this.navigateBack = this.navigateBack.bind(this);
    this.handleNavigateTag = this.handleNavigateTag.bind(this);
    this.handleNavigatePost = this.handleNavigatePost.bind(this);
    this.handleNavigateUser = this.handleNavigateUser.bind(this);
    this.onRefreshContent = this.onRefreshContent.bind(this);
    this.handleShowTags = this.handleShowTags.bind(this);
    this.handleShowPosts = this.handleShowPosts.bind(this);
  }

  componentDidMount() {
    this.props.fetchSavedTags();
    this.props.fetchSavedPosts();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSavedTags: _.union(this.state.currentSavedTags, nextProps.savedTags),
      currentSavedPosts: _.unionBy(this.state.currentSavedPosts, nextProps.savedPosts, 'id'),
    });
  }

  onRefreshContent() {
    this.props.fetchSavedTags();
    this.props.fetchSavedPosts();
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

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderSavedTags() {
    if (_.isEqual(this.state.menu, MENU.TAGS)) {
      return _.map(this.state.currentSavedTags, tag => (
        <TagOption key={tag}>
          <TagTouchble onPress={() => this.handleNavigateTag(tag)}>
            <Tag tag={tag} />
          </TagTouchble>
          <SaveTagButton tag={tag} />
        </TagOption>
      ));
    }

    return null;
  }

  renderSavedPosts() {
    if (_.isEqual(this.state.menu, MENU.POSTS)) {
      return _.map(this.state.currentSavedPosts, post => (
        <PostPreview
          key={post.id}
          handleNavigatePost={() => this.handleNavigatePost(post.author, post.permlink)}
          handleNavigateUser={() => this.handleNavigateUser(post.author)}
          author={post.author}
          created={post.created}
          title={post.title}
        />
      ));
    }
    return null;
  }

  render() {
    const { loadingSavedTags, loadingSavedPosts } = this.props;
    const loading = loadingSavedTags || loadingSavedPosts;
    const { menu } = this.state;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={ICON_SIZES.menuIcon} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Menu>
            <MenuTouchable onPress={this.handleShowTags}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.tag}
                color={menu === MENU.TAGS ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
              />
            </MenuTouchable>
            <MenuTouchable onPress={this.handleShowPosts}>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.posts}
                color={menu === MENU.POSTS ? COLORS.PRIMARY_COLOR : COLORS.SECONDARY_COLOR}
              />
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
          <View style={{ height: 100 }} />
        </ScrollView>
      </Container>
    );
  }
}

export default SavedContentScreen;
