import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import _ from 'lodash';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import {
  getLoadingFetchUserTransferHistory,
  getLoadingSteemGlobalProperties,
  getLoadingUsersDetails,
  getSteemRate,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUserTransferHistory,
  getCryptosPriceHistory,
} from 'state/rootReducer';
import { numberWithCommas, vestToSteem } from 'util/steemitFormatters';
import { fetchUser } from 'state/actions/usersActions';
import { STEEM, SBD } from 'constants/cryptos';
import { calculateEstAccountValue, calculateTotalDelegatedSP } from 'util/steemitUtils';
import WalletTitleRow from './WalletTitleRow';
import WalletRow from './WalletRow';
import WalletEstimatedAccountTitleRow from './WalletEstimatedAccountTitleRow';

const Container = styled(StyledViewPrimaryBackground)``;

class WalletSummary extends Component {
  static propTypes = {
    loadingUsersDetails: PropTypes.bool.isRequired,
    loadingSteemGlobalProperties: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func.isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape(),
  };

  static defaultProps = {
    user: {},
  };

  componentDidMount() {
    if (_.isEmpty(this.props.user)) {
      this.props.fetchUser(this.props.user);
    }
  }

  getFormattedTotalDelegatedSP() {
    const { user, totalVestingShares, totalVestingFundSteem } = this.props;
    const totalDelegatedSPValue = calculateTotalDelegatedSP(
      user,
      totalVestingShares,
      totalVestingFundSteem,
    );
    const totalDelegatedSPTextPrefix = totalDelegatedSPValue > 0 ? '(+' : '(';
    const totalDelegatedSP = `${totalDelegatedSPTextPrefix}${numberWithCommas(
      parseFloat(totalDelegatedSPValue).toFixed(3),
    )} SP)`;
    if (totalDelegatedSPValue !== 0) {
      return totalDelegatedSP;
    }
    return '';
  }

  getCryptoRateDetails(symbol) {
    const { cryptosPriceHistory } = this.props;
    const cryptoPriceDetailsKey = `${symbol}.priceDetails`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'currentUSDPrice', 0);
    const usdIncrease = _.get(priceDetails, 'cryptoUSDIncrease', false);
    const usdPriceDifferencePercent = _.get(priceDetails, 'usdPriceDifferencePercent', 0);
    const cryptoUSDPriceHistoryKey = `${symbol}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);

    const steemRateDifference = `${usdIncrease ? '+' : '-'} ${parseFloat(
      usdPriceDifferencePercent,
    ).toFixed(2)}%`;
    return {
      steemRateDifference,
      usdIncrease,
      currentUSDPrice,
      loading,
    };
  }

  getEstAccountValueDetails() {
    const { cryptosPriceHistory, user, totalVestingShares, totalVestingFundSteem } = this.props;
    const cryptoPriceDetailsKey = `${STEEM.symbol}.priceDetails`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'currentUSDPrice', 0);
    const previousUSDPrice = _.get(priceDetails, 'previousUSDPrice', 0);
    const cryptoUSDPriceHistoryKey = `${STEEM.symbol}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);

    const currentEstAccountValue = parseFloat(
      calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, currentUSDPrice),
    ).toFixed(2);
    const prevEstAccountValue = parseFloat(
      calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, previousUSDPrice),
    ).toFixed(2);

    const priceDifference = currentEstAccountValue - prevEstAccountValue;
    const priceIncrease = priceDifference / currentEstAccountValue;
    const estAccountValueIncrease = currentEstAccountValue > prevEstAccountValue;
    const usdPriceDifference = Math.abs(priceIncrease) * 100;

    const estAccountValueDifference = `${estAccountValueIncrease ? '+' : '-'} ${parseFloat(
      usdPriceDifference,
    ).toFixed(2)}%`;

    return {
      estAccountValueIncrease,
      estAccountValueDifference,
      currentEstAccountValue: numberWithCommas(
        _.isNaN(currentEstAccountValue) ? '0' : currentEstAccountValue,
      ),
      loading,
    };
  }

  render() {
    const {
      user,
      totalVestingShares,
      totalVestingFundSteem,
      loadingUsersDetails,
      loadingSteemGlobalProperties,
    } = this.props;
    const steemPower = parseFloat(
      vestToSteem(user.vesting_shares, totalVestingShares, totalVestingFundSteem).toFixed(3),
    );
    const userBalance = parseFloat(_.get(user, 'balance', 0));
    const formattedSteemBalance = numberWithCommas(_.isNaN(userBalance) ? 0 : userBalance);
    const savingsBalance = parseFloat(_.get(user, 'savings_balance', '0')).toFixed(3);
    const sbdBalance = parseFloat(user.sbd_balance).toFixed(3);
    const formattedSBDBalance = numberWithCommas(_.isNaN(sbdBalance) ? 0 : sbdBalance);
    const formattedSavingsBalance = numberWithCommas(_.isNaN(savingsBalance) ? 0 : savingsBalance);
    const sbdSavingsBalance = parseFloat(user.savings_sbd_balance).toFixed(3);
    const formattedSBDSavingsBalance = numberWithCommas(
      _.isNaN(sbdSavingsBalance) ? 0 : sbdSavingsBalance,
    );
    const totalDelegatedSP = this.getFormattedTotalDelegatedSP();
    const formattedSteemPower = numberWithCommas(_.isNaN(steemPower) ? 0 : steemPower);

    return (
      <Container>
        <WalletEstimatedAccountTitleRow
          estAccountValueDetails={this.getEstAccountValueDetails()}
          loading={loadingUsersDetails || loadingSteemGlobalProperties}
        />
        <WalletTitleRow />
        <WalletRow
          label="Steem (STEEM)"
          value={formattedSteemBalance}
          loading={loadingUsersDetails}
          isFirstElement
          coinRateDetails={this.getCryptoRateDetails(STEEM.symbol)}
        />
        <WalletRow
          loading={loadingUsersDetails}
          label="Steem Power (SP)"
          value={formattedSteemPower}
          totalDelegatedSP={totalDelegatedSP}
          coinRateDetails={this.getCryptoRateDetails(STEEM.symbol)}
        />
        <WalletRow
          loading={loadingUsersDetails}
          label="Steem Dollar (SBD)"
          value={formattedSBDBalance}
          coinRateDetails={this.getCryptoRateDetails(SBD.symbol)}
        />
        <WalletRow
          loading={loadingUsersDetails}
          label="Steem Savings"
          value={formattedSavingsBalance}
          coinRateDetails={this.getCryptoRateDetails(STEEM.symbol)}
        />
        <WalletRow
          loading={loadingUsersDetails}
          label="Steem Dollar Savings"
          value={formattedSBDSavingsBalance}
          coinRateDetails={this.getCryptoRateDetails(SBD.symbol)}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loadingUsersDetails: getLoadingUsersDetails(state),
  steemRate: getSteemRate(state),
  loadingSteemGlobalProperties: getLoadingSteemGlobalProperties(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
  totalVestingShares: getTotalVestingShares(state),
  userTransferHistory: getUserTransferHistory(state),
  loadingFetchUserTransferHistory: getLoadingFetchUserTransferHistory(state),
  cryptosPriceHistory: getCryptosPriceHistory(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUser: username => dispatch(fetchUser.action({ username })),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletSummary);
