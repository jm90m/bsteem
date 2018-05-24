import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ScrollView, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { getCryptoDetails } from 'util/cryptoUtils';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  getCryptosPriceHistory,
  getDisplayPriceModal,
  getDisplayedCryptos,
  getLoadingSteemGlobalProperties,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUsersDetails,
  getAuthUsername,
  getIsAuthenticated,
  getSteemRate,
  getLoadingUsersDetails,
  getCustomTheme,
  getIntl,
} from 'state/rootReducer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MATERIAL_ICONS, ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import BackButton from 'components/common/BackButton';
import { hidePriceModal } from 'state/actions/appActions';
import { fetchUser } from 'state/actions/usersActions';
import UserWalletSummary from 'components/wallet/UserWalletSummary';
import TitleText from 'components/common/TitleText';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import Header from '../Header';
import ClaimRewardsBlock from '../ClaimRewardsBlock';
import CryptoChart from './CryptoChart';

const EmptyView = styled.View`
  height: 200;
  width: 100;
`;

const UserWalletContainer = styled.View``;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const mapStateToProps = state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
  displayPriceModal: getDisplayPriceModal(state),
  displayedCryptos: getDisplayedCryptos(state),
  usersDetails: getUsersDetails(state),
  loadingSteemGlobalProperties: getLoadingSteemGlobalProperties(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
  currentAuthUsername: getAuthUsername(state),
  authenticated: getIsAuthenticated(state),
  loadingUsersDetails: getLoadingUsersDetails(state),
  steemRate: getSteemRate(state),
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  hidePriceModal: () => dispatch(hidePriceModal()),
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

class CryptoPriceModal extends Component {
  static propTypes = {
    displayedCryptos: PropTypes.arrayOf(PropTypes.string),
    cryptosPriceHistory: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    displayPriceModal: PropTypes.bool.isRequired,
    authenticated: PropTypes.bool.isRequired,
    hidePriceModal: PropTypes.func.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    loadingSteemGlobalProperties: PropTypes.bool.isRequired,
    loadingUsersDetails: PropTypes.bool.isRequired,
    currentAuthUsername: PropTypes.string.isRequired,
    steemRate: PropTypes.string.isRequired,
    usersDetails: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    fetchUser: PropTypes.func.isRequired,
  };

  static defaultProps = {
    displayedCryptos: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      refreshCharts: false,
    };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  hasAPIError() {
    const { cryptosPriceHistory, displayedCryptos } = this.props;
    const apiErrors = [];

    if (_.isEmpty(cryptosPriceHistory)) {
      return false;
    }

    _.each(displayedCryptos, crypto => {
      const cryptoDetails = getCryptoDetails(crypto);
      const cryptoSymbol = _.get(cryptoDetails, 'symbol', null);
      const cryptoAPIDetails = _.get(cryptosPriceHistory, _.upperCase(cryptoSymbol), null);
      const hasAPIError =
        !(_.isUndefined(cryptoAPIDetails) || _.isNull(cryptoAPIDetails)) &&
        (cryptoAPIDetails.usdAPIError || _.isEmpty(cryptoAPIDetails.usdPriceHistory));
      if (hasAPIError) {
        apiErrors.push(cryptoDetails);
      }
    });

    return displayedCryptos.length === apiErrors.length;
  }

  handleRefresh() {
    this.setState(
      {
        refreshCharts: true,
      },
      () => {
        this.setState({
          refreshCharts: false,
        });
      },
    );

    if (this.props.authenticated) {
      this.props.fetchUser(this.props.currentAuthUsername);
    }
  }

  renderCryptoCharts() {
    const { displayedCryptos } = this.props;
    const { refreshCharts } = this.state;
    if (_.isEmpty(displayedCryptos)) {
      return null;
    }

    return _.map(displayedCryptos, crypto => (
      <CryptoChart key={crypto} crypto={crypto} refreshCharts={refreshCharts} />
    ));
  }

  renderUserWallet() {
    const {
      loadingUsersDetails,
      steemRate,
      loadingSteemGlobalProperties,
      totalVestingFundSteem,
      totalVestingShares,
      currentAuthUsername,
      authenticated,
      usersDetails,
      intl,
    } = this.props;

    if (!authenticated) return null;

    const user = _.get(usersDetails, currentAuthUsername, {});

    return (
      <UserWalletContainer>
        <TitleText
          style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15 }}
        >{`${currentAuthUsername} ${intl.wallet}`}</TitleText>
        <UserWalletSummary
          user={user}
          loading={loadingUsersDetails}
          steemRate={steemRate}
          loadingSteemGlobalProperties={loadingSteemGlobalProperties}
          totalVestingFundSteem={totalVestingFundSteem}
          totalVestingShares={totalVestingShares}
        />
      </UserWalletContainer>
    );
  }

  render() {
    const { displayPriceModal, authenticated, customTheme, intl } = this.props;

    if (!displayPriceModal) return null;

    // if (this.hasAPIError()) return <View />;

    return (
      <Modal
        visible={displayPriceModal}
        animationType="slide"
        onRequestClose={this.props.hidePriceModal}
      >
        <StyledViewPrimaryBackground style={{ flex: 1 }}>
          <Header>
            <MenuIconContainer>
              <MaterialCommunityIcons
                size={ICON_SIZES.menuIcon}
                name={MATERIAL_COMMUNITY_ICONS.menuVertical}
                color="transparent"
              />
            </MenuIconContainer>
            <TitleText>{intl.market}</TitleText>
            <BackButton navigateBack={this.props.hidePriceModal} iconName={MATERIAL_ICONS.close} />
          </Header>
          <ScrollView
            style={{ paddingBottom: 200 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshCharts}
                onRefresh={this.handleRefresh}
                colors={[customTheme.primaryColor]}
                tintColor={customTheme.primaryColor}
              />
            }
          >
            {this.renderUserWallet()}
            {authenticated && <ClaimRewardsBlock />}
            {this.renderCryptoCharts()}
            <EmptyView />
          </ScrollView>
        </StyledViewPrimaryBackground>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CryptoPriceModal);
