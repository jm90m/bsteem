import _ from 'lodash';
import { takeLatest, call, put } from 'redux-saga/effects';
import API from 'api/api';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
} from 'state/actions/actionTypes';
import { isWalletTransaction } from 'util/apiUtils';
import * as userActivityActions from 'state/actions/userActivityActions';

const getParsedUserActions = userActions => {
  const userWalletTransactions = [];
  const userAccountHistory = [];

  _.each(userActions.reverse(), action => {
    const actionCount = action[0];
    const actionDetails = {
      ...action[1],
      actionCount,
    };
    const actionType = actionDetails.op[0];

    if (isWalletTransaction(actionType)) {
      userWalletTransactions.push(actionDetails);
    }

    userAccountHistory.push(actionDetails);
  });

  return {
    userWalletTransactions,
    userAccountHistory,
  };
};

const fetchUserAccountHistory = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getAccountHistory, username);
    const parsedUserActions = getParsedUserActions(result);

    const payload = {
      username,
      userWalletTransactions: parsedUserActions.userWalletTransactions,
      userAccountHistory: parsedUserActions.userAccountHistory,
    };

    yield put(userActivityActions.fetchUserAccountHistory.success(payload));
  } catch (error) {
    console.log('fetch-user-account-history-error', action.payload.username, error);
    yield put(userActivityActions.fetchUserAccountHistory.fail(error));
  } finally {
    yield put(userActivityActions.fetchUserAccountHistory.loadingEnd());
  }
};

const fetchMoreUserAccountHistory = function*(action) {
  try {
  } catch (error) {
  } finally {
  }
};

export const watchFetchUserAccountHistory = function*() {
  yield takeLatest(FETCH_USER_ACCOUNT_HISTORY.ACTION, fetchUserAccountHistory);
};

export const watchFetchMoreUserAccountHistory = function*() {
  yield takeLatest(FETCH_MORE_USER_ACCOUNT_HISTORY.ACTION, fetchMoreUserAccountHistory);
};
