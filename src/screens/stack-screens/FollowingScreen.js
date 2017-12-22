import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import FollowButton from 'components/common/FollowButton';
import API from 'api/api';
import * as navigationConstants from 'constants/navigation';
import HeaderContainer from 'components/common/HeaderContainer';
import { connect } from 'react-redux';
import Avatar from 'components/common/Avatar';
import LargeLoadingCenter from 'components/common/LargeLoadingCenter';
import { getCurrentUserFollowList } from '../../state/rootReducer';

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
  color: ${COLORS.BLUE.MARINER}
`;

const EmptyView = styled.View`
  padding: 10px;
`;

const UserTouchable = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const StyledListView = styled.ListView``;

@connect(state => ({
  currentUserFollowList: getCurrentUserFollowList(state),
}))
class FollowingScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    currentUserFollowList: PropTypes.shape(),
  };

  static defaultProps = {
    currentUserFollowList: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      followers: [],
    };
    this.renderRow = this.renderRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.handleNavigateToUser = this.handleNavigateToUser.bind(this);
  }

  componentWillMount() {
    const { username } = this.props.navigation.state.params;
    this.setState({ isLoading: true });
    API.getAllFollowing(username)
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

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleNavigateToUser(username) {
    this.props.navigation.navigate(navigationConstants.USER, { username });
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
    const { followers, isLoading } = this.state;
    const { username } = this.props.navigation.state.params;
    return (
      <Container>
        <HeaderContainer>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} following`}</TitleText>
          <EmptyView />
        </HeaderContainer>
        {isLoading
          ? <LargeLoadingCenter />
          : <StyledListView
              dataSource={ds.cloneWithRows(followers)}
              renderRow={this.renderRow}
              enableEmptySections
            />}
      </Container>
    );
  }
}

export default FollowingScreen;
