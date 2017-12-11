import { createAsyncSagaAction } from 'util/reduxUtils';
import { SEARCH_ASK_STEEM, SEARCH_FETCH_POST_DETAILS } from './actionTypes';

export const searchAskSteem = createAsyncSagaAction(SEARCH_ASK_STEEM);
export const searchFetchPostDetails = createAsyncSagaAction(SEARCH_FETCH_POST_DETAILS);
