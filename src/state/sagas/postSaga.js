import { FETCH_COMMENTS } from '../actions/actionTypes';
import API from '../../api/api';
import { takeLatest, call, put } from 'redux-saga/effects';
import { fetchCommentsSuccess, fetchCommentsFail } from '../actions/postActions';

/**
 * Fetches comments from blockchain.
 * @param {number} postId Id of post to fetch comments from
 * @param {boolean} reload If set to true isFetching won't be set to true
 * preventing loading icon to be dispalyed
 * @param {object} focusedComment Object with author and permlink to which focus after loading
 */

const getRootCommentsList = apiRes =>
  Object.keys(apiRes.content)
    .filter(commentKey => apiRes.content[commentKey].depth === 1)
    .map(commentKey => apiRes.content[commentKey].id);

const getCommentsChildrenLists = apiRes => {
  const listsById = {};
  Object.keys(apiRes.content).forEach(commentKey => {
    listsById[apiRes.content[commentKey].id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].id,
    );
  });

  return listsById;
};

const fetchComments = function*(action) {
  try {
    const { category, author, permlink, postId } = action.payload;
    const postUrl = `/${category}/@${author}/${permlink}`;
    const result = yield call(API.getComments, postUrl);
    const rootsCommentsList = getRootCommentsList(result);
    const commentsChildrenList = getCommentsChildrenLists(result);
    const content = result.content;
    yield put(fetchCommentsSuccess(rootsCommentsList, commentsChildrenList, content, postId));
  } catch (error) {
    console.log(error);
    yield put(fetchCommentsFail(error));
  }
};

export const watchFetchComments = function*() {
  yield takeLatest(FETCH_COMMENTS.PENDING, fetchComments);
};
