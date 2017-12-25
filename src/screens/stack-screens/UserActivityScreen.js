import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView, RefreshControl } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getUsersAccountHistory,
  getLoadingFetchUserAccountHistory,
  getLoadingFetchMoreUserAccountHistory,
} from 'state/rootReducer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import {
  fetchMoreUserAccountHistory,
  fetchUserAccountHistory,
} from 'state/actions/userActivityActions';
import LargeLoading from 'components/common/LargeLoading';
import HeaderContainer from 'components/common/HeaderContainer';
import UserAction from 'components/activity/UserAction';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View``;

const StyledListView = styled.ListView``;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.BLUE.MARINER}
`;

const FilterTouchable = styled.TouchableOpacity`
  padding: 10px;
`;

const mapStateToProps = state => ({
  usersAccountHistory: getUsersAccountHistory(state),
  loadingFetchUserAccountHistory: getLoadingFetchUserAccountHistory(state),
  loadingFetchMoreUserAccountHistory: getLoadingFetchMoreUserAccountHistory(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserAccountHistory: username => dispatch(fetchUserAccountHistory.action({ username })),
  fetchMoreUserAccountHistory: username =>
    dispatch(fetchMoreUserAccountHistory.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserActivityScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    fetchUserAccountHistory: PropTypes.func.isRequired,
    fetchMoreUserAccountHistory: PropTypes.func.isRequired,
    loadingFetchUserAccountHistory: PropTypes.bool.isRequired,
    loadingFetchMoreUserAccountHistory: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.onRefreshUserAccountHistory = this.onRefreshUserAccountHistory.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.renderUserActivityRow = this.renderUserActivityRow.bind(this);
    this.handleFetchMoreUserAccountHistory = this.handleFetchMoreUserAccountHistory.bind(this);
  }

  componentDidMount() {
    const { usersAccountHistory } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistory = _.get(usersAccountHistory, username, []);

    if (_.isEmpty(userAccountHistory)) {
      this.props.fetchUserAccountHistory(username);
    }
  }

  onRefreshUserAccountHistory() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUserAccountHistory(username);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  handleFetchMoreUserAccountHistory() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchMoreUserAccountHistory(username);
  }

  renderUserActivityRow(rowData) {
    const { username } = this.props.navigation.state.params;
    return (
      <UserAction currentUsername={username} action={rowData} navigation={this.props.navigation} />
    );
  }

  render() {
    const {
      usersAccountHistory,
      loadingFetchUserAccountHistory,
      loadingFetchMoreUserAccountHistory,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistoryDataSource = _.get(usersAccountHistory, username, []);

    return (
      <Container>
        <HeaderContainer>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} activity`}</TitleText>
          <FilterTouchable>
            <MaterialCommunityIcons
              size={24}
              name={MATERIAL_COMMUNITY_ICONS.filter}
              color={COLORS.BLUE.MARINER}
            />
          </FilterTouchable>
        </HeaderContainer>
        <StyledListView
          dataSource={ds.cloneWithRows(userAccountHistoryDataSource)}
          renderRow={this.renderUserActivityRow}
          enableEmptySections
          onEndReached={this.handleFetchMoreUserAccountHistory}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchUserAccountHistory}
              onRefresh={this.onRefreshUserAccountHistory}
              colors={[COLORS.BLUE.MARINER]}
            />
          }
        />
        {loadingFetchMoreUserAccountHistory && <LargeLoading />}
      </Container>
    );
  }
}

export default UserActivityScreen;
