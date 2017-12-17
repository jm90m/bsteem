import { createAsyncSagaAction } from 'util/reduxUtils';
import { FETCH_CURRENT_USER_FEED, FETCH_MORE_CURRENT_USER_FEED } from './actionTypes';

export const currentUserFeedFetch = createAsyncSagaAction(FETCH_CURRENT_USER_FEED);
export const currentUserFeedFetchMore = createAsyncSagaAction(FETCH_MORE_CURRENT_USER_FEED);
