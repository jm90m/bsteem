import { createAsyncActionType } from 'util/reduxUtils';

// Home Actions
export const FETCH_DISCUSSIONS = createAsyncActionType('@home/fetch-discussions');
export const FETCH_MORE_DISCUSSIONS = createAsyncActionType('@home/fetch-more-discussions');
export const FETCH_TAGS = createAsyncActionType('@fetch-tags');
export const FETCH_COMMENTS = createAsyncActionType('@fetch-comments');
export const ENABLE_FILTER_HOME_FEED_BY_FOLLOWERS = '@home/enable-filter-home-feed-by-followers';
export const DISABLE_FILTER_HOME_FEED_BY_FOLLOWERS = '@home/disable-filter-home-feed-by-followers';

// User Actions
export const FETCH_USER = createAsyncActionType('@user/fetch-user');
export const FETCH_USER_COMMENTS = createAsyncActionType('@user/fetch-user-comments');
export const FETCH_USER_BLOG = createAsyncActionType('@user/fetch-user-blog');
export const FETCH_USER_FOLLOW_COUNT = createAsyncActionType('@user/fetch-user-follow-count');
export const FETCH_ALL_USER_DETAILS = createAsyncActionType('@user/fetch-all-user-details');
export const REFRESH_USER_BLOG = createAsyncActionType('@user/refresh-user-blog');

// Tag/Search Screen Actions
export const SEARCH_FETCH_POSTS = createAsyncActionType('@search/search-fetch-posts');
export const SEARCH_FETCH_USERS = createAsyncActionType('@search/search-fetch-users');
export const SEARCH_FETCH_TAGS = createAsyncActionType('@search/search-fetch-tags');
export const SEARCH_SET_TRENDING_TAGS = '@search/search-set-trending-tags';

// Auth Actions
export const AUTHENTICATE_USER = createAsyncActionType('@authenticate-user');
export const LOGOUT_USER = '@logout-user';
export const GET_AUTH_USER_SC_DATA = createAsyncActionType('@auth/get-auth-user-sc-data');
export const SAVE_NOTIFICATIONS_LAST_TIMESTAMP = createAsyncActionType(
  '@auth/save-notifications-last-timestamp',
);
export const SET_CURRENT_USER_NAVIGATION = 'set-current-user-navigation';

// Current User Actions
export const FETCH_CURRENT_USER_FEED = createAsyncActionType(
  '@current-user/fetch_current_user_feed',
);
export const FETCH_MORE_CURRENT_USER_FEED = createAsyncActionType(
  '@current-user/fetch_more_current_user_feed',
);
export const CURRENT_USER_VOTE_POST = createAsyncActionType('@current-user/current_user_vote_post');
export const CURRENT_USER_VOTE_COMMENT = createAsyncActionType(
  '@current-user/current-user-vote-comment',
);
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
export const FETCH_CURRENT_USER_BSTEEM_FEED = createAsyncActionType(
  '@current-user/fetch-current-user-bsteem-feed',
);
export const FETCH_MORE_CURRENT_USER_BSTEEM_FEED = createAsyncActionType(
  '@current-user/fetch-more-current-user-bsteem-feed',
);
export const GET_NOTIFICATIONS = createAsyncActionType('@current-user/get-notifications');
export const ADD_NEW_NOTIFICATION = 'add-new-notification';

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
export const FETCH_USER_TRANSFER_HISTORY = createAsyncActionType(
  '@user-activity/fetch-user-transfer-history',
);

// App Actions
export const FETCH_STEEM_RATE = createAsyncActionType('@app/fetch-steem-rate');
export const FETCH_STEEM_GLOBAL_PROPERTIES = createAsyncActionType(
  '@app/fetch-steem-global-properties',
);
export const FETCH_NETWORK_CONNECTION = createAsyncActionType('@app/fetch-network-connection');
export const DISPLAY_NOTIFY_MODAL = '@app/display-notify-modal';
export const HIDE_NOTIFY_MODAL = '@app/hide-notify-modal';
export const APP_ONBOARDING = createAsyncActionType('@app/app-onboardig');
export const FETCH_CRYPTO_PRICE_HISTORY = createAsyncActionType('@app/fetch-crypto-price-history');
export const DISPLAY_PRICE_MODAL = '@app/display-price-modal';
export const HIDE_PRICE_MODAL = '@app/hide-price-modal';
export const FETCH_REWARD_FUND = createAsyncActionType('@app/fetch-reward-fund');
export const INITIAL_APP_LOADED = createAsyncActionType('@app/initial-app-loaded');

// Editor Actions
export const CREATE_POST = createAsyncActionType('@editor/create-post');
export const CREATE_COMMENT = createAsyncActionType('@editor/create-comment');
export const UPLOAD_IMAGE = createAsyncActionType('@editor/upload-image');

// Firebase Actions
export const FETCH_SAVED_TAGS = createAsyncActionType('@firebase/fetch-saved-tags');
export const SAVE_TAG = createAsyncActionType('@firebase/save-tag');
export const UNSAVE_TAG = createAsyncActionType('@firebase/unsave-tag');
export const FETCH_SAVED_POSTS = createAsyncActionType('@firebase/fetch-saved-posts');
export const SAVE_POST = createAsyncActionType('@firebase/save-post');
export const UNSAVE_POST = createAsyncActionType('@firebase/unsave-post');
export const FETCH_SAVED_USERS = createAsyncActionType('@firebase/fetch-saved-users');
export const SAVE_USER = createAsyncActionType('@firebase/save-user');
export const UNSAVE_USER = createAsyncActionType('@firebase/unsave-user');
export const SAVE_DRAFT = createAsyncActionType('@firebase/save-draft');
export const DELETE_DRAFT = createAsyncActionType('@firebase/delete-draft');
export const FETCH_DRAFTS = createAsyncActionType('@firebase/fetch-drafts');

// Posts Actions
export const FETCH_POST_DETAILS = createAsyncActionType('@posts/fetch-post-details');
export const SAVE_POST_OFFLINE = createAsyncActionType('@posts/save-post-offline');
export const FETCH_SAVED_OFFLINE_POSTS = createAsyncActionType('@posts/fetch-saved-offline-posts');
export const ADD_POST_TO_SAVED_OFFLINE = '@post/add-post-to-saved-offline';
export const UNSAVE_POST_OFFLINE = createAsyncActionType('@posts/unsave-post-offline');
export const REMOVE_POST_SAVED_OFFLINE = '@post/remove-post-saved-offline';
export const ADD_POSTS_TO_POST_MAP = '@post/add-posts-to-post-map';

// Settings Actions
export const UPDATE_NSFW_DISPLAY_SETTING = createAsyncActionType(
  '@settings/update-nsfw-display-settings',
);
export const FETCH_CURRENT_USER_SETTINGS = createAsyncActionType(
  '@settings/fetch-current-user-settings',
);
export const CURRENT_USER_REPORT_POST = createAsyncActionType('@settings/current-user-report-post');
export const CURRENT_USER_UNREPORT_POST = createAsyncActionType(
  '@settings/current-user-unreport-post',
);
export const FETCH_REPORTED_POSTS = createAsyncActionType('@settings/fetch-reported-posts');
export const UPDATE_VOTING_SLIDER_SETTING = createAsyncActionType(
  '@settings/update-voting-slider-setting',
);
export const UPDATE_VOTING_PERCENT_SETTING = createAsyncActionType(
  '@settings/update-voting-percent-setting',
);
export const UPDATE_CUSTOM_THEME = createAsyncActionType('@settings/update-custom-theme');
export const UPDATE_POST_PREVIEW_COMPACT_MODE_SETTINGS = createAsyncActionType(
  '@settings/update-post-preview-compact-mode-settings',
);
export const UPDATE_USER_LANGUAGE = createAsyncActionType('@settings/update-user-language');
export const UPDATE_USER_SIGNATURE = createAsyncActionType('@settings/update-user-signature');
export const UPDATE_ENABLE_USER_SIGNATURE = createAsyncActionType(
  '@settings/update-enable-user-signature',
);

// Messages
export const FETCH_DISPLAYED_MESSAGES = createAsyncActionType('@messages/fetch-displayed-messages');
export const SEARCH_USER_MESSAGES = createAsyncActionType('@messages/search-user-messages');
export const SEND_MESSAGE = createAsyncActionType('@messages/send-message');
export const FETCH_CURRENT_MESSAGES = createAsyncActionType('@messages/fetch-current-messages');
export const FETCH_BLOCKED_USERS = createAsyncActionType('@messages/fetch-blocked-users');
export const BLOCK_USER = createAsyncActionType('@messages/block-user');
export const UNBLOCK_USER = createAsyncActionType('@messages/unblock-user');
export const HIDE_DISPLAYED_USER_MESSAGE = createAsyncActionType(
  '@messages/hide-displayed-user-message',
);

export const SET_LANGUAGE_SETTING = '@intl/set-language-setting';
