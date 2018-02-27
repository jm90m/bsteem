import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Avatar from 'components/common/Avatar';
import LargeLoading from 'components/common/LargeLoading';
import FollowButton from 'components/common/FollowButton';

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

class FollowersScreen extends Component {
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
    this.refreshFollowers = this.refreshFollowers.bind(this);
    this.loadMoreFollowers = this.loadMoreFollowers.bind(this);
  }

  componentWillMount() {
    this.setState({ isLoading: true });

    this.fetchFollowers()
      .then(response => {
        const followers = _.get(response, 'result', []);
        this.setState({
          isLoading: false,
          followers,
        });
      })
      .catch(() => this.setState({ isLoading: false }));
  }

  refreshFollowers() {
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

  fetchFollowers(followData = {}) {
    const startName = _.get(followData, 'follower', '');
    const { username } = this.props.navigation.state.params;
    return API.getFollowers(username, startName, 'blog', FollowersScreen.LIMIT);
  }

  loadMoreFollowers() {
    const { followers } = this.state;
    const lastFollower = _.last(followers);

    this.setState({ isLoading: true });

    this.fetchFollowers(lastFollower)
      .then(response => {
        const newFollowers = _.get(response, 'result', []);
        this.setState({
          isLoading: false,
          followers: _.unionBy(followers, newFollowers, 'follower'),
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

  renderRow(rowData) {
    const { follower } = rowData;
    return (
      <UserContainer>
        <UserTouchable onPress={() => this.handleNavigateToUser(follower)}>
          <Avatar username={follower} />
          <UserText>{follower}</UserText>
        </UserTouchable>
        <FollowButton username={follower} />
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
          <TitleText>{`${username} followers`}</TitleText>
          <HeaderEmptyView />
        </Header>
        <StyledListView
          dataSource={ds.cloneWithRows(followers)}
          renderRow={this.renderRow}
          enableEmptySections
          onEndReached={this.loadMoreFollowers}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.refreshFollowers}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
        {isLoading && <LargeLoading />}
      </Container>
    );
  }
}

export default FollowersScreen;
