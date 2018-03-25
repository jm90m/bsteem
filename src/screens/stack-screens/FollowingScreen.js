import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import _ from 'lodash';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import FollowButton from 'components/common/FollowButton';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Avatar from 'components/common/Avatar';
import LargeLoading from 'components/common/LargeLoading';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View`
  flex: 1;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const UserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  margin: 3px 0;
  background-color: ${COLORS.WHITE.WHITE};
  border-bottom-color: ${COLORS.WHITE.GAINSBORO};
  border-bottom-width: 1px;
  border-top-color: ${COLORS.WHITE.GAINSBORO};
  border-top-width: 1px;
`;

const UserText = styled.Text`
  margin-left: 5px;
  font-weight: bold;
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledListView = styled.ListView``;

class FollowingScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
  };

  static LIMIT = 50;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isRefreshing: false,
      followers: [],
    };
    this.renderRow = this.renderRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.handleNavigateToUser = this.handleNavigateToUser.bind(this);
    this.refreshFollowing = this.refreshFollowing.bind(this);
    this.loadMoreFollowing = this.loadMoreFollowing.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    this.fetchFollowing()
      .then(response => {
        const followers = _.get(response, 'result', []);
        this.setState({
          isLoading: false,
          followers,
        });
      })
      .catch(() => this.setState({ isLoading: false }));
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleNavigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
  }

  refreshFollowing() {
    this.setState({ isRefreshing: true });
    this.fetchFollowers()
      .then(response => {
        const followers = _.get(response, 'result', []);
        this.setState({
          isRefreshing: false,
          followers,
        });
      })
      .catch(() => this.setState({ isRefreshing: false }));
  }

  fetchFollowing(followData = {}) {
    const startName = _.get(followData, 'following', '');
    const { username } = this.props.navigation.state.params;
    return API.getFollowing(username, startName, 'blog', FollowingScreen.LIMIT);
  }

  loadMoreFollowing() {
    const { followers } = this.state;
    const lastFollower = _.last(followers);

    this.setState({ isLoading: true });

    this.fetchFollowing(lastFollower)
      .then(response => {
        const newFollowers = _.get(response, 'result', []);
        this.setState({
          isLoading: false,
          followers: _.unionBy(followers, newFollowers, 'following'),
        });
      })
      .catch(() => this.setState({ isLoading: false }));
  }

  renderRow(rowData) {
    const { following } = rowData;
    return (
      <UserContainer>
        <UserTouchable onPress={() => this.handleNavigateToUser(following)}>
          <Avatar username={following} />
          <UserText>{following}</UserText>
        </UserTouchable>
        <FollowButton username={following} />
      </UserContainer>
    );
  }

  render() {
    const { followers, isLoading, isRefreshing } = this.state;
    const { username } = this.props.navigation.state.params;
    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} following`}</TitleText>
          <HeaderEmptyView />
        </Header>
        <StyledListView
          dataSource={ds.cloneWithRows(followers)}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.loadMoreFollowing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefreshCurrentFeed}
              colors={[COLORS.PRIMARY_COLOR]}
              tintColor={COLORS.PRIMARY_COLOR}
            />
          }
        />
        {isLoading && <LargeLoading />}
      </Container>
    );
  }
}

export default FollowingScreen;
