import { SEARCH_ASK_STEEM } from 'state/actions/actionTypes';
import { takeLatest, call, put } from 'redux-saga/effects';
import { searchAskSteem } from 'state/actions/searchActions';
import API from 'api/api';

const fetchAskSteemSearchResults = function*(action) {
  try {
    const search = action.payload;
    const result = yield call(API.getAskSteemSearch, search);
    yield put(searchAskSteem.success(result));
  } catch (error) {
    yield put(searchAskSteem.fail(error));
  }
};

export const watchSearchAskSteem = function*() {
  yield takeLatest(SEARCH_ASK_STEEM.ACTION, fetchAskSteemSearchResults);
};

export default null;
