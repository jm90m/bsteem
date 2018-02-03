import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import HeaderContainer from 'components/common/HeaderContainer';
import Avatar from 'components/common/Avatar';
import LargeLoadingCenter from 'components/common/LargeLoadingCenter';
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
  color: ${COLORS.PRIMARY_COLOR}
`;

const EmptyView = styled.View`
  padding: 10px;
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

  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      isRefreshing: false,
      followers: [],
    };
    this.renderRow = this.renderRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.refreshFollowers = this.refreshFollowers.bind(this);
  }

  componentWillMount() {
    const { username } = this.props.navigation.state.params;
    this.setState({ isLoading: true });
    API.getAllFollowers(username)
      .then(followers =>
        this.setState({
          isLoading: false,
          followers: followers.sort(),
        }),
      )
      .catch(error => {
        console.log('ERROR FOLLOWER SCREEN', error);
      });
  }

  refreshFollowers() {
    const { username } = this.props.navigation.state.params;
    this.setState({ isRefreshing: true });
    API.getAllFollowers(username)
      .then(followers =>
        this.setState({
          isRefreshing: false,
          followers: followers.sort(),
        }),
      )
      .catch(error => {
        this.setState({
          isRefreshing: false,
        });
        console.log('ERROR FOLLOWER SCREEN', error);
      });
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
        <HeaderContainer>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} followers`}</TitleText>
          <EmptyView />
        </HeaderContainer>
        {isLoading
          ? <LargeLoadingCenter />
          : <StyledListView
              dataSource={ds.cloneWithRows(followers)}
              renderRow={this.renderRow}
              enableEmptySections
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={this.refreshFollowers}
                  colors={[COLORS.PRIMARY_COLOR]}
                />
              }
            />}
      </Container>
    );
  }
}

export default FollowersScreen;
