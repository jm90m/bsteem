import _ from 'lodash';
import { takeLatest, all, call, put, select, takeEvery } from 'redux-saga/effects';
import API from 'api/api';
import {
  getFirebaseValueOnce,
  getUserAllPrivateMessagesRef,
  getUsersMessagesRef,
  setFirebaseData,
  getSendUserMessagesRef,
  getUserDisplayedPrivateMessagesRef,
} from 'util/firebaseUtils';
import {
  FETCH_CURRENT_MESSAGES,
  FETCH_DISPLAYED_MESSAGES,
  SEARCH_USER_MESSAGES,
  SEND_MESSAGE,
} from '../actions/actionTypes';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';

export const fetchDisplayedMessages = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    const snapshot = yield call(
      getFirebaseValueOnce,
      getUserAllPrivateMessagesRef(authUsername),
      'value',
    );
    const messages = snapshot.val() || {};
    yield put(firebaseActions.fetchDisplayedMessages.success(messages));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchDisplayedMessages.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchDisplayedMessages.loadingEnd());
  }
};

const searchUserMessages = function*(action) {
  try {
    const search = action.payload;
    const response = yield call(API.getAccountReputation, search, 5);
    const usersResult = _.map(response.result, user => ({
      ...user,
      type: 'user',
      toUser: user.account,
    }));
    console.log(usersResult, response);
    yield put(firebaseActions.searchUserMessages.success(usersResult));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.searchUserMessages.fail(error));
  } finally {
    yield put(firebaseActions.searchUserMessages.loadingEnd());
  }
};

const sendMessage = function*(action) {
  try {
    const { username, text, successCallback } = action.payload;
    const authUsername = yield select(getAuthUsername);
    const timestamp = new Date().getTime();
    const messageData = {
      text,
      username: authUsername,
      timestamp,
    };
    yield call(
      setFirebaseData,
      getSendUserMessagesRef(authUsername, username, timestamp),
      messageData,
    );
    successCallback();
    yield call(
      setFirebaseData,
      getUserDisplayedPrivateMessagesRef(authUsername, username),
      messageData,
    );
    yield call(
      setFirebaseData,
      getUserDisplayedPrivateMessagesRef(username, authUsername),
      messageData,
    );
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.sendMessage.fail(error));
  }
};

const fetchCurrentMessage = function*(action) {
  try {
    const { username, successCallback } = action.payload;
    const authUsername = yield select(getAuthUsername);
    const snapshot = yield call(
      getFirebaseValueOnce,
      getUsersMessagesRef(username, authUsername),
      'value',
    );
    const messages = snapshot.val() || {};
    yield put(
      firebaseActions.fetchCurrentMessages.success({
        username,
        messages,
      }),
    );
    if (successCallback) {
      _.attempt(successCallback);
    }
  } catch (error) {
    console.warn(error);
    yield put(firebaseActions.fetchCurrentMessages.fail());
  }
};

export const watchFetchDisplayedMessages = function*() {
  yield takeEvery(FETCH_DISPLAYED_MESSAGES.ACTION, fetchDisplayedMessages);
};

export const watchSearchUserMessages = function*() {
  yield takeLatest(SEARCH_USER_MESSAGES.ACTION, searchUserMessages);
};

export const watchSendMessage = function*() {
  yield takeLatest(SEND_MESSAGE.ACTION, sendMessage);
};

export const watchFetchCurrentMessage = function*() {
  yield takeLatest(FETCH_CURRENT_MESSAGES.ACTION, fetchCurrentMessage);
};
