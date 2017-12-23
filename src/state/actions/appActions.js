import { createAsyncSagaAction } from 'util/reduxUtils';
import { FETCH_STEEM_RATE, FETCH_STEEM_GLOBAL_PROPERTIES } from './actionTypes';

export const fetchSteemRate = createAsyncSagaAction(FETCH_STEEM_RATE);
export const fetchSteemGlobalProperties = createAsyncSagaAction(FETCH_STEEM_GLOBAL_PROPERTIES);
