import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_STEEM_RATE,
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_NETWORK_CONNECTION,
  SET_TRANSLATIONS,
  SET_STEEMCONNECT_ERROR_MODAL_DISPLAY,
  HIDE_NOTIFY_MODAL,
  DISPLAY_NOTIFY_MODAL,
} from './actionTypes';

export const fetchSteemRate = createAsyncSagaAction(FETCH_STEEM_RATE);
export const fetchSteemGlobalProperties = createAsyncSagaAction(FETCH_STEEM_GLOBAL_PROPERTIES);
export const fetchNetworkConnection = createAsyncSagaAction(FETCH_NETWORK_CONNECTION);
export const setTranslations = createAsyncSagaAction(SET_TRANSLATIONS);

export const setSteemConnectErrorModalDisplay = payload => ({
  type: SET_STEEMCONNECT_ERROR_MODAL_DISPLAY,
  payload,
});
export const showSteemConnectErrorModal = () => setSteemConnectErrorModalDisplay(true);

export const hideNotifyModal = () => ({
  type: HIDE_NOTIFY_MODAL,
});
export const displayNotifyModal = (notifyTitle, notifyDescription) => ({
  type: DISPLAY_NOTIFY_MODAL,
  payload: {
    notifyTitle,
    notifyDescription,
  },
});
