import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import * as navigationConstants from 'constants/navigation';
import WalletTransactionContainer from './WalletTransactionContainer';

const TransferContent = styled.View`
  padding-left: 10px;
`;

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
`;

const Label = styled.Text`
  font-weight: bold;
`;

const Transfer = styled.Text`
  font-weight: bold;
  margin-left: auto;
  color: ${COLORS.RED.VALENCIA};
`;

const TransferTextContainer = styled.View`
  flex-direction: row;
`;

const Memo = styled.Text`
`;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const Touchable = styled.TouchableOpacity``;

const TransferTransaction = ({ to, memo, amount, timestamp, navigation }) => (
  <WalletTransactionContainer>
    <Avatar username={to} size={40} />
    <TransferContent>
      <TransferTextContainer>
        <Label>
          {'Transferred to '}
        </Label>
        <Touchable onPress={() => navigation.navigate(navigationConstants.USER, { username: to })}>
          <Username>{to}</Username>
        </Touchable>
      </TransferTextContainer>
      <TimeStamp>
        {moment(timestamp).fromNow()}
      </TimeStamp>
      <Memo>{memo}</Memo>
    </TransferContent>
    <Transfer>
      {'- '}{amount}
    </Transfer>
  </WalletTransactionContainer>
);

TransferTransaction.propTypes = {
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

export default TransferTransaction;
