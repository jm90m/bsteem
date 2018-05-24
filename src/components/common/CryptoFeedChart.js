import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getCustomTheme } from 'state/rootReducer';
import { getCryptoDetails } from 'util/cryptoUtils';
import CryptoChart from './crypto-price-modal/CryptoChart';

const ChartContainer = styled.View`
  background-color: ${props => props.customTheme.primaryBackgroundColor};
`;

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

class CryptoFeedChart extends Component {
  static propTypes = {
    customTheme: PropTypes.shape().isRequired,
    tag: PropTypes.string,
  };

  static defaultProps = {
    tag: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshCharts: false,
      currentCrypto: getCryptoDetails(props.tag),
    };
  }
  render() {
    const { customTheme } = this.props;
    const { refreshCharts, currentCrypto } = this.state;

    if (_.isEmpty(currentCrypto)) return null;

    const currentCryptoSymbol = _.get(currentCrypto, 'symbol', 'STEEM');
    return (
      <ChartContainer customTheme={customTheme}>
        <CryptoChart
          crypto={currentCryptoSymbol}
          refreshCharts={refreshCharts}
          height={100}
          hidePriceEveryOtherDay
        />
      </ChartContainer>
    );
  }
}

export default connect(mapStateToProps)(CryptoFeedChart);
