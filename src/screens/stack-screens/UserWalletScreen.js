import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView, RefreshControl } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import {
  getUsersDetails,
  getLoadingUsersDetails,
  getSteemRate,
  getLoadingSteemGlobalProperties,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUserTransferHistory,
  getLoadingFetchUserTransferHistory,
} from 'state/rootReducer';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, MATERIAL_ICONS } from 'constants/styles';
import { fetchUserTransferHistory } from 'state/actions/userActivityActions';
import { fetchUser } from 'state/actions/usersActions';
import Header from 'components/common/Header';
import HeaderEmptyView from 'components/common/HeaderEmptyView';
import WalletTransaction from 'components/wallet/WalletTransaction';
import UserWalletSummary from 'components/wallet/UserWalletSummary';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View``;

const StyledListView = styled.ListView`
  padding-bottom: 200px;
`;

const BackTouchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 10px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  color: ${COLORS.PRIMARY_COLOR};
`;

const mapStateToProps = state => ({
  usersDetails: getUsersDetails(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  steemRate: getSteemRate(state),
  loadingSteemGlobalProperties: getLoadingSteemGlobalProperties(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
  userTransferHistory: getUserTransferHistory(state),
  loadingFetchUserTransferHistory: getLoadingFetchUserTransferHistory(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserTransferHistory: username => dispatch(fetchUserTransferHistory.action({ username })),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

@connect(mapStateToProps, mapDispatchToProps)
class UserWalletScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    loadingUsersDetails: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func.isRequired,
    steemRate: PropTypes.string.isRequired,
    userTransferHistory: PropTypes.shape().isRequired,
    loadingSteemGlobalProperties: PropTypes.bool.isRequired,
    loadingFetchUserTransferHistory: PropTypes.bool.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    fetchUserTransferHistory: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.renderUserWalletRow = this.renderUserWalletRow.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.onRefreshUserWallet = this.onRefreshUserWallet.bind(this);
  }

  componentDidMount() {
    const { userTransferHistory, usersDetails } = this.props;
    const { username } = this.props.navigation.state.params;
    const currentUserTransferHistory = _.get(userTransferHistory, username, []);
    const userDetails = _.get(usersDetails, username, {});

    if (_.isEmpty(currentUserTransferHistory)) {
      this.props.fetchUserTransferHistory(username);
    }

    if (_.isEmpty(userDetails)) {
      this.props.fetchUser(username);
    }
  }

  onRefreshUserWallet() {
    const { username } = this.props.navigation.state.params;
    this.props.fetchUser(username);
    this.props.fetchUserTransferHistory(username);
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
      <WalletTransaction
        navigation={this.props.navigation}
        transaction={rowData}
        currentUsername={username}
        totalVestingShares={totalVestingShares}
        totalVestingFundSteem={totalVestingFundSteem}
      />
    );
  }

  render() {
    const {
      userTransferHistory,
      loadingUsersDetails,
      loadingFetchUserTransferHistory,
    } = this.props;
    const { username } = this.props.navigation.state.params;
    const userWalletSummary = [{ isUserWalletSummary: true }];
    const userTransactionsDataSource = _.concat(
      userWalletSummary,
      _.get(userTransferHistory, username, []),
    );

    return (
      <Container>
        <Header>
          <BackTouchable onPress={this.navigateBack}>
            <MaterialIcons size={24} name={MATERIAL_ICONS.back} />
          </BackTouchable>
          <TitleText>{`${username} wallet`}</TitleText>
          <HeaderEmptyView />
        </Header>
        <StyledListView
          dataSource={ds.cloneWithRows(userTransactionsDataSource)}
          renderRow={this.renderUserWalletRow}
          enableEmptySections
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchUserTransferHistory || loadingUsersDetails}
              onRefresh={this.onRefreshUserWallet}
              colors={[COLORS.PRIMARY_COLOR]}
            />
          }
        />
      </Container>
    );
  }
}

export default UserWalletScreen;
