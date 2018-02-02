import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_STEEM_RATE,
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_NETWORK_CONNECTION,
  SET_TRANSLATIONS,
} from './actionTypes';

export const fetchSteemRate = createAsyncSagaAction(FETCH_STEEM_RATE);
export const fetchSteemGlobalProperties = createAsyncSagaAction(FETCH_STEEM_GLOBAL_PROPERTIES);
export const fetchNetworkConnection = createAsyncSagaAction(FETCH_NETWORK_CONNECTION);
export const setTranslations = createAsyncSagaAction(SET_TRANSLATIONS);
