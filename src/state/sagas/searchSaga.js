import _ from 'lodash';
import { SEARCH_ASK_STEEM } from 'state/actions/actionTypes';
import { takeLatest, call, all, put } from 'redux-saga/effects';
import { searchAskSteem, searchFetchPostDetails } from 'state/actions/searchActions';
import API from 'api/api';
import { SEARCH_FETCH_POST_DETAILS } from '../actions/actionTypes';

const fetchAskSteemSearchResults = function*(action) {
  try {
    const search = action.payload;
    const result = yield all([
      call(API.getAskSteemSearch, search, 1),
      call(API.getAskSteemSearch, search, 2),
      call(API.getAskSteemSearch, search, 3),
      call(API.getAskSteemSearch, search, 4),
      call(API.getAskSteemSearch, search, 5),
      call(API.getAskSteemSearch, search, 6),
      call(API.getAskSteemSearch, search, 7),
      call(API.getAskSteemSearch, search, 8),
      call(API.getAskSteemSearch, search, 9),
      call(API.getAskSteemSearch, search, 10),
    ]);

    let mergedResults = [];
    _.each(result, element => {
      mergedResults = _.concat(mergedResults, element.results);
    });
    const sortedResults = _.reverse(_.sortBy(mergedResults, ['type', 'created']));
    console.log('SORTED', sortedResults);
    yield put(searchAskSteem.success(sortedResults));
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
