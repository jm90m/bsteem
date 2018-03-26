import _ from 'lodash';
import { takeLatest, all, call, put, select, takeEvery } from 'redux-saga/effects';
import API from 'api/api';
import CryptoJS from 'crypto-js';
import {
  getFirebaseValueOnce,
  getUserAllPrivateMessagesRef,
  getUsersMessagesRef,
  setFirebaseData,
  getSendUserMessagesRef,
  getUserDisplayedPrivateMessagesRef,
  getUserBlockedUsersRef,
  getBlockedUserRef,
} from 'util/firebaseUtils';
import {
  FETCH_CURRENT_MESSAGES,
  FETCH_DISPLAYED_MESSAGES,
  SEARCH_USER_MESSAGES,
  SEND_MESSAGE,
  FETCH_BLOCKED_USERS,
  BLOCK_USER,
  UNBLOCK_USER,
  HIDE_DISPLAYED_USER_MESSAGE,
} from '../actions/actionTypes';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';
import { encryptionSecretKey } from '../../constants/config';

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

export const hideDisplayedUserMessage = function*(action) {
  try {
    const { username } = action.payload;
    const authUsername = yield select(getAuthUsername);
    yield call(setFirebaseData, getUserDisplayedPrivateMessagesRef(authUsername, username), null);
    yield put(firebaseActions.hideDisplayedUserMessage.success());
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.hideDisplayedUserMessage.fail({ error }));
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
    const encryptedText = CryptoJS.AES.encrypt(text, encryptionSecretKey).toString();
    const messageData = {
      text: encryptedText,
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

export const fetchBlockedUsers = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    const snapshot = yield call(
      getFirebaseValueOnce,
      getUserBlockedUsersRef(authUsername),
      'value',
    );
    const blockedUsers = snapshot.val() || {};
    yield put(firebaseActions.fetchBlockedUsers.success(blockedUsers));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchBlockedUsers.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchBlockedUsers.loadingEnd());
  }
};

const blockUser = function*(action) {
  try {
    const { username } = action.payload;
    const authUsername = yield select(getAuthUsername);
    yield call(setFirebaseData, getBlockedUserRef(authUsername, username), true);
    yield call(fetchBlockedUsers);
    yield put(firebaseActions.blockUser.success(username));
  } catch (error) {
    yield put(firebaseActions.blockUser.fail(error));
  }
};

const unblockUser = function*(action) {
  try {
    const { username } = action.payload;
    const authUsername = yield select(getAuthUsername);
    yield call(setFirebaseData, getBlockedUserRef(authUsername, username), null);
    yield call(fetchBlockedUsers);
    yield put(firebaseActions.unblockUser.success(username));
  } catch (error) {
    yield put(firebaseActions.unblockUser.fail(error));
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

export const watchFetchBlockedUsers = function*() {
  yield takeLatest(FETCH_BLOCKED_USERS.ACTION, fetchBlockedUsers);
};

export const watchBlockUser = function*() {
  yield takeEvery(BLOCK_USER.ACTION, blockUser);
};

export const watchUnblockUser = function*() {
  yield takeEvery(UNBLOCK_USER.ACTION, unblockUser);
};

export const watchHideDisplayedUserMessage = function*() {
  yield takeEvery(HIDE_DISPLAYED_USER_MESSAGE.ACTION, hideDisplayedUserMessage);
};
