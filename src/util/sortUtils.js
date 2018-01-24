import { SORT_COMMENTS } from 'constants/comments';

export const sortComments = (comments, sortType = SORT_COMMENTS.BEST) => {
  const sortedComments = [...comments];

  const netNegative = a => a.net_rshares < 0;
  const totalPayout = a =>
    parseFloat(a.pending_payout_value) +
    parseFloat(a.total_payout_value) +
    parseFloat(a.curator_payout_value);
  const netRshares = a => a.net_rshares;

  switch (sortType) {
    case SORT_COMMENTS.BEST:
      return sortedComments.sort((a, b) => {
        if (netNegative(a)) {
          return 1;
        } else if (netNegative(b)) {
          return -1;
        }

        const aPayout = totalPayout(a);
        const bPayout = totalPayout(b);

        if (aPayout !== bPayout) {
          return bPayout - aPayout;
        }

        return netRshares(b) - netRshares(a);
      });
    case SORT_COMMENTS.NEWEST:
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created)).reverse();
    case SORT_COMMENTS.OLDEST:
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created));
    default:
      return sortedComments;
  }
};

export const sortVotes = (a, b) => {
  const aShares = parseInt(a.rshares, 10);
  const bShares = parseInt(b.rshares, 10);
  return bShares - aShares;
};

export default null;
