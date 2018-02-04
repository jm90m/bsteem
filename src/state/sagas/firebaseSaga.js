import { takeLatest, takeEvery, call, put, select } from 'redux-saga/effects';
import firebase from 'firebase';
import { FETCH_SAVED_TAGS, SAVE_TAG, UNSAVE_TAG } from 'state/actions/actionTypes';
import * as firebaseActions from '../actions/firebaseActions';
import { getAuthUsername } from '../rootReducer';

const baseUserSettingsRef = 'user-settings';

const getUserSavedTagsRef = username => `${baseUserSettingsRef}/${username}/saved-tags`;

const getSaveTagRef = (username, tag) => `${getUserSavedTagsRef(username)}/${tag}`;

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
    const snapshot = yield call(getFirebaseValueOnce, getUserSavedTagsRef(authUsername), 'value');
    const savedTags = snapshot.val() || [];
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
    yield call(setFirebaseData, getSaveTagRef(authUsername, tag), true);
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
    yield call(setFirebaseData, getSaveTagRef(authUsername, tag), null);
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

export const watchFetchSavedTags = function*() {
  yield takeLatest(FETCH_SAVED_TAGS.ACTION, fetchSavedTags);
};

export const watchSaveTag = function*() {
  yield takeEvery(SAVE_TAG.ACTION, saveTag);
};

export const watchUnsaveTag = function*() {
  yield takeEvery(UNSAVE_TAG.ACTION, unsaveTag);
};

// function writeUserData(userId, name, email, imageUrl) {
//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }
