import { createAsyncSagaAction } from 'util/reduxUtils';
import {
  FETCH_SAVED_TAGS,
  SAVE_TAG,
  UNSAVE_TAG,
  SAVE_POST,
  UNSAVE_POST,
  FETCH_SAVED_POSTS,
  FETCH_SAVED_USERS,
  SAVE_USER,
  UNSAVE_USER,
  SAVE_DRAFT,
  DELETE_DRAFT,
  FETCH_DRAFTS,
  FETCH_DISPLAYED_MESSAGES,
  SEARCH_USER_MESSAGES,
  SEND_MESSAGE,
  FETCH_CURRENT_MESSAGES,
  FETCH_BLOCKED_USERS,
  BLOCK_USER,
  UNBLOCK_USER,
  HIDE_DISPLAYED_USER_MESSAGE,
} from './actionTypes';

export const fetchSavedTags = createAsyncSagaAction(FETCH_SAVED_TAGS);
export const saveTag = createAsyncSagaAction(SAVE_TAG);
export const unsaveTag = createAsyncSagaAction(UNSAVE_TAG);
export const fetchSavedPosts = createAsyncSagaAction(FETCH_SAVED_POSTS);
export const savePost = createAsyncSagaAction(SAVE_POST);
export const unsavePost = createAsyncSagaAction(UNSAVE_POST);
export const fetchSavedUsers = createAsyncSagaAction(FETCH_SAVED_USERS);
export const saveUser = createAsyncSagaAction(SAVE_USER);
export const unsaveUser = createAsyncSagaAction(UNSAVE_USER);
export const saveDraft = createAsyncSagaAction(SAVE_DRAFT);
export const deleteDraft = createAsyncSagaAction(DELETE_DRAFT);
export const fetchDrafts = createAsyncSagaAction(FETCH_DRAFTS);
export const fetchDisplayedMessages = createAsyncSagaAction(FETCH_DISPLAYED_MESSAGES);
export const searchUserMessages = createAsyncSagaAction(SEARCH_USER_MESSAGES);
export const sendMessage = createAsyncSagaAction(SEND_MESSAGE);
export const fetchCurrentMessages = createAsyncSagaAction(FETCH_CURRENT_MESSAGES);
export const fetchBlockedUsers = createAsyncSagaAction(FETCH_BLOCKED_USERS);
export const blockUser = createAsyncSagaAction(BLOCK_USER);
export const unblockUser = createAsyncSagaAction(UNBLOCK_USER);
export const hideDisplayedUserMessage = createAsyncSagaAction(HIDE_DISPLAYED_USER_MESSAGE);
