import * as accountHistoryConstants from 'constants/accountHistory';

export const isWalletTransaction = actionType =>
  actionType === accountHistoryConstants.TRANSFER ||
  actionType === accountHistoryConstants.TRANSFER_TO_VESTING ||
  actionType === accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_TO_SAVINGS ||
  actionType === accountHistoryConstants.DELEGATE_VESTING_SHARES ||
  actionType === accountHistoryConstants.CLAIM_REWARD_BALANCE;

export default null;
