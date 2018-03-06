import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_STEEM_RATE,
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_NETWORK_CONNECTION,
  SET_TRANSLATIONS,
  SET_STEEMCONNECT_ERROR_MODAL_DISPLAY,
  HIDE_NOTIFY_MODAL,
  DISPLAY_NOTIFY_MODAL,
  APP_ONBOARDING,
  FETCH_CRYPTO_PRICE_HISTORY,
  DISPLAY_PRICE_MODAL,
  HIDE_PRICE_MODAL,
  FETCH_REWARD_FUND,
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

export const appOnboarding = createAsyncSagaAction(APP_ONBOARDING);
export const fetchCryptoPriceHistory = createAsyncSagaAction(FETCH_CRYPTO_PRICE_HISTORY);

export const hidePriceModal = () => ({
  type: HIDE_PRICE_MODAL,
});

export const displayPriceModal = symbols => ({
  type: DISPLAY_PRICE_MODAL,
  payload: symbols,
});

export const fetchRewardFund = createAsyncSagaAction(FETCH_REWARD_FUND);
