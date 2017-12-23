import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import * as accountHistoryConstants from 'constants/accountHistory';
import PowerUpTransaction from './PowerUpTransaction';
import TransferTransaction from './TransferTransaction';
import ReceiveTransaction from './ReceiveTransaction';
import ClaimReward from './ClaimReward';

const getFormattedTransactionAmount = (amount, currency) => {
  if (!amount) {
    return null;
  }

  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(transaction[0]).toFixed(3);
  const transactionCurrency = currency || transaction[1];
  return `${transactionAmount} ${transactionCurrency}`;
};

const WalletTransaction = ({
  transaction,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
  navigation,
}) => {
  const transactionType = transaction.op[0];
  const transactionDetails = transaction.op[1];

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING:
      return (
        <PowerUpTransaction
          amount={getFormattedTransactionAmount(transactionDetails.amount, 'SP')}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.TRANSFER:
      if (transactionDetails.to === currentUsername) {
        return (
          <ReceiveTransaction
            from={transactionDetails.from}
            memo={transactionDetails.memo}
            amount={getFormattedTransactionAmount(transactionDetails.amount)}
            timestamp={transaction.timestamp}
            navigation={navigation}
          />
        );
      }
      return (
        <TransferTransaction
          to={transactionDetails.to}
          memo={transactionDetails.memo}
          amount={getFormattedTransactionAmount(transactionDetails.amount)}
          timestamp={transaction.timestamp}
          navigation={navigation}
        />
      );
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return (
        <ClaimReward
          timestamp={transaction.timestamp}
          rewardSteem={transactionDetails.reward_steem}
          rewardSbd={transactionDetails.reward_sbd}
          rewardVests={transactionDetails.reward_vests}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
        />
      );
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
    // return (
    //   <SavingsTransaction
    //     transactionDetails={transactionDetails}
    //     transactionType={transactionType}
    //     amount={getFormattedTransactionAmount(transactionDetails.amount)}
    //     timestamp={transaction.timestamp}
    //   />
    // );
    default:
      return null;
  }
};

WalletTransaction.propTypes = {
  transaction: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  navigation: PropTypes.shape().isRequired,
};

export default WalletTransaction;
