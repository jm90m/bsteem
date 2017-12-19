import _ from 'lodash';

export const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);

export const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);

export const isPostVoted = (postData, authUsername) => {
  if (_.isEmpty(authUsername)) {
    return false;
  }
  const userVote = _.find(postData.active_votes, { voter: authUsername }) || {};
  return userVote.percent > 0;
};
