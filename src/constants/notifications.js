export const REPLY = 'reply';
export const MENTION = 'mention';
export const FOLLOW = 'follow';
export const VOTE = 'vote';
export const REBLOG = 'reblog';
export const WITNESS_VOTE = 'witness_vote';
export const TRANSFER = 'transfer';

export const PARSED_NOTIFICATIONS = [REPLY, MENTION, FOLLOW, VOTE, REBLOG, WITNESS_VOTE, TRANSFER];

export const BUSY_API_TYPES = {
  notification: 'notification',
};

export const TYPE_VOTE = 'TYPE_VOTE';
export const TYPE_TRANSFER_OUT = 'TYPE_TRANSFER_OUT';
export const TYPE_TRANSFER_IN = 'TYPE_TRANSFER_IN';
export const TYPE_FOLLOW = 'TYPE_FOLLOW';
export const TYPE_REBLOG = 'TYPE_REBLOG';
export const TYPE_MENTION = 'TYPE_MENTION';
export const TYPE_REPLY = 'TYPE_REPLY';

export const PARSED_BSTEEM_NOTIFICATIONS = [
  TYPE_VOTE,
  TYPE_TRANSFER_OUT,
  TYPE_TRANSFER_IN,
  TYPE_FOLLOW,
  TYPE_REBLOG,
  TYPE_MENTION,
  TYPE_REPLY,
];
