import { spawn, all } from 'redux-saga/effects';
import * as homeSaga from './sagas/homeSaga';
import * as postSaga from './sagas/postSaga';
import * as usersSaga from './sagas/usersSaga';

const rootSaga = function*() {
  yield all([
    // Home Sagas
    spawn(homeSaga.watchFetchDiscussions),
    spawn(homeSaga.watchFetchMoreDiscussions),
    spawn(homeSaga.watchFetchTags),

    // Post Sagas
    spawn(postSaga.watchFetchComments),

    // User Sagas
    spawn(usersSaga.watchFetchUser),
  ]);
};

export default rootSaga;
