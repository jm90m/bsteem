import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView, RefreshControl } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getUsersTransactions,
  getUsersDetails,
  getLoadingUsersDetails,
  getLoadingFetchUserAccountHistory,
  getSteemRate,
  getLoadingSteemGlobalProperties,
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from 'state/rootReducer';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import {
  fetchMoreUserAccountHistory,
  fetchUserAccountHistory,
} from 'state/actions/userActivityActions';
import { fetchUser } from 'state/actions/usersActions';
import HeaderContainer from 'components/common/HeaderContainer';
import UserAction from 'components/activity/UserAction';
import UserWalletSummary from 'components/wallet/UserWalletSummary';

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
  usersTransactions: getUsersTransactions(state),
  usersDetails: getUsersDetails(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  loadingFetchUserAccountHistory: getLoadingFetchUserAccountHistory(state),
  steemRate: getSteemRate(state),
  loadingSteemGlobalProperties: getLoadingSteemGlobalProperties(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserAccountHistory: username => dispatch(fetchUserAccountHistory.action({ username })),
  fetchMoreUserAccountHistory: username =>
    dispatch(fetchMoreUserAccountHistory.action({ username })),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserWalletScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    usersTransactions: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    loadingUsersDetails: PropTypes.bool.isRequired,
    loadingFetchUserAccountHistory: PropTypes.bool.isRequired,
    fetchUserAccountHistory: PropTypes.func.isRequired,
    fetchMoreUserAccountHistory: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    steemRate: PropTypes.string.isRequired,
    loadingSteemGlobalProperties: PropTypes.bool.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderUserWalletRow = this.renderUserWalletRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.onRefreshUserWallet = this.onRefreshUserWallet.bind(this);
  }

  componentDidMount() {
    const { usersTransactions, usersDetails } = this.props;
    const { username } = this.props.navigation.state.params;
    const userAccountHistory = _.get(usersTransactions, username, []);
    const userDetails = _.get(usersDetails, username, {});

    if (_.isEmpty(userAccountHistory)) {
      this.props.fetchUserAccountHistory(username);
    }

    if (_.isEmpty(userDetails)) {
      this.props.fetchUser(username);
    }
  }

  onRefreshUserWallet() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUser(username);
    this.props.fetchUserAccountHistory(username);
  }

  navigateBack() {
    this.props.navigation.goBack();
  }

  renderUserWalletRow(rowData) {
    const {
      loadingUsersDetails,
      steemRate,
      loadingSteemGlobalProperties,
      totalVestingFundSteem,
      totalVestingShares,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    if (_.has(rowData, 'isUserWalletSummary')) {
      const user = _.get(this.props.usersDetails, username, {});
      return (
        <UserWalletSummary
          user={user}
          loading={loadingUsersDetails}
          steemRate={steemRate}
          loadingSteemGlobalProperties={loadingSteemGlobalProperties}
          totalVestingFundSteem={totalVestingFundSteem}
          totalVestingShares={totalVestingShares}
        />
      );
    }
    return (
      <UserAction currentUsername={username} action={rowData} navigation={this.props.navigation} />
    );
  }

  render() {
    const { usersTransactions, loadingFetchUserAccountHistory, loadingUsersDetails } = this.props;
    const { username } = this.props.navigation.state.params;
    const userWalletSummary = [{ isUserWalletSummary: true }];
    const userTransactionsDataSource = _.concat(
      userWalletSummary,
      _.get(usersTransactions, username, []),
    );

    return (
      <Container>
        <HeaderContainer>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} wallet`}</TitleText>
          <FilterTouchable>
            <MaterialCommunityIcons
              size={24}
              name={MATERIAL_COMMUNITY_ICONS.filter}
              color={COLORS.BLUE.MARINER}
            />
          </FilterTouchable>
        </HeaderContainer>
        <StyledListView
          dataSource={ds.cloneWithRows(userTransactionsDataSource)}
          renderRow={this.renderUserWalletRow}
          enableEmptySections
          onEndReached={this.props.fetchMoreUserAccountHistory}
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchUserAccountHistory || loadingUsersDetails}
              onRefresh={this.onRefreshUserWallet}
              colors={[COLORS.BLUE.MARINER]}
            />
          }
        />
      </Container>
    );
  }
}

export default UserWalletScreen;
