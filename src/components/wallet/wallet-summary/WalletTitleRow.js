import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledViewPrimaryBackground from 'components/common/StyledViewPrimaryBackground';
import StyledTextByBackground from 'components/common/StyledTextByBackground';

const Container = styled(StyledViewPrimaryBackground)`
  padding-left: 14px;
  padding-right: 14px;
  height: 29px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

const Column = styled(StyledViewPrimaryBackground)`
  flex: 1;
  align-self: stretch;
  justify-content: center;
`;

const Label = styled(StyledTextByBackground)``;

const WalletTitleRow = ({ customTheme, intl }) => (
  <Container customTheme={customTheme}>
    <Column style={{ alignItems: 'flex-start' }}>
      <Label>{intl.coin}</Label>
    </Column>
    <Column style={{ alignItems: 'flex-end' }}>
      <Label>{intl.holding}</Label>
    </Column>
    <Column style={{ alignItems: 'flex-end' }}>
      <Label>{intl.price}</Label>
    </Column>
  </Container>
);

WalletTitleRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  customTheme: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(WalletTitleRow);
