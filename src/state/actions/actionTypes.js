import { createAsyncActionType } from 'util/reduxUtils';

// Home Actions
export const FETCH_DISCUSSIONS = createAsyncActionType('@home/fetch-discussions');
export const FETCH_MORE_DISCUSSIONS = createAsyncActionType('@home/fetch-more-discussions');

export const FETCH_TAGS = createAsyncActionType('@fetch-tags');
export const FETCH_COMMENTS = createAsyncActionType('@fetch-comments');

// User Actions
export const FETCH_USER = createAsyncActionType('@user/fetch-user');
export const FETCH_USER_COMMENTS = createAsyncActionType('@user/fetch-user-comments');
export const FETCH_USER_BLOG = createAsyncActionType('@user/fetch-user-blog');
export const FETCH_USER_FOLLOW_COUNT = createAsyncActionType('@user/fetch-user-follow-count');
export const FETCH_ALL_USER_DETAILS = createAsyncActionType('@user/fetch-all-user-details');
export const REFRESH_USER_BLOG = createAsyncActionType('@user/refresh-user-blog');

// Tag/Search Screen Actions
export const SEARCH_ASK_STEEM = createAsyncActionType('@search/search-ask-steem');
export const SEARCH_FETCH_POST_DETAILS = createAsyncActionType(
  "@'@search/search-fetch-post-details",
);

// Auth Actions
export const AUTHENTICATE_USER = createAsyncActionType('@authenticate-user');
export const LOGOUT_USER = '@logout-user';

// Current User Actions
export const FETCH_CURRENT_USER_FEED = createAsyncActionType(
  '@current-user/fetch_current_user_feed',
);
export const FETCH_MORE_CURRENT_USER_FEED = createAsyncActionType(
  '@current-user/fetch_more_current_user_feed',
);
export const CURRENT_USER_VOTE_POST = createAsyncActionType('@current-user/current_user_vote_post');
export const CURRENT_USER_REBLOG_POST = createAsyncActionType(
  '@current-user/current_user_reblog_post',
);
export const FETCH_CURRENT_USER_REBLOG_LIST = createAsyncActionType(
  '@current-user/fetch_current_user_reblog_list',
);
export const CURRENT_USER_ONBOARDING = createAsyncActionType(
  '@current-user/current_user_onboarding',
);
export const FETCH_CURRENT_USER_FOLLOW_LIST = createAsyncActionType(
  '@current-user/fetch-current-user-follow-list',
);
export const CURRENT_USER_FOLLOW_USER = createAsyncActionType(
  '@current-user/current-user-follow-user',
);
export const CURRENT_USER_UNFOLLOW_USER = createAsyncActionType(
  '@current-user/current-user-unfollow-user',
);

// User Activity Actions
export const FETCH_USER_ACCOUNT_HISTORY = createAsyncActionType(
  '@user-activity/fetch-user-account-history',
);
export const FETCH_MORE_USER_ACCOUNT_HISTORY = createAsyncActionType(
  '@user-activity/fetch-more-user-account-history',
);
export const LOAD_MORE_USER_ACTIONS = createAsyncActionType(
  '@user-activity/load-more-user-actions',
);

// App Actions
export const FETCH_STEEM_RATE = createAsyncActionType('@app/fetch-steem-rate');
export const FETCH_STEEM_GLOBAL_PROPERTIES = createAsyncActionType(
  '@app/fetch-steem-global-properties',
);
export const FETCH_NETWORK_CONNECTION = createAsyncActionType('@app/fetch-network-connection');
export const SET_TRANSLATIONS = createAsyncActionType('@app/set-translations');

// Editor Actions
export const CREATE_POST = createAsyncActionType('@editor/create-post');
export const UPLOAD_IMAGE = createAsyncActionType('@editor/upload-image');
