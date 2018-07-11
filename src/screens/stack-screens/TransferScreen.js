import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';
import { ICON_SIZES, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { STEEM, SBD } from 'constants/cryptos';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from 'components/common/Header';
import _ from 'lodash';
import Expo from 'expo';
import { connect } from 'react-redux';
import BackButton from 'components/common/BackButton';
import { FormLabel, FormInput, FormValidationMessage, ButtonGroup } from 'react-native-elements';
import sc2 from 'api/sc2';
import PrimaryButton from 'components/common/PrimaryButton';
import { fetchUserTransferHistory } from 'state/actions/userActivityActions';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import Text from 'components/common/StyledTextByBackground';
import TitleText from 'components/common/TitleText';
import PrimaryText from 'components/common/text/PrimaryText';
import tinycolor from 'tinycolor2';
import {
  getAuthUsername,
  getCryptosPriceHistory,
  getIsAuthenticated,
  getUsersDetails,
  getCustomTheme,
  getIntl,
} from '../../state/rootReducer';
import { fetchUser } from '../../state/actions/usersActions';
import * as appActions from '../../state/actions/appActions';
import { COLORS } from '../../constants/styles';

const Container = styled(StyledViewPrimaryBackground)`
  flex: 1;
`;

const ScrollView = styled.ScrollView`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const MenuIconContainer = styled.View`
  padding: 5px;
`;

const DisclaimerText = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
  padding: 15px;
`;

const EmptyView = styled.View`
  width: 100px;
  height: 300px;
`;

const BalanceContainer = styled.View`
  padding: 15px 20px;
`;

const Field = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
`;

const Value = styled(PrimaryText)`
  color: ${props => props.customTheme.secondaryColor};
`;

const CURRENCIES = {
  STEEM: 'STEEM',
  SBD: 'SBD',
};

const CURRENCIES_ARRAY = [CURRENCIES.STEEM, CURRENCIES.SBD];

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  authUsername: getAuthUsername(state),
  usersDetails: getUsersDetails(state),
  authenticated: getIsAuthenticated(state),
  cryptosPriceHistory: getCryptosPriceHistory(state),
  intl: getIntl(state),
});

const mapDispatchToProps = dispatch => ({
  fetchUserTransferHistory: username => dispatch(fetchUserTransferHistory.action(username)),
  fetchUser: username => dispatch(fetchUser.action({ username })),
  fetchCryptoPriceHistory: symbol =>
    dispatch(appActions.fetchCryptoPriceHistory.action({ symbol })),
});

class TransferScreen extends Component {
  static navigationOptions = {
    tabBarVisible: false,
    drawerLockMode: 'locked-closed',
  };

  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    authUsername: PropTypes.string.isRequired,
    authenticated: PropTypes.bool.isRequired,
    fetchUserTransferHistory: PropTypes.func.isRequired,
    fetchCryptoPriceHistory: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    navigation: PropTypes.shape().isRequired,
    usersDetails: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
  };

  static minAccountLength = 3;
  static maxAccountLength = 16;
  static exchangeRegex = /^(bittrex|blocktrades|poloniex|changelly|openledge|shapeshiftio)$/;

  constructor(props) {
    super(props);

    const username = _.get(props, 'navigation.state.params.username', '');
    const sendTo = _.isEqual(props.authUsername, username) ? '' : username;

    this.state = {
      currency: CURRENCIES.STEEM,
      amount: '0',
      sendTo,
      memo: '',
      amountError: '',
      sendToError: '',
      memoError: '',
    };

    this.handleNavigateBack = this.handleNavigateBack.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleSendToChange = this.handleSendToChange.bind(this);
    this.handleMemoChange = this.handleMemoChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateMemo = this.validateMemo.bind(this);
    this.validateSendTo = this.validateSendTo.bind(this);
    this.validateAmount = this.validateAmount.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.handleOnPressChangeCurrency = this.handleOnPressChangeCurrency.bind(this);
    this.getUSDValue = this.getUSDValue.bind(this);
  }

  componentDidMount() {
    const { cryptosPriceHistory } = this.props;
    const currentSteemRate = _.get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = _.get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);

    if (_.isNull(currentSteemRate)) {
      this.props.fetchCryptoPriceHistory(STEEM.symbol);
    }

    if (_.isNull(currentSBDRate)) {
      this.props.fetchCryptoPriceHistory(SBD.symbol);
    }
  }

  getUSDValue() {
    const { cryptosPriceHistory } = this.props;
    const { currency, amount } = this.state;
    const currentSteemRate = _.get(cryptosPriceHistory, 'STEEM.priceDetails.currentUSDPrice', null);
    const currentSBDRate = _.get(cryptosPriceHistory, 'SBD.priceDetails.currentUSDPrice', null);
    const steemRateLoading = _.isNull(currentSteemRate) || _.isNull(currentSBDRate);
    const parsedAmount = parseFloat(amount);
    const invalidAmount = parsedAmount <= 0 || _.isNaN(parsedAmount);

    let usdValue = 0;

    if (steemRateLoading || invalidAmount) return '$0.00';

    if (currency === STEEM.symbol) {
      usdValue = parsedAmount * parseFloat(currentSteemRate);
    } else {
      usdValue = parsedAmount * parseFloat(currentSBDRate);
    }

    return _.isNaN(usdValue) ? '$0.00' : `$${parseFloat(usdValue).toFixed(2)}`;
  }

  validateMemo(memo, sendTo) {
    const recipientIsExchange = TransferScreen.exchangeRegex.test(sendTo);
    const { intl } = this.props;
    let memoError = '';

    if (recipientIsExchange && _.isEmpty(memo)) {
      memoError = intl.memo_exchange_required;
    }

    return memoError;
  }

  validateSendTo(sendTo) {
    const { intl } = this.props;
    let sendToError = '';

    if (_.size(sendTo) > TransferScreen.maxAccountLength) {
      sendToError = intl.username_too_long;
    } else if (_.size(sendTo) < TransferScreen.minAccountLength) {
      sendToError = intl.username_too_short;
    }

    return sendToError;
  }

  validateAmount(amount) {
    const { authenticated, authUsername, usersDetails, intl } = this.props;
    const currentValue = parseFloat(amount);
    const userDetails = _.get(usersDetails, authUsername, {});
    const steemBalance = _.get(userDetails, 'balance', '0 STEEM');
    const sbdBalance = _.get(userDetails, 'sbd_balance', '0 SBD');
    let amountError = '';

    const selectedBalance = this.state.currency === CURRENCIES.STEEM ? steemBalance : sbdBalance;

    if (amount && currentValue <= 0) {
      amountError = intl.amount_error_zero;
    }

    if (authenticated && currentValue !== 0 && currentValue > parseFloat(selectedBalance)) {
      amountError = intl.amount_error_funds;
    }

    return amountError;
  }

  validateFields() {
    const { sendTo, amount, memo } = this.state;
    const sendToError = this.validateSendTo(sendTo);
    const memoError = this.validateMemo(memo, sendTo);
    const amountError = this.validateAmount(amount);

    return _.isEmpty(sendToError) && _.isEmpty(amountError) && _.isEmpty(memoError);
  }

  handleNavigateBack() {
    this.props.navigation.goBack();
  }

  handleOnPressChangeCurrency(index) {
    const currency = _.get(CURRENCIES_ARRAY, index, CURRENCIES.STEEM);
    this.setState({
      currency,
    });
  }

  handleAmountChange(amount) {
    this.setState({
      amount,
      amountError: this.validateAmount(amount),
    });
  }

  handleSendToChange(sendTo) {
    this.setState({
      sendTo,
      sendToError: this.validateSendTo(sendTo),
    });
  }

  handleMemoChange(memo) {
    this.setState({
      memo,
    });
  }

  handleSubmit() {
    const { sendTo, amount, memo, currency } = this.state;
    const sendToError = this.validateSendTo(sendTo);
    const memoError = this.validateMemo(memo, sendTo);
    const amountError = this.validateAmount(amount);

    const isValid = _.isEmpty(sendToError) && _.isEmpty(amountError) && _.isEmpty(memoError);

    if (isValid) {
      const transferQuery = {
        to: sendTo,
        amount: `${amount} ${currency}`,
      };

      if (memo) transferQuery.memo = memo;

      const sc2URL = sc2.sign('transfer', transferQuery);

      Expo.WebBrowser.openBrowserAsync(sc2URL)
        .then(() => {
          _.delay(() => {
            this.props.fetchUserTransferHistory(this.props.authUsername);
            this.props.fetchUser(this.props.authUsername);
          }, 5000);
          this.setState({
            currency: CURRENCIES.STEEM,
            amount: '0',
            sendTo: '',
            memo: '',
            amountError: '',
            sendToError: '',
            memoError: '',
          });
        })
        .catch(error => {
          console.log('invalid url', error, sc2URL);
        });
    } else {
      this.setState({
        sendToError,
        memoError,
        amountError,
      });
    }
  }

  render() {
    const { usersDetails, authUsername, customTheme, intl } = this.props;
    const { sendToError, amountError, memoError, amount, sendTo, memo, currency } = this.state;
    const hasSendToError = !_.isEmpty(sendToError);
    const hasAmountError = !_.isEmpty(amountError);
    const hasMemoError = !_.isEmpty(memoError);
    const selectedButtonStyle = { backgroundColor: customTheme.primaryColor };
    const selectedTextStyle = { color: customTheme.primaryColor };
    const selectedCurrencyIndex = _.indexOf(CURRENCIES_ARRAY, currency);
    const userDetails = _.get(usersDetails, authUsername, {});
    const steemBalance = _.get(userDetails, 'balance', '0.000 STEEM');
    const sbdBalance = _.get(userDetails, 'sbd_balance', '0.000 SBD');
    const displayBalance = currency === CURRENCIES.STEEM ? steemBalance : sbdBalance;
    const usdValue = this.getUSDValue();
    const color = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    return (
      <Container>
        <Header>
          <BackButton navigateBack={this.handleNavigateBack} />
          <TitleText>{intl.transfer_modal_title}</TitleText>
          <MenuIconContainer>
            <MaterialCommunityIcons
              size={ICON_SIZES.menuIcon}
              name={MATERIAL_COMMUNITY_ICONS.menuVertical}
              color="transparent"
            />
          </MenuIconContainer>
        </Header>
        <KeyboardAvoidingView behavior="padding">
          <ScrollView customTheme={customTheme}>
            <FormLabel>{intl.to}</FormLabel>
            <FormInput
              onChangeText={this.handleSendToChange}
              value={sendTo}
              inputStyle={{ width: '100%', color }}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {hasSendToError && <FormValidationMessage>{sendToError}</FormValidationMessage>}
            <FormLabel>{intl.currency}</FormLabel>
            <ButtonGroup
              onPress={this.handleOnPressChangeCurrency}
              containerStyle={{ height: 50 }}
              selectedButtonStyle={selectedButtonStyle}
              selectedTextStyle={selectedTextStyle}
              buttons={CURRENCIES_ARRAY}
              selectedIndex={selectedCurrencyIndex}
            />
            <FormLabel>{intl.amount}</FormLabel>
            <BalanceContainer>
              <Text>
                <Field customTheme={customTheme}>{`${intl.balance}: `}</Field>
                <TitleText>{displayBalance}</TitleText>
              </Text>
              <Text>
                <Field customTheme={customTheme}>{`${intl.usd_value}: `}</Field>
                <Value customTheme={customTheme}>{usdValue}</Value>
              </Text>
            </BalanceContainer>
            {hasAmountError && <FormValidationMessage>{amountError}</FormValidationMessage>}
            <FormInput
              onChangeText={this.handleAmountChange}
              keyboardType="numeric"
              value={amount}
              inputStyle={{ width: '100%', color }}
            />
            <FormLabel>{intl.memo}</FormLabel>
            {hasMemoError && <FormValidationMessage>{memoError}</FormValidationMessage>}
            <FormInput
              onChangeText={this.handleMemoChange}
              multiline
              value={memo}
              autoCorrect={false}
              autoCapitalize="none"
              inputStyle={{ width: '100%', color }}
            />
            <DisclaimerText customTheme={customTheme}>{intl.transaction_complete}</DisclaimerText>
            <PrimaryButton
              onPress={this.handleSubmit}
              title={intl.transfer}
              style={{ width: 150, alignSelf: 'center' }}
            />
            <EmptyView />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);
