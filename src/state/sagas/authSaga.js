import { takeLatest, call, put } from 'redux-saga/effects';
import { AUTHENTICATE_USER } from '../actions/actionTypes';
import * as authActions from 'state/actions/authActions';
import * as currentUserActions from 'state/actions/currentUserActions';

const authenticateUser = function*(action) {
  try {
    const { accessToken, expiresIn, username, maxAge } = action.payload;
    const payload = {
      accessToken,
      expiresIn,
      username,
      maxAge,
    };
    yield put(authActions.authenticateUser.success(payload));
    yield put(currentUserActions.currentUserFollowListFetch.action());
  } catch (error) {
    yield put(authActions.authenticateUser.fail(error));
  }
};

export const watchAuthenticateUser = function*() {
  yield takeLatest(AUTHENTICATE_USER.ACTION, authenticateUser);
};

export default null;
