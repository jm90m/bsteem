import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import _ from 'lodash';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAPIByFilter } from 'api/api';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import Tag from 'components/post/Tag';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';
import Header from 'components/common/Header';
import SaveTagButton from 'components/common/SaveTagButton';
import { connect } from 'react-redux';
import { getCurrentUserFollowList } from 'state/rootReducer';
import i18n from 'i18n/i18n';
import BSteemModal from '../../components/common/BSteemModal';

const Container = styled.View`
  flex: 1;
`;

const StyledFlatList = styled.FlatList`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TouchableMenu = styled.TouchableOpacity`
  flex-direction: row;
`;

const Loading = styled.ActivityIndicator`
  padding: 10px;
`;

const TagContainer = styled.View`
  flex-direction: row;
`;

const EmptyFeedView = styled.View`
  padding: 20px;
  background-color: ${COLORS.WHITE.WHITE};
`;

const EmptyFeedText = styled.Text`
  font-size: 18px;
`;

const mapStateToProps = state => ({
  currentUserFollowList: getCurrentUserFollowList(state),
});

class FeedScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarVisible: false,
  };

  static propTypes = {
    currentUserFollowList: PropTypes.shape(),
  };

  static defaultProps = {
    currentUserFollowList: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      menuVisible: false,
      currentFilter: TRENDING,
      posts: [],
      filterFeedByFollowers: false,
    };

    this.fetchInitialPostsForFilter = this.fetchInitialPostsForFilter.bind(this);
    this.fetchMorePosts = this.fetchMorePosts.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.setMenuVisible = this.setMenuVisible.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.handleSortPost = this.handleSortPost.bind(this);
    this.renderLoadingOrEmptyText = this.renderLoadingOrEmptyText.bind(this);
    this.enableFilterFeedByFollowers = this.enableFilterFeedByFollowers.bind(this);
    this.disableFilterFeedByFollowers = this.disableFilterFeedByFollowers.bind(this);
    this.toggleFilterFeedByFollowers = this.toggleFilterFeedByFollowers.bind(this);
  }

  fetchInitialPostsForFilter() {
    const { tag } = this.props.navigation.state.params;
    const query = { tag, limit: 10 };
    const api = getAPIByFilter(this.state.currentFilter.id);
    api(query).then(response => {
      this.setState({
        loading: false,
        posts: response.result,
      });
    });
  }

  componentDidMount() {
    try {
      this.fetchInitialPostsForFilter();
    } catch (error) {
      console.log(error);
      this.setState({
        loading: false,
      });
    }
  }

  fetchMorePosts() {
    const { tag } = this.props.navigation.state.params;
    const { posts, currentFilter } = this.state;
    const lastPost = posts[posts.length - 1];
    const api = getAPIByFilter(currentFilter.id);
    const query = {
      tag,
      limit: 11,
      start_permlink: _.get(lastPost, 'permlink', ''),
      start_author: _.get(lastPost, 'author', ''),
    };

    api(query).then(response => {
      if (response.error) return;
      const { result } = response;
      const posts = this.state.posts.concat(result.slice(1, result.length - 1));
      this.setState({
        posts,
      });
    });
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  setMenuVisible(menuVisible) {
    this.setState({ menuVisible });
  }

  handleHideMenu() {
    this.setMenuVisible(false);
  }

  renderRow(rowData) {
    return <PostPreview postData={rowData.item} navigation={this.props.navigation} />;
  }

  handleSortPost(filter) {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.fetchInitialPostsForFilter(),
    );
  }

  enableFilterFeedByFollowers() {
    this.setState({
      filterFeedByFollowers: true,
    });
  }

  disableFilterFeedByFollowers() {
    this.setState({
      filterFeedByFollowers: false,
    });
  }

  toggleFilterFeedByFollowers() {
    const { filterFeedByFollowers } = this.state;
    if (filterFeedByFollowers) {
      this.disableFilterFeedByFollowers();
    } else {
      this.enableFilterFeedByFollowers();
    }
  }

  renderLoadingOrEmptyText(displayedPosts) {
    const { posts, loading } = this.state;
    if (loading) {
      return <Loading color={COLORS.PRIMARY_COLOR} size="large" />;
    } else if (_.isEmpty(posts)) {
      return (
        <EmptyFeedView>
          <EmptyFeedText>{i18n.feed.emptyFeed}</EmptyFeedText>
        </EmptyFeedView>
      );
    } else if (_.isEmpty(displayedPosts)) {
      return (
        <EmptyFeedView>
          <EmptyFeedText>{i18n.feed.emptyFeedCheckFilters}</EmptyFeedText>
        </EmptyFeedView>
      );
    }
    return null;
  }

  render() {
    const { currentUserFollowList } = this.props;
    const { tag } = this.props.navigation.state.params;
    const { currentFilter, menuVisible, posts, filterFeedByFollowers, loading } = this.state;
    const displayListView = _.size(posts) > 0;
    const displayedPosts = filterFeedByFollowers
      ? _.filter(posts, post => _.get(currentUserFollowList, post.author, false))
      : posts;

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TagContainer>
            <Tag tag={tag} />
            <SaveTagButton tag={tag} />
          </TagContainer>
          <TouchableMenu onPress={() => this.setMenuVisible(!menuVisible)}>
            <MaterialIcons size={24} name={currentFilter.icon} color={COLORS.PRIMARY_COLOR} />
            <MaterialCommunityIcons size={24} name={MATERIAL_COMMUNITY_ICONS.menuVertical} />
          </TouchableMenu>
        </Header>
        {menuVisible && (
          <BSteemModal visible={menuVisible} handleOnClose={this.handleHideMenu}>
            <FeedSort
              hideMenu={this.handleHideMenu}
              handleSortPost={this.handleSortPost}
              handleFilterFeedByFollowers={this.toggleFilterFeedByFollowers}
              filterFeedByFollowers={filterFeedByFollowers}
            />
          </BSteemModal>
        )}
        {this.renderLoadingOrEmptyText(displayedPosts)}
        {displayListView && (
          <StyledFlatList
            data={displayedPosts}
            renderItem={this.renderRow}
            enableEmptySections
            onEndReached={this.fetchMorePosts}
            initialNumToRender={4}
            keyExtractor={(item, index) => `${_.get(item, 'item.id', '')}${index}`}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={this.fetchInitialPostsForFilter}
                tintColor={COLORS.PRIMARY_COLOR}
                colors={[COLORS.PRIMARY_COLOR]}
              />
            }
          />
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps)(FeedScreen);
