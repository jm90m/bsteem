import { FETCH_USER } from 'state/actions/actionTypes';
import API from 'api/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchUserFail, fetchUserSuccess } from 'state/actions/usersActions';

const fetchUser = function*(action) {
  try {
    const { username } = action.payload;
    const result = yield call(API.getAccount, username);
    yield put(fetchUserSuccess(result));
  } catch (error) {
    yield put(fetchUserFail(errror));
  }
};

export const watchFetchUser = function*() {
  yield takeLatest(FETCH_USER.PENDING, fetchUser);
};
