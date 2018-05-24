import { SORT_COMMENTS } from 'constants/comments';
import {
  REPUTATION_SORT,
  VOTE_VALUE_SORT,
  USERNAME_SORT,
  TIME_SORT,
} from 'constants/postConstants';
import _ from 'lodash';
import { getReputation } from 'util/steemitFormatters';

export const sortComments = (comments, sortType = SORT_COMMENTS.BEST.id) => {
  const sortedComments = [...comments];

  const netNegative = a => a.net_rshares < 0;
  const totalPayout = a =>
    parseFloat(a.pending_payout_value) +
    parseFloat(a.total_payout_value) +
    parseFloat(a.curator_payout_value);
  const netRshares = a => a.net_rshares;

  switch (sortType) {
    case SORT_COMMENTS.BEST.id:
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
    case SORT_COMMENTS.NEWEST.id:
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created)).reverse();
    case SORT_COMMENTS.OLDEST.id:
      return sortedComments.sort((a, b) => Date.parse(a.created) - Date.parse(b.created));
    case SORT_COMMENTS.REPUTATION.id:
      return sortedComments.sort(
        (a, b) => getReputation(b.author_reputation) - getReputation(a.author_reputation),
      );
    default:
      return sortedComments;
  }
};

// By Value
export const sortVotes = (a, b) => {
  const aShares = parseInt(a.rshares, 10);
  const bShares = parseInt(b.rshares, 10);
  return bShares - aShares;
};

export const getSortedVotes = (votes, sortType) => {
  switch (sortType) {
    case REPUTATION_SORT.id:
      return _.orderBy(votes, vote => parseInt(_.get(vote, 'reputation'), 10), ['desc']);
    case USERNAME_SORT.id:
      return _.sortBy(votes, ['voter']);
    case TIME_SORT.id:
      return _.orderBy(votes, vote => Date.parse(_.get(vote, 'time')), ['desc']);
    case VOTE_VALUE_SORT.id:
    default:
      return _.orderBy(votes, vote => parseInt(_.get(vote, 'rshares'), 10), ['desc']);
  }
};

export default null;
