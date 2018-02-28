import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListView, View, Modal, RefreshControl, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getLoadingFetchDiscussions,
  getLoadingFetchMoreDiscussions,
  getHomeFeedPosts,
  getHasNetworkConnection,
} from 'state/rootReducer';
import { fetchDiscussions, fetchMoreDiscussions } from 'state/actions/homeActions';
import { MATERIAL_COMMUNITY_ICONS, COLORS, ICON_SIZES } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';
import LargeLoading from 'components/common/LargeLoading';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const HomeText = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  margin-left: 3px;
`;
const TouchableMenu = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const FilterMenuIcon = styled.View`
  margin-top: 3px;
`;

const LoadingMoreContainer = styled.View`
  align-items: center;
  justify-content: center;
  z-index: 1;
  margin-top: 20px;
`;

const mapStateToProps = state => ({
  posts: getHomeFeedPosts(state),
  loadingFetchDiscussions: getLoadingFetchDiscussions(state),
  loadingFetchMoreDiscussions: getLoadingFetchMoreDiscussions(state),
  networkConnection: getHasNetworkConnection(state),
});

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  fetchMoreDiscussions: (startAuthor, startPermlink, filter) =>
    dispatch(fetchMoreDiscussions(startAuthor, startPermlink, filter)),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class HomeScreen extends Component {
  static propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loadingFetchDiscussions: PropTypes.bool.isRequired,
    loadingFetchMoreDiscussions: PropTypes.bool.isRequired,
    fetchDiscussions: PropTypes.func.isRequired,
    fetchMoreDiscussions: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
  };

  static navigationOptions = {
    headerMode: 'none',
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows(props.posts),
      menuVisible: false,
      currentFilter: TRENDING,
    };

    this.setMenuVisibile = this.setMenuVisibile.bind(this);
    this.handleSortPost = this.handleSortPost.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onRefreshCurrentFeed = this.onRefreshCurrentFeed.bind(this);
    this.handleNavigateToSavedTags = this.handleNavigateToSavedTags.bind(this);
  }

  componentDidMount() {
    this.props.fetchDiscussions(this.state.currentFilter);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.posts),
    });
  }

  onEndReached() {
    const { posts, loadingFetchDiscussions } = this.props;
    const loadMoreDiscussions = !loadingFetchDiscussions && !_.isEmpty(posts);
    if (loadMoreDiscussions) {
      const lastPost = posts[posts.length - 1];
      this.props.fetchMoreDiscussions(lastPost.author, lastPost.permlink, this.state.currentFilter);
    }
  }

  onRefreshCurrentFeed() {
    this.props.fetchDiscussions(this.state.currentFilter);
  }

  setMenuVisibile(visible) {
    this.setState({ menuVisible: visible });
  }

  handleSortPost(filter) {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.props.fetchDiscussions(filter),
    );
  }

  handleHideMenu() {
    this.setMenuVisibile(false);
  }

  handleNavigateToSavedTags() {
    this.props.navigation.navigate(navigationConstants.SAVED_CONTENT);
  }

  renderRow(rowData) {
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  }

  render() {
    const { loadingFetchDiscussions, loadingFetchMoreDiscussions } = this.props;
    const { menuVisible, currentFilter, dataSource } = this.state;
    return (
      <View>
        <Header>
          <HeaderEmptyView />
          <TouchableMenu onPress={() => this.setMenuVisibile(!menuVisible)}>
            <MaterialIcons
              name={currentFilter.icon}
              size={ICON_SIZES.menuIcon}
              color={COLORS.PRIMARY_COLOR}
            />
            <HomeText>{currentFilter.label}</HomeText>
            <FilterMenuIcon>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.chevronDown}
                size={ICON_SIZES.menuIcon}
                color={COLORS.PRIMARY_COLOR}
              />
            </FilterMenuIcon>
          </TouchableMenu>
          <TouchableOpacity onPress={this.handleNavigateToSavedTags}>
            <MaterialCommunityIcons
              name="star"
              size={ICON_SIZES.menuIcon}
              style={{ padding: 5 }}
              color={COLORS.PRIMARY_COLOR}
            />
          </TouchableOpacity>
        </Header>
        {menuVisible && (
          <Modal
            animationType="slide"
            transparent
            visible={menuVisible}
            onRequestClose={this.handleHideMenu}
          >
            <FeedSort hideMenu={this.handleHideMenu} handleSortPost={this.handleSortPost} />
          </Modal>
        )}
        <StyledListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchDiscussions}
              onRefresh={this.onRefreshCurrentFeed}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {(loadingFetchMoreDiscussions || loadingFetchDiscussions) && (
          <LoadingMoreContainer>
            <LargeLoading />
          </LoadingMoreContainer>
        )}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
