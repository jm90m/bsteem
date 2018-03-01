import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import _ from 'lodash';
import firebase from 'firebase';
import Expo from 'expo';
import {
  FETCH_SAVED_TAGS,
  SAVE_TAG,
  UNSAVE_TAG,
  FETCH_SAVED_POSTS,
  SAVE_POST,
  UNSAVE_POST,
  FETCH_SAVED_USERS,
  SAVE_USER,
  UNSAVE_USER,
} from 'state/actions/actionTypes';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';

const baseUserSettingsRef = 'user-settings';
const getUserSavedTagsRef = username => `${baseUserSettingsRef}/${username}/saved-tags`;
const getSaveTagRef = (username, tag) => `${getUserSavedTagsRef(username)}/${tag}`;

const getUserSavedPostsRef = username => `${baseUserSettingsRef}/${username}/saved-posts`;
const getSavePostRef = (username, postID) => `${getUserSavedPostsRef(username)}/${postID}`;

const getUserSavedUsersRef = username => `${baseUserSettingsRef}/${username}/saved-users`;
const getSaveUserRef = (username, saveUser) => `${getUserSavedUsersRef(username)}/${saveUser}`;

const getFirebaseValueOnce = (ref, key) =>
  firebase
    .database()
    .ref(ref)
    .once(key);

const setFirebaseData = (ref, values = {}) => {
  firebase
    .database()
    .ref(ref)
    .set(values);
};

const fetchSavedTags = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserSavedTagsRef(userID), 'value');
    const savedTags = snapshot.val() || {};
    yield put(firebaseActions.fetchSavedTags.success(savedTags));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchSavedTags.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchSavedTags.loadingEnd());
  }
};

const saveTag = function*(action) {
  try {
    const { tag } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSaveTagRef(userID, tag), true);
    yield call(fetchSavedTags);
    yield put(firebaseActions.saveTag.success(tag));
  } catch (error) {
    console.log(error);
    const { tag } = action.payload;
    yield put(firebaseActions.saveTag.fail({ error }, tag));
  } finally {
    const { tag } = action.payload;
    yield put(firebaseActions.saveTag.loadingEnd(tag));
  }
};

const unsaveTag = function*(action) {
  try {
    const { tag } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSaveTagRef(userID, tag), null);
    yield put(firebaseActions.unsaveTag.success(tag));
    yield call(fetchSavedTags);
  } catch (error) {
    console.log(error);
    const { tag } = action.payload;
    yield put(firebaseActions.unsaveTag.fail({ error }, tag));
  } finally {
    const { tag } = action.payload;
    yield put(firebaseActions.unsaveTag.loadingEnd(tag));
  }
};

const fetchSavedPosts = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserSavedPostsRef(userID), 'value');
    const savedPosts = snapshot.val() || {};
    yield put(firebaseActions.fetchSavedPosts.success(savedPosts));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchSavedPosts.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchSavedPosts.loadingEnd());
  }
};

const savePost = function*(action) {
  try {
    const { author, permlink, title, id, created } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const postData = { author, permlink, title, id, created };
    yield call(setFirebaseData, getSavePostRef(userID, id), postData);
    yield call(fetchSavedPosts);
    yield put(firebaseActions.savePost.success());
  } catch (error) {
    console.log(error);
    const { id } = action.payload;
    yield put(firebaseActions.savePost.fail({ error }, id));
  } finally {
    const { id } = action.payload;
    yield put(firebaseActions.savePost.loadingEnd(id));
  }
};

const unsavePost = function*(action) {
  try {
    const { id } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSavePostRef(userID, id), null);
    yield put(firebaseActions.unsavePost.success(id));
    yield call(fetchSavedPosts);
  } catch (error) {
    console.log(error);
    const { id } = action.payload;
    yield put(firebaseActions.unsavePost.fail({ error }, id));
  } finally {
    const { id } = action.payload;
    yield put(firebaseActions.unsavePost.loadingEnd(id));
  }
};

const fetchSavedUsers = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserSavedUsersRef(userID), 'value');
    const savedUsers = snapshot.val() || {};
    yield put(firebaseActions.fetchSavedUsers.success(savedUsers));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchSavedUsers.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchSavedUsers.loadingEnd());
  }
};

const saveUser = function*(action) {
  try {
    const { username } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSaveUserRef(userID, username), true);
    yield call(fetchSavedUsers);
    yield put(firebaseActions.saveUser.success(username));
  } catch (error) {
    console.log(error);
    const { username } = action.payload;
    yield put(firebaseActions.saveUser.fail({ error }, username));
  } finally {
    const { username } = action.payload;
    yield put(firebaseActions.saveUser.loadingEnd(username));
  }
};

const unsaveUser = function*(action) {
  try {
    const { username } = action.payload;
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSaveUserRef(userID, username), null);
    yield put(firebaseActions.unsaveUser.success(username));
    yield call(fetchSavedUsers);
  } catch (error) {
    console.log(error);
    const { username } = action.payload;
    yield put(firebaseActions.unsaveUser.fail({ error }, username));
  } finally {
    const { username } = action.payload;
    yield put(firebaseActions.unsaveUser.loadingEnd(username));
  }
};

export const watchFetchSavedTags = function*() {
  yield takeLatest(FETCH_SAVED_TAGS.ACTION, fetchSavedTags);
};

export const watchSaveTag = function*() {
  yield takeEvery(SAVE_TAG.ACTION, saveTag);
};

export const watchUnsaveTag = function*() {
  yield takeEvery(UNSAVE_TAG.ACTION, unsaveTag);
};

export const watchFetchSavedPosts = function*() {
  yield takeLatest(FETCH_SAVED_POSTS.ACTION, fetchSavedPosts);
};

export const watchSavePost = function*() {
  yield takeEvery(SAVE_POST.ACTION, savePost);
};

export const watchUnsavePost = function*() {
  yield takeEvery(UNSAVE_POST.ACTION, unsavePost);
};

export const watchFetchSavedUsers = function*() {
  yield takeLatest(FETCH_SAVED_USERS.ACTION, fetchSavedUsers);
};

export const watchSaveUser = function*() {
  yield takeEvery(SAVE_USER.ACTION, saveUser);
};

export const watchUnsaveUser = function*() {
  yield takeEvery(UNSAVE_USER.ACTION, unsaveUser);
};
