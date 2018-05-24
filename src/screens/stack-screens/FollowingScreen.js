import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import _ from 'lodash';
import { connect } from 'react-redux';
import FollowButton from 'components/common/FollowButton';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import { getCustomTheme } from 'state/rootReducer';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import Avatar from 'components/common/Avatar';
import LargeLoading from 'components/common/LargeLoading';
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

class FollowingScreen extends Component {
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
    const { customTheme } = this.props;
    const { following } = rowData;
    return (
      <UserContainer customTheme={customTheme}>
        <UserTouchable onPress={() => this.handleNavigateToUser(following)}>
          <Avatar username={following} />
          <UserText>{following}</UserText>
        </UserTouchable>
        <FollowButton username={following} />
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
              colors={[customTheme.primaryColor]}
              tintColor={customTheme.primaryColor}
            />
          }
        />
      </Container>
    );
  }
}

export default connect(mapStateToProps)(FollowingScreen);
