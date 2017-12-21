import React, { Component } from 'react';
import { ListView, Modal, Text } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAPIByFilter } from 'api/api';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import Tag from 'components/post/Tag';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';

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
  padding-top: 20px;
  min-height: 45px;
`;

const StyledListView = styled.ListView`
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

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class FeedScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows([]),
      loading: true,
      menuVisible: false,
      currentFilter: TRENDING,
    };
  }

  fetchInitialPostsForFilter = () => {
    const { tag } = this.props.navigation.state.params;
    const query = { tag, limit: 10 };
    const api = getAPIByFilter(this.state.currentFilter.id);
    api(query).then(result => {
      this.setState({
        loading: false,
        dataSource: ds.cloneWithRows(result),
        posts: result,
      });
    });
  };

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

  fetchMorePosts = () => {
    const { tag } = this.props.navigation.state.params;
    const { posts, currentFilter } = this.state;
    const lastPost = posts[posts.length - 1];
    const api = getAPIByFilter(currentFilter.id);
    const query = {
      tag,
      limit: 11,
      start_permlink: lastPost.permlink,
      start_author: lastPost.author,
    };

    api(query).then(result => {
      const posts = this.state.posts.concat(result.slice(1, result.length - 1));
      this.setState({
        dataSource: ds.cloneWithRows(posts),
        posts,
      });
    });
  };

  navigateBack = () => this.props.navigation.goBack();

  setMenuVisible = menuVisible => this.setState({ menuVisible });

  handleHideMenu = () => this.setMenuVisible(false);

  renderRow = rowData => <PostPreview postData={rowData} navigation={this.props.navigation} />;

  handleSortPost = filter => {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.fetchInitialPostsForFilter(),
    );
  };

  renderLoadingOrEmptyText = () => {
    const { dataSource, loading } = this.state;
    if (loading) {
      return <Loading color={COLORS.BLUE.MARINER} size="large" />;
    } else if (dataSource.getRowCount() === 0) {
      return <Text>Feed is currently empty</Text>;
    }
  };

  render() {
    const { tag } = this.props.navigation.state.params;
    const { currentFilter, menuVisible } = this.state;
    const displayListView = this.state.dataSource.getRowCount() > 0;

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <Tag tag={tag} />
          <TouchableMenu onPress={() => this.setMenuVisible(!menuVisible)}>
            <MaterialIcons size={24} name={currentFilter.icon} color={COLORS.BLUE.MARINER} />
            <MaterialCommunityIcons size={24} name={MATERIAL_COMMUNITY_ICONS.menuVertical} />
          </TouchableMenu>
        </Header>
        <Modal
          animationType="slide"
          transparent
          visible={menuVisible}
          onRequestClose={this.handleHideMenu}
        >
          <FeedSort hideMenu={this.handleHideMenu} handleSortPost={this.handleSortPost} />
        </Modal>
        {displayListView &&
          <StyledListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            enableEmptySections
            onEndReached={this.fetchMorePosts}
          />}
        {this.renderLoadingOrEmptyText()}
      </Container>
    );
  }
}

export default FeedScreen;
