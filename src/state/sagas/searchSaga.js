import { SEARCH_ASK_STEEM } from 'state/actions/actionTypes';
import { takeLatest, call, put } from 'redux-saga/effects';
import { searchAskSteem, searchFetchPostDetails } from 'state/actions/searchActions';
import API from 'api/api';
import { SEARCH_FETCH_POST_DETAILS } from '../actions/actionTypes';

const fetchAskSteemSearchResults = function*(action) {
  try {
    const search = action.payload;
    const result = yield call(API.getAskSteemSearch, search);
    yield put(searchAskSteem.success(result));
  } catch (error) {
    yield put(searchAskSteem.fail(error));
  }
};

const fetchSearchPostDetails = function*(action) {
  try {
    const { author, permlink } = action.payload;
    const result = yield call(API.getContent, author, permlink);
    yield put(searchFetchPostDetails.success(result));
  } catch (error) {
    yield put(searchFetchPostDetails.fail(error));
  }
};

export const watchSearchAskSteem = function*() {
  yield takeLatest(SEARCH_ASK_STEEM.ACTION, fetchAskSteemSearchResults);
};

export const watchSearchFetchPostDetails = function*() {
  yield takeLatest(SEARCH_FETCH_POST_DETAILS.ACTION, fetchSearchPostDetails);
};

export default null;
