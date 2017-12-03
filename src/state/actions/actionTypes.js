const createAsyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

// Home Actions
export const FETCH_DISCUSSIONS = createAsyncActionType('@fetch-discussions');
export const FETCH_MORE_DISCUSSIONS = createAsyncActionType('@fetch-more-discussions');

export const FETCH_TAGS = createAsyncActionType('@fetch-tags');
export const AUTHENTICATE_USER = createAsyncActionType('@authenticate-user');
export const FETCH_COMMENTS = createAsyncActionType('@fetch-comments');

// User Actions
export const FETCH_USER = createAsyncActionType('@fetch-user');
