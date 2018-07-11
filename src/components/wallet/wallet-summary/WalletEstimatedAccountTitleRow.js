import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import SmallLoading from 'components/common/SmallLoading';

const Container = styled(StyledViewPrimaryBackground)`
  padding-left: 14px;
  padding-right: 14px;
  height: 29px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-top-width: ${props => (props.hideTopBorder ? '0' : '1px')};
  border-top-color: ${props => props.customTheme.primaryBorderColor};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.customTheme.primaryBorderColor};
`;

const Column = styled(StyledViewPrimaryBackground)``;

const Label = styled(StyledTextByBackground)``;

const Value = styled(StyledTextByBackground)``;

const WalletEstimatedAccountTitleRow = ({ customTheme, estAccountValueDetails, loading, intl }) => (
  <View>
    <Container customTheme={customTheme}>
      <Column>
        <Label>{intl.total_portfolio_value}</Label>
      </Column>
      <Column>
        <Label>{intl['24h_change']}</Label>
      </Column>
    </Container>
    <Container style={{ height: 62 }} customTheme={customTheme} hideTopBorder>
      {loading || _.isNaN(estAccountValueDetails.currentEstAccountValue) ? (
        <SmallLoading />
      ) : (
        <Value style={{ fontSize: 32 }}>{`$${
          estAccountValueDetails.currentEstAccountValue
        }`}</Value>
      )}
      {loading || estAccountValueDetails.loading ? (
        <SmallLoading />
      ) : (
        <Value
          style={{
            color: estAccountValueDetails.estAccountValueIncrease
              ? customTheme.positiveColor
              : customTheme.negativeColor,
            fontSize: 18,
          }}
        >
          {estAccountValueDetails.estAccountValueDifference}
        </Value>
      )}
    </Container>
  </View>
);

WalletEstimatedAccountTitleRow.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  estAccountValueDetails: PropTypes.shape(),
  loading: PropTypes.bool,
};

WalletEstimatedAccountTitleRow.defaultProps = {
  estAccountValueDetails: {},
  loading: false,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(WalletEstimatedAccountTitleRow);
