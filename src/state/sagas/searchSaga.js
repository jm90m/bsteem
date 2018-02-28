import _ from 'lodash';
import {
  SEARCH_ASK_STEEM,
  SEARCH_FETCH_USERS,
  SEARCH_FETCH_POST_DETAILS,
  SEARCH_FETCH_TAGS,
} from 'state/actions/actionTypes';
import { getAllTrendingTags } from 'state/rootReducer';
import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import * as searchActions from 'state/actions/searchActions';
import API from 'api/api';

// todo split up search into 3 sections, posts, users, tags

const fetchAskSteemSearchResults = function*(action) {
  try {
    const search = action.payload;
    const askSteemResults = yield all([
      call(API.getAskSteemSearch, search, 1),
      call(API.getAskSteemSearch, search, 2),
      call(API.getAskSteemSearch, search, 3),
      call(API.getAskSteemSearch, search, 4),
      call(API.getAskSteemSearch, search, 5),
    ]);
    const steemAccountLookupResults = yield call(API.getAccountReputation, search);

    let mergedResults = [];
    _.each(askSteemResults, element => {
      mergedResults = _.concat(mergedResults, element.results);
    });
    const sortedAskSteemResults = _.reverse(_.sortBy(mergedResults, ['type', 'created']));
    const formattedSteemAccountReputationResults = _.map(
      steemAccountLookupResults.result,
      user => user.account,
    );
    const payload = {
      askSteemResults: sortedAskSteemResults,
      steemAccountLookupResults: formattedSteemAccountReputationResults,
    };

    yield put(searchActions.searchAskSteem.success(payload));
  } catch (error) {
    console.log(error);
    yield put(searchActions.searchAskSteem.fail(error));
  }
};

const fetchUsersSearchResults = function*(action) {
  try {
    const search = action.payload;
    const response = yield call(API.getAccountReputation, search);
    yield put(searchActions.searchFetchUsers.success(response.result));
  } catch (error) {
    yield put(searchActions.searchFetchUsers.fail(error));
  } finally {
    yield put(searchActions.searchFetchUsers.loadingEnd());
  }
};

const fetchTagsSearchResults = function*(action) {
  try {
    const search = action.payload;
    const allTrendingTags = yield select(getAllTrendingTags);

    if (_.isEmpty(allTrendingTags)) {
      const tagsLimit = 500;
      const trendingTags = yield call(API.getTags, tagsLimit);
      const matchingTags = _.filter(trendingTags.result, tag => _.includes(tag.name, search));
      yield put(searchActions.setTrendingTags(trendingTags.result));
      yield put(searchActions.searchFetchTags.success(matchingTags));
    } else {
      const matchingTags = _.filter(allTrendingTags, tag => _.includes(tag.name, search));
      yield put(searchActions.searchFetchTags.success(matchingTags));
    }
  } catch (error) {
    yield put(searchActions.searchFetchTags.fail(error));
  } finally {
    yield put(searchActions.searchFetchTags.loadingEnd());
  }
};

export const watchSearchAskSteem = function*() {
  yield takeLatest(SEARCH_ASK_STEEM.ACTION, fetchAskSteemSearchResults);
};

export const watchFetchUsersSearchResults = function*() {
  yield takeLatest(SEARCH_FETCH_USERS.ACTION, fetchUsersSearchResults);
};

export const watchFetchTagsSearchResults = function*() {
  yield takeLatest(SEARCH_FETCH_TAGS.ACTION, fetchTagsSearchResults);
};
