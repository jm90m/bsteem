import { NetInfo } from 'react-native';
import { takeLatest, call, put } from 'redux-saga/effects';
import _ from 'lodash';
import API from 'api/api';
import { i18nInit } from 'i18n-settings/i18n';
import * as appActions from 'state/actions/appActions';

import {
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_STEEM_RATE,
  FETCH_NETWORK_CONNECTION,
  SET_TRANSLATIONS,
} from 'state/actions/actionTypes';

const fetchGlobalSteemProperties = function*() {
  try {
    const result = yield call(API.getDynamicGlobalProperties);
    if (result.error) {
      yield put(appActions.fetchSteemGlobalProperties.fail(result.error));
    } else {
      yield put(appActions.fetchSteemGlobalProperties.success(result.result));
    }
  } catch (error) {
    yield put(appActions.fetchSteemGlobalProperties.fail(error));
  } finally {
    yield put(appActions.fetchSteemGlobalProperties.loadingEnd());
  }
};

const fetchSteemRate = function*() {
  try {
    const result = yield call(API.getSteemRate);
    const rateDetails = _.get(result, 0, {});
    const rate = _.get(rateDetails, 'price_usd', 0);
    yield put(appActions.fetchSteemRate.success(rate));
  } catch (error) {
    yield put(appActions.fetchSteemRate.fail(error));
  } finally {
    yield put(appActions.fetchSteemRate.loadingEnd());
  }
};

const fetchNetworkConnection = function*() {
  try {
    const result = yield call(NetInfo.getConnectionInfo);
    yield put(appActions.fetchNetworkConnection.success(result));
  } catch (error) {
    yield put(appActions.fetchNetworkConnection.fail(error));
  } finally {
    yield put(appActions.fetchNetworkConnection.loadingEnd());
  }
};

const setTranslations = function*(action) {
  try {
    const { locale } = action.payload;
    yield call(i18nInit, locale);
    console.log('success change locale to', locale);
  } catch (error) {
    console.log('failed to set translations');
  }
};

export const watchFetchSteemGlobalProperties = function*() {
  yield takeLatest(FETCH_STEEM_GLOBAL_PROPERTIES.ACTION, fetchGlobalSteemProperties);
};

export const watchFetchSteemRate = function*() {
  yield takeLatest(FETCH_STEEM_RATE.ACTION, fetchSteemRate);
};

export const watchFetchNetworkConnection = function*() {
  yield takeLatest(FETCH_NETWORK_CONNECTION.ACTION, fetchNetworkConnection);
};

export const watchSetTranslations = function*() {
  yield takeLatest(SET_TRANSLATIONS.ACTION, setTranslations);
};
