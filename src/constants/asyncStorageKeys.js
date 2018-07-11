export const STEEM_ACCESS_TOKEN = '@steem-access-token';
export const AUTH_EXPIRATION = '@auth-expiration';
export const AUTH_USERNAME = '@auth-username';
export const AUTH_MAX_EXPIRATION_AGE = '@auth-max-expiration-age';
export const SAVED_POSTS_OFFLINE = '@saved-post-key';
export const COMPACT_VIEW_ENABLED = '@saved-compact-view-setting';
export const IS_FIREBASE_LOGIN = '@is-firebase-login';
export const getSavedPostsKey = postID => `${SAVED_POSTS_OFFLINE}-${postID}`;
