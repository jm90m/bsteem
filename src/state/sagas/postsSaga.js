import { takeLatest, call, put } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { SAVED_POSTS_OFFLINE, getSavedPostsKey } from 'constants/asyncStorageKeys';
import _ from 'lodash';
import {
  FETCH_COMMENTS,
  FETCH_POST_DETAILS,
  SAVE_POST_OFFLINE,
  FETCH_SAVED_OFFLINE_POSTS,
  UNSAVE_POST_OFFLINE,
} from '../actions/actionTypes';
import API from '../../api/api';
import * as postsActions from '../actions/postsActions';

const fetchComments = function*(action) {
  try {
    const { category, author, permlink, postId, isUpdating } = action.payload;
    const postUrl = `/${category}/@${author}/${permlink}`;
    const response = yield call(API.getComments, postUrl);

    if (response.error) {
      yield put(postsActions.fetchCommentsFail(response.error));
    } else {
      const { result } = response;
      const { content } = result;
      yield put(postsActions.fetchCommentsSuccess(content, postId, isUpdating));
    }
  } catch (error) {
    console.log(error);
    yield put(postsActions.fetchCommentsFail(error));
  } finally {
    yield put({ type: FETCH_COMMENTS.LOADING_END });
  }
};

const fetchPostDetails = function*(action) {
  try {
    const { author, permlink } = action.payload;
    const result = yield call(API.getContent, author, permlink);
    if (result.error) {
      yield put(postsActions.fetchPostDetails.fail());
    } else {
      yield put(postsActions.fetchPostDetails.success(result.result));
    }
  } catch (error) {
    yield put(postsActions.fetchPostDetails.fail(error));
  } finally {
    yield put(postsActions.fetchPostDetails.loadingEnd());
  }
};

const getOfflinePost = function*(postKey) {
  try {
    const postDataString = yield call(AsyncStorage.getItem, postKey);
    yield put(postsActions.addPostToSavedOffline(postDataString));
  } catch (error) {
    console.log(error);
  }
};

const fetchSavedOfflinePosts = function*() {
  try {
    const allStorageKeys = yield call(AsyncStorage.getAllKeys);
    console.log('ALL STORAGE KEYS', allStorageKeys);
    if (Array.isArray(allStorageKeys)) {
      for (let i = 0; i < allStorageKeys.length; i += 1) {
        const key = allStorageKeys[i];
        if (_.includes(key, SAVED_POSTS_OFFLINE)) {
          yield call(getOfflinePost, key);
        }
      }
    }
    yield put(postsActions.fetchSavedOfflinePosts.success());
  } catch (error) {
    yield put(postsActions.fetchSavedOfflinePosts.fail(error));
  }
};

const savePostOffline = function*(action) {
  try {
    const { postData } = action.payload;
    const postDataString = _.attempt(JSON.stringify, postData);

    if (_.isError(postDataString)) {
      yield put(postsActions.savePostOffline.fail(postData));
    } else {
      yield call(AsyncStorage.setItem, getSavedPostsKey(postData.id), postDataString);
      yield call(fetchSavedOfflinePosts);
      yield put(postsActions.savePostOffline.success({ postData }));
    }
  } catch (error) {
    console.log(error);
    yield put(postsActions.savePostOffline.fail(error, { postData: action.postData }));
  } finally {
    yield put(postsActions.savePostOffline.loadingEnd({ postData: action.postData }));
  }
};

const unsavePostOffline = function*(action) {
  try {
    const { postData } = action.payload;
    yield call(AsyncStorage.removeItem, getSavedPostsKey(postData.id));
    yield put(postsActions.removePostSavedOffline({ postData }));
    yield call(fetchSavedOfflinePosts);
    yield put(postsActions.unsavePostOffline.success({ postData }));
  } catch (error) {
    console.log(error);
    yield put(postsActions.unsavePostOffline.fail(error, { postData: action.postData }));
  } finally {
    yield put(postsActions.unsavePostOffline.loadingEnd({ postData: action.postData }));
  }
};

export const watchFetchComments = function*() {
  yield takeLatest(FETCH_COMMENTS.PENDING, fetchComments);
};

export const watchFetchPostDetails = function*() {
  yield takeLatest(FETCH_POST_DETAILS.ACTION, fetchPostDetails);
};

export const watchSavePostOffline = function*() {
  yield takeLatest(SAVE_POST_OFFLINE.ACTION, savePostOffline);
};

export const watchFetchSavedOfflinePosts = function*() {
  yield takeLatest(FETCH_SAVED_OFFLINE_POSTS.ACTION, fetchSavedOfflinePosts);
};

export const watchUnsavePostOffline = function*() {
  yield takeLatest(UNSAVE_POST_OFFLINE.ACTION, unsavePostOffline);
};
