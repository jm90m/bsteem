import React, { Component } from 'react';
import { ListView, View, Modal, NetInfo } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchDiscussions, fetchMoreDiscussions } from '../state/actions/homeActions';
import { MATERIAL_COMMUNITY_ICONS, COLORS } from '../constants/styles';
import { TRENDING } from '../constants/feedFilters';
import PostPreview from '../components/post-preview/PostPreview';
import FeedSort from '../components/feed-sort/FeedSort';

const StyledListView = styled.ListView`
  background-color: ${COLORS.WHITE.WHITE_SMOKE};
`;

const HomeHeader = styled.View`
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  padding-top: 10px;
  width: 100%;
  height: 45px;
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

const mapStateToProps = state => ({
  posts: state.home.posts,
});

const mapDispatchToProps = dispatch => ({
  fetchDiscussions: filter => dispatch(fetchDiscussions(filter)),
  fetchMoreDiscussions: (startAuthor, startPermlink, filter) =>
    dispatch(fetchMoreDiscussions(startAuthor, startPermlink, filter)),
});

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class HomeScreen extends Component {
  static navigationOptions = {
    headerMode: 'none',
    tabBarIcon: ({ tintColor }) => <MaterialIcons name={'home'} size={20} color={tintColor} />,
  };

  constructor(props) {
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows(props.posts),
      menuVisible: false,
      currentFilter: TRENDING,
    };
  }

  setMenuVisibile = visible => this.setState({ menuVisible: visible });

  handleSortPost = filter => {
    this.setState(
      {
        currentFilter: filter,
        menuVisible: false,
      },
      () => this.props.fetchDiscussions(filter),
    );
  };

  handleHideMenu = () => this.setMenuVisibile(false);

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: ds.cloneWithRows(nextProps.posts),
    });
  }

  componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      console.log(
        'Initial, type: ' +
          connectionInfo.type +
          ', effectiveType: ' +
          connectionInfo.effectiveType,
      );
    });
    this.props.fetchDiscussions(this.state.currentFilter);
  }

  onEndReached = () => {
    const { posts } = this.props;
    const lastPost = posts[posts.length - 1];
    this.props.fetchMoreDiscussions(lastPost.author, lastPost.permlink, this.state.currentFilter);
  };

  renderRow = rowData => <PostPreview postData={rowData} navigation={this.props.navigation} />;

  render() {
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
        <StyledListView
          dataSource={dataSource}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.onEndReached}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
