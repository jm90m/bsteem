import { createAsyncSagaAction } from 'util/reduxUtils';
import { FETCH_USER_ACCOUNT_HISTORY, FETCH_MORE_USER_ACCOUNT_HISTORY } from './actionTypes';

export const fetchUserAccountHistory = createAsyncSagaAction(FETCH_USER_ACCOUNT_HISTORY);
export const fetchMoreUserAccountHistory = createAsyncSagaAction(FETCH_MORE_USER_ACCOUNT_HISTORY);
