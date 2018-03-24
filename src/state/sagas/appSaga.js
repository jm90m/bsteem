import { AsyncStorage, NetInfo } from 'react-native';
import { takeLatest, call, put, all, takeEvery } from 'redux-saga/effects';
import _ from 'lodash';
import API from 'api/api';
import { i18nInit } from 'i18n/i18n';
import * as appActions from 'state/actions/appActions';
import * as homeActions from 'state/actions/homeActions';
import * as authActions from 'state/actions/authActions';
import * as firebaseSaga from 'state/sagas/firebaseSaga';
import * as currentUserActions from 'state/actions/currentUserActions';
import * as feedFilters from 'constants/feedFilters';
import {
  FETCH_STEEM_GLOBAL_PROPERTIES,
  FETCH_STEEM_RATE,
  FETCH_NETWORK_CONNECTION,
  SET_TRANSLATIONS,
  APP_ONBOARDING,
  FETCH_CRYPTO_PRICE_HISTORY,
  FETCH_REWARD_FUND,
} from 'state/actions/actionTypes';
import {
  AUTH_EXPIRATION,
  AUTH_MAX_EXPIRATION_AGE,
  AUTH_USERNAME,
  STEEM_ACCESS_TOKEN,
} from 'constants/asyncStorageKeys';
import sc2 from 'api/sc2';
import * as settingsSaga from './settingsSaga';

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

const authenticateUser = function*() {
  const accessToken = yield call(AsyncStorage.getItem, STEEM_ACCESS_TOKEN);
  const username = yield call(AsyncStorage.getItem, AUTH_USERNAME);
  const expiresIn = yield call(AsyncStorage.getItem, AUTH_EXPIRATION);
  const maxAge = yield call(AsyncStorage.getItem, AUTH_MAX_EXPIRATION_AGE);
  const isAuthenticated = accessToken && expiresIn && !_.isEmpty(username);

  if (isAuthenticated) {
    sc2.setAccessToken(accessToken);
    yield put(authActions.authenticateUser.action({ accessToken, expiresIn, username, maxAge }));
  }
};

const fetchRewardFund = function*() {
  try {
    const response = yield call(API.getRewardFund);
    if (response.error) {
      yield put(appActions.fetchRewardFund.fail(response.error));
    } else {
      yield put(appActions.fetchRewardFund.success(response.result));
    }
  } catch (error) {
    yield put(appActions.fetchRewardFund.fail(error));
  } finally {
    yield put(appActions.fetchRewardFund.loadingEnd());
  }
};

const appOnboarding = function*() {
  try {
    // authenticate
    yield call(authenticateUser);

    // home screen onboarding
    yield all([
      call(fetchRewardFund),
      call(settingsSaga.fetchUserSettings),
      call(fetchSteemRate),
      call(fetchGlobalSteemProperties),
      put(homeActions.fetchDiscussions(feedFilters.TRENDING)),
      put(currentUserActions.currentUserFeedFetch.action()),
      put(currentUserActions.currentUserReblogListFetch.action()),
      put(homeActions.fetchTags()),
    ]);

    yield call(firebaseSaga.fetchSavedTags);
    yield put(
      currentUserActions.currentUserBSteemFeedFetch.action({
        filter: feedFilters.TRENDING,
      }),
    );

    yield put(appActions.appOnboarding.success());
  } catch (error) {
    yield put(appActions.appOnboarding.fail(error));
  } finally {
    yield put(appActions.appOnboarding.loadingEnd());
  }
};

const fetchCryptoPriceHistory = function*(action) {
  try {
    const { symbol } = action.payload;
    const usdPriceHistory = yield call(API.getCryptoPriceHistory, symbol, 'USD', 6);
    const btcPriceHistory = yield call(API.getCryptoPriceHistory, symbol, 'BTC', 6);
    const payload = {
      usdPriceHistory,
      btcPriceHistory,
      symbol,
    };
    yield put(appActions.fetchCryptoPriceHistory.success(payload));
  } catch (error) {
    yield put(appActions.fetchCryptoPriceHistory.fail(error));
  } finally {
    yield put(appActions.fetchCryptoPriceHistory.loadingEnd());
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

export const watchAppOnboarding = function*() {
  yield takeLatest(APP_ONBOARDING.ACTION, appOnboarding);
};

export const watchFetchCryptoPriceHistory = function*() {
  yield takeEvery(FETCH_CRYPTO_PRICE_HISTORY.ACTION, fetchCryptoPriceHistory);
};

export const watchFetchRewardFund = function*() {
  yield takeLatest(FETCH_REWARD_FUND.ACTION, fetchRewardFund);
};
