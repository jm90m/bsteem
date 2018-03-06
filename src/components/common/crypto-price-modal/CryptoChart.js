import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import { getCryptosPriceHistory } from 'state/rootReducer';
import { getCryptoDetails, getCurrentDaysOfTheWeek } from 'util/cryptoUtils';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel } from 'victory-native';
import _ from 'lodash';
import { COLORS, MATERIAL_COMMUNITY_ICONS } from 'constants/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as appActions from 'state/actions/appActions';
import LargeLoading from 'components/common/LargeLoading';

const { width: deviceWidth } = Dimensions.get('screen');

const Container = styled.View`
  padding: 20px;
`;

const USDPriceDisplay = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-size: 24px;
  font-weight: bold;
`;

const BTCPriceDisplay = styled.Text`
  color: ${COLORS.TERTIARY_COLOR};
  font-size: 22px;
  font-weight: bold;
`;

const PriceDisplayContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CryptoName = styled.Text`
  font-size: 20px;
`;

const Percent = styled.Text`
  color: ${props => (props.increase ? COLORS.BLUE.MEDIUM_AQUAMARINE : COLORS.RED.VALENCIA)};
  margin: 0 5px;
`;

const LoadingContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const mapStateToProps = state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
});

const mapDispatchToProps = dispatch => ({
  fetchCryptoPriceHistory: symbol =>
    dispatch(appActions.fetchCryptoPriceHistory.action({ symbol })),
});

class CryptoChart extends Component {
  static propTypes = {
    cryptosPriceHistory: PropTypes.shape().isRequired,
    fetchCryptoPriceHistory: PropTypes.func.isRequired,
    refreshCharts: PropTypes.bool,
    crypto: PropTypes.string,
  };

  static defaultProps = {
    refreshCharts: false,
    crypto: '',
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
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.symbol}.priceDetails`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'currentUSDPrice', 0);
    const usdIncrease = _.get(priceDetails, 'cryptoUSDIncrease', false);
    const usdPriceDifferencePercent = _.get(priceDetails, 'usdPriceDifferencePercent', 0);

    return (
      <PriceDisplayContainer>
        <USDPriceDisplay>{`$${currentUSDPrice}`}</USDPriceDisplay>
        <Percent increase={usdIncrease}>
          {parseFloat(usdPriceDifferencePercent).toFixed(2)}%
        </Percent>
        <MaterialCommunityIcons
          name={usdIncrease ? MATERIAL_COMMUNITY_ICONS.caretUp : MATERIAL_COMMUNITY_ICONS.caretDown}
          size={26}
          color={usdIncrease ? COLORS.BLUE.MEDIUM_AQUAMARINE : COLORS.RED.VALENCIA}
        />
      </PriceDisplayContainer>
    );
  }

  renderBTCPrice() {
    const { cryptosPriceHistory } = this.props;
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
        <BTCPriceDisplay>{`${currentBTCPrice} BTC`}</BTCPriceDisplay>
        <Percent increase={btcIncrease}>
          {parseFloat(btcPriceDifferencePercent).toFixed(2)}%
        </Percent>
        <MaterialCommunityIcons
          name={btcIncrease ? MATERIAL_COMMUNITY_ICONS.caretUp : MATERIAL_COMMUNITY_ICONS.caretDown}
          size={26}
          color={btcIncrease ? COLORS.BLUE.MEDIUM_AQUAMARINE : COLORS.RED.VALENCIA}
        />
      </PriceDisplayContainer>
    );
  }

  renderChart() {
    const { cryptosPriceHistory, locale } = this.props;
    const { currentCrypto } = this.state;
    const cryptoUSDPriceHistoryKey = `${currentCrypto.symbol}.usdPriceHistory`;
    const chartData = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, []);
    const daysOfTheWeek = getCurrentDaysOfTheWeek();
    const formattedChartData = _.map(daysOfTheWeek, (day, index) => {
      const price = _.get(chartData, index, 0);
      return {
        x: day,
        y: price,
        label: `$${price}`,
        fill: COLORS.PRIMARY_COLOR,
      };
    });
    return (
      <VictoryChart
        height={250}
        padding={{ top: 100, bottom: 100, left: 40, right: 40 }}
        width={deviceWidth - 40}
      >
        <VictoryLine
          data={formattedChartData}
          style={{
            data: { stroke: COLORS.PRIMARY_COLOR, strokeWidth: 3, opacity: 0.5 },
            labels: {
              fontSize: 18,
            },
          }}
          labelComponent={<VictoryLabel renderInPortal dy={-20} />}
        />
        <VictoryAxis style={{ axis: { stroke: 'none' } }} />
      </VictoryChart>
    );
  }

  render() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const usdAPIErrorKey = `${currentCrypto.symbol}.usdAPIError`;
    const usdAPIError = _.get(cryptosPriceHistory, usdAPIErrorKey, true);
    const cryptoUSDPriceHistoryKey = `${currentCrypto.symbol}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);
    const renderChart = Platform.OS === 'ios';

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
        {renderChart && this.renderChart()}
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CryptoChart);
