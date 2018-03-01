import _ from 'lodash';
import {
  SEARCH_FETCH_USERS,
  SEARCH_FETCH_POSTS,
  SEARCH_FETCH_TAGS,
} from 'state/actions/actionTypes';
import { getAllTrendingTags } from 'state/rootReducer';
import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import * as searchActions from 'state/actions/searchActions';
import API from 'api/api';

const fetchPostsSearchResults = function*(action) {
  try {
    const search = action.payload;
    const askSteemResults = yield all([
      call(API.getAskSteemSearch, search, 1),
      call(API.getAskSteemSearch, search, 2),
      call(API.getAskSteemSearch, search, 3),
      call(API.getAskSteemSearch, search, 4),
      call(API.getAskSteemSearch, search, 5),
    ]);

    let mergedResults = [];
    _.each(askSteemResults, element => {
      mergedResults = _.concat(mergedResults, element.results);
    });
    const sortedAskSteemResults = _.reverse(_.sortBy(mergedResults, ['type', 'created']));

    yield put(searchActions.searchFetchPosts.success(sortedAskSteemResults));
  } catch (error) {
    console.log(error);
    yield put(searchActions.searchFetchPosts.fail(error));
  }
};

const fetchUsersSearchResults = function*(action) {
  try {
    const search = action.payload;
    const response = yield call(API.getAccountReputation, search);
    const usersResult = _.map(response.result, user => ({
      ...user,
      type: 'user',
      name: user.account,
    }));
    console.log(usersResult, response);
    yield put(searchActions.searchFetchUsers.success(usersResult));
  } catch (error) {
    console.log(error);
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
      const matchingTags = _.map(
        _.filter(trendingTags.result, tag => _.includes(tag.name, search)),
        tag => ({ ...tag, type: 'tag' }),
      );
      yield put(searchActions.setTrendingTags(trendingTags.result));
      yield put(searchActions.searchFetchTags.success(matchingTags));
    } else {
      const matchingTags = _.map(
        _.filter(allTrendingTags, tag => _.includes(tag.name, search)),
        tag => ({ ...tag, type: 'tag' }),
      );
      console.log(matchingTags);
      yield put(searchActions.searchFetchTags.success(matchingTags));
    }
  } catch (error) {
    console.log(error);
    yield put(searchActions.searchFetchTags.fail(error));
  } finally {
    yield put(searchActions.searchFetchTags.loadingEnd());
  }
};

export const watchFetchPostsSearchResults = function*() {
  yield takeLatest(SEARCH_FETCH_POSTS.ACTION, fetchPostsSearchResults);
};

export const watchFetchUsersSearchResults = function*() {
  yield takeLatest(SEARCH_FETCH_USERS.ACTION, fetchUsersSearchResults);
};

export const watchFetchTagsSearchResults = function*() {
  yield takeLatest(SEARCH_FETCH_TAGS.ACTION, fetchTagsSearchResults);
};
