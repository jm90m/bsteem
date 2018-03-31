import i18n from 'i18n/i18n';

export default {
  POST_INTERVAL: {
    fingerprint: i18n.errors.postInterval,
    title: i18n.errors.postCreationError,
    message: i18n.errors.postInterval,
  },
  COMMENT_INTERVAL: {
    fingerprint: i18n.errors.commentInterval,
    title: i18n.errors.commentCreationError,
    message: i18n.errors.commentInterval,
  },
  DUPLICATE_VOTE: {
    fingerprint: i18n.errors.voteDuplicate,
    title: i18n.errors.voteError,
    message: i18n.errors.voteDuplicate,
  },
  DUPLICATE_REBLOG: {
    fingerprint: i18n.errors.reblogDuplicateFingerprint,
    title: i18n.errors.reblogError,
    message: i18n.errors.reblogDuplicate,
  },
  POST_TOO_BIG: {
    fingerprint: '<= (get_dynamic_global_properties().maximum_block_size - 256)',
    title: i18n.errors.postCreationError,
    message: i18n.errors.postTooBig,
  },
  BANDWIDTH_EXCEEDED: {
    fingerprint: 'bandwidth limit exceeded',
    title: i18n.errors.bandWidthErrorTitle,
    message: i18n.errors.bandWidthError,
  },
  VOTE_CHANGED_EXCEEDED: {
    fingerprint: 'error',
  },
};

export const VOTE_ERRORS = [
  {
    title: i18n.errors.maxVoteChangeExceededTitle,
    fingerprint: 'Voter has used the maximum number',
    description: i18n.errors.maxVoteChangeExceeded,
  },
  {
    title: i18n.errors.smallVotingWeightTitle,
    fingerprint: 'Voting weight is too small',
    description: i18n.errors.smallVotingWeight,
  },
];

export const GENERIC_ERROR = {
  title: i18n.errors.genericErrorTitle,
  description: i18n.errors.genericErrorDescription,
};
