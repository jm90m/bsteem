import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { ListView, RefreshControl, TouchableWithoutFeedback } from 'react-native';
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
  getIsAuthenticated,
  getCustomTheme,
} from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_COMMUNITY_ICONS, ICON_SIZES } from 'constants/styles';
import { fetchUserTransferHistory } from 'state/actions/userActivityActions';
import { fetchUser } from 'state/actions/usersActions';
import Header from 'components/common/Header';
import WalletTransaction from 'components/wallet/WalletTransaction';
import UserWalletSummary from 'components/wallet/UserWalletSummary';
import TitleText from 'components/common/TitleText';
import BackButton from 'components/common/BackButton';
import * as navigationConstants from 'constants/navigation';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

const Container = styled.View`
  flex: 1;
`;

const StyledListView = styled.ListView`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
  padding-bottom: 200px;
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authenticated: getIsAuthenticated(state),
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
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    navigation: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    loadingUsersDetails: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
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
    this.navigateToTransfers = this.navigateToTransfers.bind(this);
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

  navigateToTransfers() {
    const { authenticated } = this.props;
    const { username } = this.props.navigation.state.params;

    if (authenticated) {
      this.props.navigation.navigate(navigationConstants.TRANSFERS, { username });
    }
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
      authenticated,
      customTheme,
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
          <BackButton navigateBack={this.navigateBack} />
          <TitleText>{`${username} wallet`}</TitleText>
          <TouchableWithoutFeedback onPress={this.navigateToTransfers}>
            <MenuIconContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.cashUSD}
                color={authenticated ? customTheme.primaryColor : 'transparent'}
              />
            </MenuIconContainer>
          </TouchableWithoutFeedback>
        </Header>
        <StyledListView
          customTheme={customTheme}
          dataSource={ds.cloneWithRows(userTransactionsDataSource)}
          renderRow={this.renderUserWalletRow}
          enableEmptySections
          refreshControl={
            <RefreshControl
              refreshing={loadingFetchUserTransferHistory || loadingUsersDetails}
              onRefresh={this.onRefreshUserWallet}
              colors={[customTheme.primaryColor]}
            />
          }
        />
      </Container>
    );
  }
}

export default UserWalletScreen;
