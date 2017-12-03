export const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);

export const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);
