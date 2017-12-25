import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
  LOAD_MORE_USER_ACTIONS,
} from './actionTypes';

export const fetchUserAccountHistory = createAsyncSagaAction(FETCH_USER_ACCOUNT_HISTORY);
export const fetchMoreUserAccountHistory = createAsyncSagaAction(FETCH_MORE_USER_ACCOUNT_HISTORY);
export const loadMoreUserActions = createAsyncSagaAction(LOAD_MORE_USER_ACTIONS);
