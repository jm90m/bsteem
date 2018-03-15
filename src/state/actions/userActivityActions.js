import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
  LOAD_MORE_USER_ACTIONS,
  FETCH_USER_TRANSFER_HISTORY,
} from './actionTypes';

export const fetchUserAccountHistory = createAsyncSagaAction(FETCH_USER_ACCOUNT_HISTORY);
export const fetchMoreUserAccountHistory = createAsyncSagaAction(FETCH_MORE_USER_ACCOUNT_HISTORY);
export const fetchUserTransferHistory = createAsyncSagaAction(FETCH_USER_TRANSFER_HISTORY);
export const loadMoreUserActions = createAsyncSagaAction(LOAD_MORE_USER_ACTIONS);
