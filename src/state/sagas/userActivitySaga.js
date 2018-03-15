import _ from 'lodash';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import API from 'api/api';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
  FETCH_USER_TRANSFER_HISTORY,
} from 'state/actions/actionTypes';
import { isWalletTransaction } from 'util/apiUtils';
import { getUsersAccountHistory } from 'state/rootReducer';
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

const parseUserTransferActions = userTransferActions =>
  _.map(userTransferActions, action => {
    const actionCount = action[0];
    const actionDetails = {
      ...action[1],
      actionCount,
    };
    return actionDetails;
  }).reverse();

const fetchUserAccountHistory = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getAccountHistory, username);

    if (result.error) {
      yield put(userActivityActions.fetchUserAccountHistory.fail(result.error));
    } else {
      const parsedUserActions = getParsedUserActions(result.result);

      const payload = {
        username,
        userWalletTransactions: parsedUserActions.userWalletTransactions,
        userAccountHistory: parsedUserActions.userAccountHistory,
      };

      yield put(userActivityActions.fetchUserAccountHistory.success(payload));
    }
  } catch (error) {
    console.log('fetch-user-account-history-error', action.payload.username, error);
    yield put(userActivityActions.fetchUserAccountHistory.fail(error));
  } finally {
    yield put(userActivityActions.fetchUserAccountHistory.loadingEnd());
  }
};

const fetchMoreUserAccountHistory = function*(action) {
  try {
    const { username } = action.payload;
    const usersAccountHistory = yield select(getUsersAccountHistory);
    const currentUserAccountHistory = _.get(usersAccountHistory, username, []);
    const lastUserAction = _.last(usersAccountHistory);
    const lastUserActionCount = lastUserAction.actionCount;
    const lastUserActionIndex = _.findIndex(
      currentUserAccountHistory,
      userAction => userAction.actionCount === lastUserActionCount,
    );
    const moreActions = currentUserAccountHistory.slice(
      lastUserActionIndex + 1,
      lastUserActionIndex + 1 + API.DEFAULT_ACCOUNT_LIMIT,
    );
    const lastMoreAction = _.last(moreActions);
    const lastMoreActionCount = _.isEmpty(lastMoreAction) ? 0 : lastMoreAction.actionCount;

    if (lastMoreActionCount !== 0) {
      const lastActionCount = lastUserActionCount;
      const limit =
        lastActionCount < API.DEFAULT_ACCOUNT_LIMIT ? lastActionCount : API.DEFAULT_ACCOUNT_LIMIT;
      const result = yield call(API.getAccountHistory, lastActionCount, limit);
      const parsedUserActions = getParsedUserActions(result.result);
      const payload = {
        username,
        userWalletTransactions: parsedUserActions.userWalletTransactions,
        userAccountHistory: parsedUserActions.userAccountHistory,
      };
      yield put(userActivityActions.fetchMoreUserAccountHistory.success(payload));
    }
  } catch (error) {
    yield put(userActivityActions.fetchMoreUserAccountHistory.fail(error));
  } finally {
    yield put(userActivityActions.fetchUserAccountHistory.loadingEnd());
  }
};

const fetchUserTransferHistory = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getTransferHistory, username);
    if (result.error) {
      yield put(userActivityActions.fetchUserTransferHistory.fail(result.error));
    } else {
      const transferHistoryKey = `result.accounts.${username}.transfer_history`;
      const userTransferHistory = parseUserTransferActions(_.get(result, transferHistoryKey, []));
      const payload = {
        username,
        userTransferHistory,
      };
      yield put(userActivityActions.fetchUserTransferHistory.success(payload));
    }
  } catch (error) {
    yield put(userActivityActions.fetchUserTransferHistory.fail(error));
  } finally {
    yield put(userActivityActions.fetchUserTransferHistory.loadingEnd());
  }
};

export const watchFetchUserAccountHistory = function*() {
  yield takeLatest(FETCH_USER_ACCOUNT_HISTORY.ACTION, fetchUserAccountHistory);
};

export const watchFetchMoreUserAccountHistory = function*() {
  yield takeLatest(FETCH_MORE_USER_ACCOUNT_HISTORY.ACTION, fetchMoreUserAccountHistory);
};

export const watchFetchUserTransferHistory = function*() {
  yield takeLatest(FETCH_USER_TRANSFER_HISTORY.ACTION, fetchUserTransferHistory);
};
