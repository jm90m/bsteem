import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import TimeAgo from 'components/common/TimeAgo';
import { numberWithCommas } from 'util/steemitFormatters';
import i18n from 'i18n/i18n';
import * as navigationConstants from 'constants/navigation';
import WalletTransactionContainer from './WalletTransactionContainer';

const ReceiveContent = styled.Text`
  padding-left: 10px;
  flex-wrap: wrap;
  width: 200px;
`;

const Label = styled.Text`
  font-weight: bold;
`;

const Received = styled.Text`
  font-weight: bold;
  margin-left: auto;
  color: ${COLORS.BLUE.MEDIUM_AQUAMARINE};
`;

const Memo = styled.Text`
  flex-wrap: wrap;
  z-index: 1;
`;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const ReceivedTextContainer = styled.Text`
  flex-direction: row;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const ReceiveTransaction = ({ from, memo, amount, timestamp, navigation }) => (
  <WalletTransactionContainer>
    <Avatar username={from} size={40} />
    <ReceiveContent>
      <ReceivedTextContainer>
        <Label>{`${i18n.activity.receivedFrom} `}</Label>
        <Touchable
          onPress={() => navigation.navigate(navigationConstants.USER, { username: from })}
        >
          <Username>{from}</Username>
        </Touchable>
      </ReceivedTextContainer>
      {'\n'}
      <TimeAgo created={timestamp} />
      {'\n'}
      <Memo>{memo}</Memo>
    </ReceiveContent>
    <Received>
      {'+'}
      {numberWithCommas(amount)}
    </Received>
  </WalletTransactionContainer>
);

ReceiveTransaction.propTypes = {
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

export default ReceiveTransaction;
