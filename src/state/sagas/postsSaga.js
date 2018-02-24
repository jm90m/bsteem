import { takeLatest, call, put } from 'redux-saga/effects';
import { FETCH_COMMENTS, FETCH_POST_DETAILS } from '../actions/actionTypes';
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

export const watchFetchComments = function*() {
  yield takeLatest(FETCH_COMMENTS.PENDING, fetchComments);
};

export const watchFetchPostDetails = function*() {
  yield takeLatest(FETCH_POST_DETAILS.ACTION, fetchPostDetails);
};

export default null;
