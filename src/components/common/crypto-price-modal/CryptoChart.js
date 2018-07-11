import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { Platform } from 'react-native';
import { getCryptosPriceHistory, getCustomTheme, getLanguageSetting } from 'state/rootReducer';
import { getCryptoDetails, getCurrentDaysOfTheWeek } from 'util/cryptoUtils';
import _ from 'lodash';
import { MATERIAL_COMMUNITY_ICONS, COLORS } from 'constants/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as appActions from 'state/actions/appActions';
import tinycolor from 'tinycolor2';
import LargeLoading from 'components/common/LargeLoading';
import { LineChart, XAxis } from 'react-native-svg-charts';
import PrimaryText from 'components/common/text/PrimaryText';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import { Text } from 'react-native-svg';

const Container = styled.View`
  padding: 20px;
`;

const USDPriceDisplay = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
  font-size: 24px;
`;

const BTCPriceDisplay = styled(PrimaryText)`
  color: ${props => props.customTheme.tertiaryColor};
  font-size: 22px;
`;

const PriceDisplayContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CryptoName = styled(StyledTextByBackground)`
  font-size: 20px;
`;

const Percent = styled(PrimaryText)`
  color: ${props =>
    props.increase ? props.customTheme.positiveColor : props.customTheme.negativeColor};
  margin: 0 5px;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const mapStateToProps = state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
  customTheme: getCustomTheme(state),
  languageSetting: getLanguageSetting(state),
});

const mapDispatchToProps = dispatch => ({
  fetchCryptoPriceHistory: symbol =>
    dispatch(appActions.fetchCryptoPriceHistory.action({ symbol })),
});

class CryptoChart extends Component {
  static propTypes = {
    cryptosPriceHistory: PropTypes.shape().isRequired,
    customTheme: PropTypes.shape().isRequired,
    fetchCryptoPriceHistory: PropTypes.func.isRequired,
    refreshCharts: PropTypes.bool,
    hidePriceEveryOtherDay: PropTypes.bool,
    crypto: PropTypes.string,
    languageSetting: PropTypes.string.isRequired,
    height: PropTypes.number,
  };

  static defaultProps = {
    refreshCharts: false,
    hidePriceEveryOtherDay: false,
    crypto: '',
    height: 200,
  };
  constructor(props) {
    super(props);
    const currentCrypto = getCryptoDetails(props.crypto);

    this.state = {
      currentCrypto,
    };
  }

  componentDidMount() {
    const { currentCrypto } = this.state;
    if (!_.isEmpty(currentCrypto)) {
      this.props.fetchCryptoPriceHistory(currentCrypto.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentCrypto = getCryptoDetails(nextProps.crypto);
    const isDifferentCrypto = this.props.crypto !== nextProps.crypto;
    if (isDifferentCrypto || nextProps.refreshCharts) {
      this.setState(
        {
          currentCrypto,
        },
        () => this.props.fetchCryptoPriceHistory(currentCrypto.symbol, true),
      );
    } else {
      this.setState({
        currentCrypto,
      });
    }
  }

  renderUSDPrice() {
    const { cryptosPriceHistory, customTheme } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.symbol}.priceDetails`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'currentUSDPrice', 0);
    const usdIncrease = _.get(priceDetails, 'cryptoUSDIncrease', false);
    const usdPriceDifferencePercent = _.get(priceDetails, 'usdPriceDifferencePercent', 0);

    return (
      <PriceDisplayContainer>
        <USDPriceDisplay customTheme={customTheme}>{`$${currentUSDPrice}`}</USDPriceDisplay>
        <Percent customTheme={customTheme} increase={usdIncrease}>
          {parseFloat(usdPriceDifferencePercent).toFixed(2)}%
        </Percent>
        <MaterialCommunityIcons
          name={usdIncrease ? MATERIAL_COMMUNITY_ICONS.caretUp : MATERIAL_COMMUNITY_ICONS.caretDown}
          size={26}
          color={usdIncrease ? customTheme.positiveColor : customTheme.negativeColor}
        />
      </PriceDisplayContainer>
    );
  }

  renderBTCPrice() {
    const { cryptosPriceHistory, customTheme } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.symbol}.priceDetails`;
    const cryptoBTCAPIErrorKey = `${currentCrypto.symbol}.btcAPIError`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const btcAPIError = _.get(cryptosPriceHistory, cryptoBTCAPIErrorKey, true);

    if (btcAPIError) return null;

    const currentBTCPrice = _.get(priceDetails, 'currentBTCPrice', 0);
    const btcIncrease = _.get(priceDetails, 'cryptoBTCIncrease', false);
    const btcPriceDifferencePercent = _.get(priceDetails, 'btcPriceDifferencePercent', 0);
    return (
      <PriceDisplayContainer>
        <BTCPriceDisplay customTheme={customTheme}>{`${currentBTCPrice} BTC`}</BTCPriceDisplay>
        <Percent increase={btcIncrease} customTheme={customTheme}>
          {parseFloat(btcPriceDifferencePercent).toFixed(2)}%
        </Percent>
        <MaterialCommunityIcons
          name={btcIncrease ? MATERIAL_COMMUNITY_ICONS.caretUp : MATERIAL_COMMUNITY_ICONS.caretDown}
          size={26}
          color={btcIncrease ? customTheme.positiveColor : customTheme.negativeColor}
        />
      </PriceDisplayContainer>
    );
  }

  render() {
    const {
      cryptosPriceHistory,
      customTheme,
      height,
      languageSetting,
      hidePriceEveryOtherDay,
    } = this.props;
    const { currentCrypto } = this.state;
    const usdAPIErrorKey = `${currentCrypto.symbol}.usdAPIError`;
    const usdAPIError = _.get(cryptosPriceHistory, usdAPIErrorKey, true);
    const cryptoUSDPriceHistoryKey = `${currentCrypto.symbol}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);
    const chartData = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, []);
    const parsedLanguaged = _.get(_.split(languageSetting, '_'), 0, 'en');
    const daysOfTheWeek = getCurrentDaysOfTheWeek(parsedLanguaged);
    const xAxisTextColor = tinycolor(customTheme.primaryBackgroundColor).isDark()
      ? COLORS.LIGHT_TEXT_COLOR
      : COLORS.DARK_TEXT_COLOR;

    if (loading) {
      return (
        <LoadingContainer>
          <LargeLoading />
        </LoadingContainer>
      );
    }

    if (_.isEmpty(currentCrypto) || usdAPIError || _.isEmpty(usdPriceHistory)) return null;

    return (
      <Container>
        <CryptoName>{currentCrypto.name}</CryptoName>
        {this.renderUSDPrice()}
        {this.renderBTCPrice()}
        {Platform.OS === 'ios' && (
          <Container style={{ height, marginBottom: 20 }}>
            <LineChart
              style={{ height }}
              data={chartData}
              svg={{ stroke: customTheme.primaryColor, strokeWidth: 2 }}
              contentInset={{ top: 40, bottom: 20, left: 20, right: 20 }}
              showGrid={false}
              animate={false}
              renderDecorator={data => {
                const dx = data.x(data.index);
                const dy = data.y(data.value);
                const key = `${data.value}${data.index}`;
                const isEven = data.index % 2 === 0;

                if (hidePriceEveryOtherDay && isEven) {
                  return null;
                }

                return (
                  <Text
                    key={key}
                    dx={dx}
                    dy={dy - 30}
                    alignmentBaseline="hanging"
                    textAnchor="middle"
                    stroke={customTheme.primaryColor}
                  >
                    {`$${data.value}`}
                  </Text>
                );
              }}
            />
            <XAxis
              style={{ marginHorizontal: -10 }}
              data={[0, 1, 2, 3, 4, 5, 6]}
              formatLabel={value => daysOfTheWeek[value]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 14, fill: xAxisTextColor }}
            />
          </Container>
        )}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CryptoChart);
