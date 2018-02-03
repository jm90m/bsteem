import { takeLatest, call, put } from 'redux-saga/effects';
import { FETCH_COMMENTS } from '../actions/actionTypes';
import API from '../../api/api';
import { fetchCommentsSuccess, fetchCommentsFail } from '../actions/postActions';

const fetchComments = function*(action) {
  try {
    const { category, author, permlink, postId } = action.payload;
    const postUrl = `/${category}/@${author}/${permlink}`;
    const response = yield call(API.getComments, postUrl);
    if (response.error) {
      yield put(fetchCommentsFail(response.error));
    } else {
      const { result } = response;
      const { content } = result;
      yield put(fetchCommentsSuccess(content, postId));
    }
  } catch (error) {
    yield put(fetchCommentsFail(error));
  } finally {
    yield put({ type: FETCH_COMMENTS.LOADING_END });
  }
};

export const watchFetchComments = function*() {
  yield takeLatest(FETCH_COMMENTS.PENDING, fetchComments);
};

export default null;
