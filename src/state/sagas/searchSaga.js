import { SEARCH_ASK_STEEM } from 'state/actions/actionTypes';
import { takeLatest } from 'redux-saga/effects';
import API from 'api/api';

const fetchAskSteemSearchResults = function*(action) {
  try {
    const query = action.payload;
  } catch (error) {

  }
};

export const watchSearchAskSteem = function*() {
  yield takeLatest(SEARCH_ASK_STEEM.ACTION, fetchAskSteemSearchResults);
};
