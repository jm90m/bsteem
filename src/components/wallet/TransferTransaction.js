import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { COLORS } from 'constants/styles';
import Avatar from 'components/common/Avatar';
import * as navigationConstants from 'constants/navigation';
import { numberWithCommas } from 'util/steemitFormatters';
import i18n from 'i18n/i18n';
import TimeAgo from 'components/common/TimeAgo';
import WalletTransactionContainer from './WalletTransactionContainer';

const TransferContent = styled.Text`
  padding-left: 10px;
  flex-wrap: wrap;
  width: 200px;
`;

const Label = styled.Text`
  font-weight: bold;
`;

const Transfer = styled.Text`
  font-weight: bold;
  margin-left: auto;
  color: ${COLORS.RED.VALENCIA};
`;

const TransferTextContainer = styled.Text`
  flex-direction: row;
`;

const Memo = styled.Text`
  flex-wrap: wrap;
  z-index: 1;
`;

const Username = styled.Text`
  color: ${COLORS.PRIMARY_COLOR};
  font-weight: bold;
`;

const Touchable = styled.TouchableWithoutFeedback``;

const TransferTransaction = ({ to, memo, amount, timestamp, navigation }) => (
  <WalletTransactionContainer>
    <Avatar username={to} size={40} />
    <TransferContent>
      <TransferTextContainer>
        <Label>{`${i18n.activity.transferredTo} `}</Label>
        <Touchable onPress={() => navigation.navigate(navigationConstants.USER, { username: to })}>
          <Username>{to}</Username>
        </Touchable>
      </TransferTextContainer>
      {'\n'}
      <TimeAgo created={timestamp} />
      {'\n'}
      <Memo>{memo}</Memo>
    </TransferContent>
    <Transfer>
      {'-'}
      {numberWithCommas(amount)}
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
