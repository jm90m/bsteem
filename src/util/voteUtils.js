import _ from 'lodash';

export const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);

export const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);

export const isPostVoted = (postData, authUsername) => {
  if (_.isEmpty(authUsername)) {
    return false;
  }
  const userVote = _.find(postData.active_votes, { voter: authUsername }) || {};
  return _.get(userVote, 'percent', 0) > 0;
};

export const getRatio = postData => {
  const totalPayout =
    parseFloat(postData.pending_payout_value) +
    parseFloat(postData.total_payout_value) +
    parseFloat(postData.curator_payout_value);
  const voteRshares = postData.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
  return totalPayout / voteRshares;
};
