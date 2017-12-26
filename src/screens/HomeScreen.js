import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListView, View, Modal, RefreshControl, Dimensions } from 'react-native';
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
import { MATERIAL_COMMUNITY_ICONS, COLORS } from 'constants/styles';
import { TRENDING } from 'constants/feedFilters';
import PostPreview from 'components/post-preview/PostPreview';
import FeedSort from 'components/feed-sort/FeedSort';
import LargeLoading from 'components/common/LargeLoading';
import NetConnectionBanner from 'components/common/NetConnectionBanner';

const { width, height } = Dimensions.get('screen');

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const HomeHeader = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  padding-top: 20px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const HomeText = styled.Text`
  color: ${COLORS.BLUE.MARINER};
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
  background-color: transparent;
  bottom: 0;
  flex: 1;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
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
  }

  componentDidMount() {
    // NetInfo.getConnectionInfo().then(connectionInfo => {
    //   console.log(
    //     'Initial, type: ' +
    //       connectionInfo.type +
    //       ', effectiveType: ' +
    //       connectionInfo.effectiveType,
    //   );
    //
    //   if(netInfoConstants.UNKNOWN_NET_INFO) {
    //     this.props.noNetworkConnectionFound();
    //   }
    // });
    // this.props.fetchDiscussions(this.state.currentFilter);
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

  renderRow(rowData) {
    return <PostPreview postData={rowData} navigation={this.props.navigation} />;
  }

  render() {
    const { loadingFetchDiscussions, loadingFetchMoreDiscussions } = this.props;
    const { menuVisible, currentFilter, dataSource } = this.state;
    return (
      <View>
        <HomeHeader>
          <TouchableMenu onPress={() => this.setMenuVisibile(!menuVisible)}>
            <MaterialIcons name={currentFilter.icon} size={20} color={COLORS.BLUE.MARINER} />
            <HomeText>{currentFilter.label}</HomeText>
            <FilterMenuIcon>
              <MaterialCommunityIcons
                name={MATERIAL_COMMUNITY_ICONS.chevronDown}
                size={24}
                color={COLORS.BLUE.MARINER}
              />
            </FilterMenuIcon>
          </TouchableMenu>
        </HomeHeader>
        <Modal
          animationType="slide"
          transparent
          visible={menuVisible}
          onRequestClose={this.handleHideMenu}
        >
          <FeedSort hideMenu={this.handleHideMenu} handleSortPost={this.handleSortPost} />
        </Modal>
        {loadingFetchMoreDiscussions &&
          <LoadingMoreContainer><LargeLoading /></LoadingMoreContainer>}
        <StyledListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchDiscussions}
              onRefresh={this.onRefreshCurrentFeed}
              colors={[COLORS.BLUE.MARINER]}
            />
          }
        />
        <NetConnectionBanner />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
