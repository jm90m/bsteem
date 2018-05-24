import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';
import { numberWithCommas } from 'util/steemitFormatters';
import { getCustomTheme, getIntl } from 'state/rootReducer';
import { connect } from 'react-redux';
import * as navigationConstants from 'constants/navigation';
import StyledTextByBackground from 'components/common/StyledTextByBackground';
import WalletTransactionContainer from './WalletTransactionContainer';

const ReceiveContent = styled.Text`
  padding-left: 10px;
  flex-wrap: wrap;
  width: 200px;
`;

const Received = styled.Text`
  font-weight: bold;
  margin-left: auto;
  color: ${props => props.customTheme.positiveColor};
`;

const Username = styled.Text`
  color: ${props => props.customTheme.primaryColor};
  font-weight: bold;
`;

const ReceivedTextContainer = styled.Text`
  flex-direction: row;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const ReceiveTransaction = ({ from, memo, amount, timestamp, navigation, customTheme, intl }) => (
  <WalletTransactionContainer>
    <Avatar username={from} size={40} />
    <ReceiveContent>
      <ReceivedTextContainer>
        <StyledTextByBackground>{`${intl.received_from} `}</StyledTextByBackground>
        <Touchable
          onPress={() => navigation.navigate(navigationConstants.USER, { username: from })}
        >
          <Username customTheme={customTheme}>{from}</Username>
        </Touchable>
      </ReceivedTextContainer>
      {'\n'}
      <TimeAgo created={timestamp} />
      {'\n'}
      <StyledTextByBackground style={{ flexWrap: 'wrap', zIndex: 1 }}>
        {memo}
      </StyledTextByBackground>
    </ReceiveContent>
    <Received customTheme={customTheme}>
      {'+'}
      {numberWithCommas(amount)}
    </Received>
  </WalletTransactionContainer>
);

ReceiveTransaction.propTypes = {
  customTheme: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  navigation: PropTypes.shape().isRequired,
  from: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.string,
  timestamp: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: '',
  timestamp: '',
};

const mapStateToProps = state => ({
  customTheme: getCustomTheme(state),
  intl: getIntl(state),
});

export default connect(mapStateToProps)(ReceiveTransaction);
