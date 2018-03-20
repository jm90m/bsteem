import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import _ from 'lodash';
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
  SAVE_DRAFT,
  DELETE_DRAFT,
  FETCH_DRAFTS,
} from 'state/actions/actionTypes';
import {
  getUserSavedTagsRef,
  getSaveTagRef,
  getUserSavedPostsRef,
  getSavePostRef,
  getUserSavedUsersRef,
  getSaveUserRef,
  getFirebaseValueOnce,
  setFirebaseData,
  getUserPostDraftsRef,
  getSavedDraftRef,
} from 'util/firebaseUtils';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';

export const fetchSavedTags = function*() {
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

const fetchDrafts = function*() {
  try {
    const authUsername = yield select(getAuthUsername);
    let userID;
    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    const snapshot = yield call(getFirebaseValueOnce, getUserPostDraftsRef(userID), 'value');
    const drafts = snapshot.val() || {};
    yield put(firebaseActions.fetchDrafts.success(drafts));
  } catch (error) {
    console.log(error);
    yield put(firebaseActions.fetchDrafts.fail({ error }));
  } finally {
    yield put(firebaseActions.fetchDrafts.loadingEnd());
  }
};

const saveDraft = function*(action) {
  try {
    const { postData, draftID, successCallback } = action.payload;
    const authUsername = yield select(getAuthUsername);

    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }

    yield call(setFirebaseData, getSavedDraftRef(userID, draftID), postData);
    yield call(fetchDrafts);
    successCallback();
    yield put(firebaseActions.saveDraft.success());
  } catch (error) {
    console.log(error);
    const { draftID } = action.payload;
    yield put(firebaseActions.saveDraft.fail({ error }, draftID));
  } finally {
    const { id } = action.payload;
    yield put(firebaseActions.saveDraft.loadingEnd(id));
  }
};

const deleteDraft = function*(action) {
  try {
    const { draftID } = action.payload;
    const authUsername = yield select(getAuthUsername);

    let userID;

    if (_.isEmpty(authUsername)) {
      userID = Expo.Constants.deviceId;
    } else {
      userID = authUsername;
    }
    yield call(setFirebaseData, getSavedDraftRef(userID, draftID), null);
    yield put(firebaseActions.deleteDraft.success(draftID));
    yield call(fetchDrafts);
  } catch (error) {
    console.log(error);
    const { draftID } = action.payload;
    yield put(firebaseActions.deleteDraft.fail({ error }, draftID));
  } finally {
    const { id } = action.payload;
    yield put(firebaseActions.deleteDraft.loadingEnd(id));
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

export const watchSaveDraft = function*() {
  yield takeEvery(SAVE_DRAFT.ACTION, saveDraft);
};
export const watchDeleteDraft = function*() {
  yield takeEvery(DELETE_DRAFT.ACTION, deleteDraft);
};
export const watchFetchDrafts = function*() {
  yield takeLatest(FETCH_DRAFTS.ACTION, fetchDrafts);
};
