import { NetInfo } from 'react-native';
import { takeLatest, call, put } from 'redux-saga/effects';
import _ from 'lodash';
import API from 'api/api';
import * as appActions from 'state/actions/appActions';
import { FETCH_STEEM_GLOBAL_PROPERTIES, FETCH_STEEM_RATE } from 'state/actions/actionTypes';
import { FETCH_NETWORK_CONNECTION } from '../actions/actionTypes';

const fetchGlobalSteemProperties = function*() {
  try {
    const result = yield call(API.getDynamicGlobalProperties);
    yield put(appActions.fetchSteemGlobalProperties.success(result));
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

export const watchFetchSteemGlobalProperties = function*() {
  yield takeLatest(FETCH_STEEM_GLOBAL_PROPERTIES.ACTION, fetchGlobalSteemProperties);
};

export const watchFetchSteemRate = function*() {
  yield takeLatest(FETCH_STEEM_RATE.ACTION, fetchSteemRate);
};

export const watchFetchNetworkConnection = function*() {
  yield takeLatest(FETCH_NETWORK_CONNECTION.ACTION, fetchNetworkConnection);
};
