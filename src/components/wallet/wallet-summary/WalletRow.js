import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getCustomTheme } from 'state/rootReducer';
import SmallLoading from 'components/common/SmallLoading';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';

const Container = styled(StyledViewPrimaryBackground)`
  flex-direction: row;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 14px;
  padding-bottom: 14px;
  min-height: 60px;
  align-items: center;
  border-top-width: ${props => (props.isFirstElement ? '1px' : '0')};
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
  justify-content: space-between;
`;

const Column = styled(StyledViewPrimaryBackground)`
  flex: 1;
  align-self: stretch;
  justify-content: center;
`;

const Label = styled(StyledTextByBackground)`
  font-size: 16px;
`;

const ValueContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const Value = styled(StyledTextByBackground)``;

const calculateUSDValue = (value, currentUSDPrice) => {
  const parsedUSDPrice = parseFloat(currentUSDPrice);
  const usdPrice = _.isNaN(parsedUSDPrice) ? 0 : parsedUSDPrice;
  const parsedValue = parseFloat(value);
  const realValue = _.isNaN(parsedValue) ? 0 : parsedValue;
  return `$${parseFloat(realValue * usdPrice).toFixed(2)}`;
};

const WalletRow = ({
  label,
  value,
  customTheme,
  isFirstElement,
  showUSDValue,
  loading,
  coinRateDetails,
  totalDelegatedSP,
}) => (
  <Container customTheme={customTheme} isFirstElement={isFirstElement}>
    <Column style={{ minWidth: 50 }}>
      <Label>{label}</Label>
    </Column>
    <Column>
      {loading ? (
        <SmallLoading />
      ) : (
        showUSDValue && (
          <ValueContainer>
            <Value>{calculateUSDValue(value, coinRateDetails.currentUSDPrice)}</Value>
          </ValueContainer>
        )
      )}
      {!loading && (
        <ValueContainer>
          <Value>{value}</Value>
        </ValueContainer>
      )}
      {!loading &&
        !_.isEmpty(totalDelegatedSP) && (
          <ValueContainer>
            <Value>{totalDelegatedSP}</Value>
          </ValueContainer>
        )}
    </Column>
    <Column style={{ alignItems: 'flex-end' }}>
      {coinRateDetails.loading ? (
        <SmallLoading />
      ) : (
        <ValueContainer>
          <Value>${coinRateDetails.currentUSDPrice}</Value>
        </ValueContainer>
      )}
      {!coinRateDetails.loading && (
        <ValueContainer>
          <Value
            style={{
              color: coinRateDetails.usdIncrease
                ? customTheme.positiveColor
                : customTheme.negativeColor,
            }}
          >
            {coinRateDetails.steemRateDifference}
          </Value>
        </ValueContainer>
      )}
    </Column>
  </Container>
);

WalletRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  loading: PropTypes.bool,
  coinRateDetails: PropTypes.shape({
    steemRateDifference: PropTypes.string,
    usdIncrease: PropTypes.bool,
    currentUSDPrice: PropTypes.number,
  }),
  isFirstElement: PropTypes.bool,
  showUSDValue: PropTypes.bool,
  totalDelegatedSP: PropTypes.string,
  customTheme: PropTypes.shape().isRequired,
};

WalletRow.defaultProps = {
  label: '',
  totalDelegatedSP: '',
  value: '0.000',
  coinRateDetails: {
    steemRateDifference: '',
    usdIncrease: true,
    currentUSDPrice: 0,
  },
  isFirstElement: false,
  showUSDValue: true,
  loading: false,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
});

export default connect(mapStateToProps)(WalletRow);
