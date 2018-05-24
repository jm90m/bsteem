const errorStrings = {
  postInterval: 'You may only post once every 5 minutes',
  postCreationError: 'Post Creation Error',
  commentInterval: 'You may only comment once every 20 seconds.',
  commentCreationError: 'Comment Creation Error',
  voteError: 'Vote Error',
  voteDuplicate: 'You have already voted in a similar way',
  reblogError: 'Reblog Error',
  reblogDuplicate: 'You have already reblogged this post',
  reblogDuplicateFingerprint: 'Account has already reblogged this post',
  postTooBig: 'Your post is too big.',
  bandWidthError: 'Your bandwith has been exceeded. Please wait to transact or power up STEEM.',
  bandWidthErrorTitle: 'Bandwidth Error',
  genericErrorTitle: 'Error has occurred',
  genericErrorDescription: "An error has occurred, and we can't process the action at this moment",
  maxVoteChangeExceeded: 'You have exceeded the maximum number of vote changes on this comment.',
  maxVoteChangeExceededTitle: 'Max Vote Changes Exceeded',
  smallVotingWeightTitle: 'Small Voting Weight',
  smallVotingWeight:
    'Voting weight is too small, please accumulate more voting power or steem power',
  alreadyVotedTitle: 'Already voted',
  alreadyVotedDescription: 'You have already voted in a similar way.',
  accountNameTooLong: 'Account name is too long',
  accountNameTooShort: 'Account name is too short',
  amountHasToBeGreaterThanZero: 'Amount has to be greater than 0.',
  insufficientFunds: 'Insufficient funds',
  memoExchangeRequired: 'Memo is required when sending to an exchange.',
  accessTokenExpiredTitle: 'Access Token is expired',
  accessTokenExpiredDescription: 'Your access token is expired, you need to logout and log back in',
  voteWeightZeroTitle: 'Vote weight required',
  voteWeightZeroDescription: 'Vote weight cannot be 0',
};

const ERRORS = {
  POST_INTERVAL: {
    fingerprint: errorStrings.postInterval,
    title: errorStrings.postCreationError,
    message: errorStrings.postInterval,
  },
  COMMENT_INTERVAL: {
    fingerprint: errorStrings.commentInterval,
    title: errorStrings.commentCreationError,
    message: errorStrings.commentInterval,
  },
  DUPLICATE_VOTE: {
    fingerprint: errorStrings.voteDuplicate,
    title: errorStrings.voteError,
    message: errorStrings.voteDuplicate,
  },
  DUPLICATE_REBLOG: {
    fingerprint: errorStrings.reblogDuplicateFingerprint,
    title: errorStrings.reblogError,
    message: errorStrings.reblogDuplicate,
  },
  POST_TOO_BIG: {
    fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
    title: errorStrings.postCreationError,
    message: errorStrings.postTooBig,
  },
  BANDWIDTH_EXCEEDED: {
    fingerprint: 'bandwidth limit exceeded',
    title: errorStrings.bandWidthErrorTitle,
    message: errorStrings.bandWidthError,
  },
  EXPIRED_ACCESS_TOKEN: {
    title: errorStrings.accessTokenExpiredTitle,
    fingerprint: 'have permission to broadcast',
    description: errorStrings.accessTokenExpiredDescription,
  },
};

export const VOTE_ERRORS = [
  {
    title: errorStrings.maxVoteChangeExceededTitle,
    fingerprint: 'Voter has used the maximum number',
    description: errorStrings.maxVoteChangeExceeded,
  },
  {
    title: errorStrings.smallVotingWeightTitle,
    fingerprint: 'Voting weight is too small',
    description: errorStrings.smallVotingWeight,
  },
  {
    title: errorStrings.alreadyVotedTitle,
    fingerprint: 'You have already voted',
    description: errorStrings.alreadyVotedDescription,
  },
  {
    title: errorStrings.accessTokenExpiredTitle,
    fingerprint: 'have permission to broadcast', //The app @bsteem doesn't have permission to broadcast for <username>
    description: errorStrings.accessTokenExpiredDescription,
  },
  {
    title: errorStrings.voteWeightZeroTitle,
    fingerprint: 'Vote weight cannot be 0',
    description: errorStrings.voteWeightZeroDescription,
  },
];

export const GENERIC_ERROR = {
  title: errorStrings.genericErrorTitle,
  description: errorStrings.genericErrorDescription,
};

export default ERRORS;
