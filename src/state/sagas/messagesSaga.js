import Expo from 'expo';
import _ from 'lodash';
import { takeLatest, all, call, put, select, takeEvery } from 'redux-saga/effects';
import API, { getAPIByFilter } from 'api/api';
import sc2 from 'api/sc2';
import {
  getFirebaseValueOnce,
  getUserRebloggedPostsRef,
  getRebloggedPostRef,
  setFirebaseData,
} from 'util/firebaseUtils';
import {
  getAuthUsername,
  getCurrentUserFeed,
  getCommentsByPostId,
  getSavedTags,
  getCurrentUserBSteemFeed,
} from '../rootReducer';
import {
  FETCH_CURRENT_USER_FEED,
  FETCH_MORE_CURRENT_USER_FEED,
  CURRENT_USER_VOTE_POST,
  CURRENT_USER_VOTE_COMMENT,
  CURRENT_USER_REBLOG_POST,
  CURRENT_USER_ONBOARDING,
  FETCH_CURRENT_USER_FOLLOW_LIST,
  CURRENT_USER_FOLLOW_USER,
  CURRENT_USER_UNFOLLOW_USER,
  FETCH_CURRENT_USER_REBLOG_LIST,
  FETCH_CURRENT_USER_BSTEEM_FEED,
  FETCH_MORE_CURRENT_USER_BSTEEM_FEED,
} from '../actions/actionTypes';
import * as currentUserActions from '../actions/currentUserActions';
import { refreshUserBlog } from '../actions/usersActions';

const fetchMessages = function*() {};
