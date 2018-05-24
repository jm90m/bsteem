import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ListView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Avatar from 'components/common/Avatar';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import FollowButton from 'components/common/FollowButton';
import BackButton from 'components/common/BackButton';
import TitleText from 'components/common/TitleText';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View`
  flex: 1;
`;

const UserContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  margin: 3px 0;
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-top-width: 1px;
`;

const UserText = styled(StyledTextByBackground)`
  margin-left: 5px;
  font-weight: bold;
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledListView = styled.ListView``;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class FollowersScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
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
    const { customTheme } = this.props;

    return (
      <UserContainer customTheme={customTheme}>
        <UserTouchable onPress={() => this.handleNavigateToUser(follower)}>
          <Avatar username={follower} />
          <UserText>{follower}</UserText>
        </UserTouchable>
        <FollowButton username={follower} />
      </UserContainer>
    );
  }
  render() {
    const { customTheme } = this.props;
    const { followers, isRefreshing } = this.state;
    const { username } = this.props.navigation.state.params;
    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.navigateBack} />
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
              colors={[customTheme.primaryColor]}
            />
          }
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps)(FollowersScreen);
