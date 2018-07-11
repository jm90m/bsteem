import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import * as navigationConstants from 'constants/navigation';
import { numberWithCommas } from 'util/steemitFormatters';
import TimeAgo from 'components/common/TimeAgo';
import { connect } from 'react-redux';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import PrimaryText from 'components/common/text/PrimaryText';
import WalletTransactionContainer from './WalletTransactionContainer';

const TransferContent = styled.Text`
  padding-left: 10px;
  flex-wrap: wrap;
  width: 200px;
`;

const Transfer = styled(PrimaryText)`
  margin-left: auto;
  color: ${props => props.customTheme.negativeColor};
`;

const TransferTextContainer = styled(PrimaryText)`
  flex-direction: row;
`;

const Username = styled(PrimaryText)`
  color: ${props => props.customTheme.primaryColor};
`;

const Touchable = styled.TouchableWithoutFeedback``;

const TransferTransaction = ({ to, memo, amount, timestamp, navigation, customTheme, intl }) => (
  <WalletTransactionContainer>
    <Avatar username={to} size={40} />
    <TransferContent>
      <TransferTextContainer>
        <StyledTextByBackground style={{ fontWeight: 'bold' }}>{`${
          intl.transferred_to
        } `}</StyledTextByBackground>
        <Touchable onPress={() => navigation.push(navigationConstants.USER, { username: to })}>
          <Username customTheme={customTheme}>{to}</Username>
        </Touchable>
      </TransferTextContainer>
      {'\n'}
      <TimeAgo created={timestamp} />
      {'\n'}
      <StyledTextByBackground>{memo}</StyledTextByBackground>
    </TransferContent>
    <Transfer customTheme={customTheme}>
      {'-'}
      {numberWithCommas(amount)}
    </Transfer>
  </WalletTransactionContainer>
);

TransferTransaction.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  navigation: PropTypes.shape().isRequired,
  to: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.string,
  timestamp: PropTypes.string,
};

TransferTransaction.defaultProps = {
  to: '',
  memo: '',
  amount: '',
  timestamp: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(TransferTransaction);
