import { createAsyncActionType } from 'util/reduxUtils';

// Home Actions
export const FETCH_DISCUSSIONS = createAsyncActionType('@fetch-discussions');
export const FETCH_MORE_DISCUSSIONS = createAsyncActionType('@fetch-more-discussions');

export const FETCH_TAGS = createAsyncActionType('@fetch-tags');
export const AUTHENTICATE_USER = createAsyncActionType('@authenticate-user');
export const FETCH_COMMENTS = createAsyncActionType('@fetch-comments');

// User Actions
export const FETCH_USER = createAsyncActionType('@fetch-user');
export const FETCH_USER_COMMENTS = createAsyncActionType('@fetch-user-comments');
export const FETCH_USER_BLOG = createAsyncActionType('@fetch-user-blog');
export const FETCH_USER_FOLLOW_COUNT = createAsyncActionType('@fetch-user-follow-count');
export const FETCH_ALL_USER_DETAILS = createAsyncActionType('@fetch-all-user-details');

// Tag/Search Screen Actions
export const SEARCH_ASK_STEEM = createAsyncActionType('@search-ask-steem');
export const SEARCH_FETCH_POST_DETAILS = createAsyncActionType('@search-fetch-post-details');
