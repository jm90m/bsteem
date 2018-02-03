import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import * as navigationConstants from 'constants/navigation';
import WalletTransactionContainer from './WalletTransactionContainer';

const ReceiveContent = styled.View`
  padding-left: 10px;
  flex-wrap: wrap;
  width: 200px;
`;

const TimeStamp = styled.Text`
  color: ${COLORS.BLUE.BOTICELLI};
  font-size: 14px;
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
`;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const ReceivedTextContainer = styled.View`
  flex-direction: row;
`;

const Touchable = styled.TouchableOpacity``;

const ReceiveTransaction = ({ from, memo, amount, timestamp, navigation }) => (
  <WalletTransactionContainer>
    <Avatar username={from} size={40} />
    <ReceiveContent>
      <ReceivedTextContainer>
        <Label>{'Received from '}</Label>
        <Touchable
          onPress={() => navigation.navigate(navigationConstants.USER, { username: from })}
        >
          <Username>{from}</Username>
        </Touchable>
      </ReceivedTextContainer>
      <TimeStamp>
        {moment(timestamp).fromNow()}
      </TimeStamp>
      <Memo>{memo}</Memo>
    </ReceiveContent>
    <Received>
      {'+'}{amount}
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
