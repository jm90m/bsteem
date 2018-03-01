import _ from 'lodash';
import {
  FETCH_SAVED_TAGS,
  SAVE_TAG,
  SAVE_POST,
  FETCH_SAVED_POSTS,
  FETCH_SAVED_USERS,
  SAVE_USER,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  savedTags: [],
  savedPosts: [],
  savedUsers: [],
  pendingSavingTags: [],
  pendingSavingPosts: [],
  pendingSavingUsers: [],
  loadingSavedTags: false,
  loadingSavedPosts: false,
  loadingSavedUsers: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_SAVED_TAGS.ACTION:
      return {
        ...state,
        loadingSavedTags: true,
      };
    case FETCH_SAVED_TAGS.SUCCESS: {
      const savedTags = _.map(action.payload, (val, tag) => tag);
      return {
        ...state,
        savedTags,
        loadingSavedTags: false,
      };
    }
    case FETCH_SAVED_TAGS.LOADING_END:
    case FETCH_SAVED_TAGS.ERROR:
      return {
        ...state,
        loadingSavedTags: false,
      };

    case SAVE_TAG.ACTION:
      return {
        ...state,
        pendingSavingTags: [...state.pendingSavingTags, action.payload],
      };
    case SAVE_TAG.SUCCESS:
    case SAVE_TAG.LOADING_END:
    case SAVE_TAG.ERROR:
      return {
        ...state,
        pendingSavingTags: _.remove(state.pendingSavingTags, tag => tag !== action.payload),
      };

    case FETCH_SAVED_POSTS.ACTION:
      return {
        ...state,
        loadingSavedPosts: true,
      };
    case FETCH_SAVED_POSTS.SUCCESS: {
      const savedPosts = _.map(action.payload, post => post);
      return {
        ...state,
        savedPosts,
        loadingSavedPosts: false,
      };
    }
    case SAVE_POST.ACTION:
      return {
        ...state,
        pendingSavingPosts: [...state.pendingSavingPosts, action.payload.id],
      };
    case SAVE_POST.SUCCESS:
    case SAVE_POST.LOADING_END:
    case SAVE_POST.ERROR:
      return {
        ...state,
        pendingSavingPosts: _.remove(state.pendingSavingPosts, postID => postID !== action.payload),
      };

    case FETCH_SAVED_USERS.ACTION:
      return {
        ...state,
        loadingSavedUsers: true,
      };
    case FETCH_SAVED_USERS.SUCCESS: {
      const savedUsers = _.map(action.payload, (val, user) => user);
      return {
        ...state,
        savedUsers,
        loadingSavedUsers: false,
      };
    }
    case FETCH_SAVED_USERS.LOADING_END:
    case FETCH_SAVED_USERS.ERROR:
      return {
        ...state,
        loadingSavedUsers: false,
      };

    case SAVE_USER.ACTION:
      return {
        ...state,
        pendingSavingUsers: [...state.pendingSavingUsers, action.payload],
      };
    case SAVE_USER.SUCCESS:
    case SAVE_USER.LOADING_END:
    case SAVE_USER.ERROR:
      return {
        ...state,
        pendingSavingUsers: _.remove(
          state.pendingSavingUsers,
          user => user.username !== action.payload,
        ),
      };
    default:
      return state;
  }
};

export const getLoadingSavedTags = state => state.loadingSavedTags;
export const getLoadingSavedPosts = state => state.loadingSavedPosts;
export const getLoadingSavedUsers = state => state.loadingSavedUsers;
export const getPendingSavingTags = state => state.pendingSavingTags;
export const getPendingSavingPosts = state => state.pendingSavingPosts;
export const getPendingSavingUsers = state => state.pendingSavingUsers;
export const getSavedTags = state => state.savedTags;
export const getSavedPosts = state => state.savedPosts;
export const getSavedUsers = state => state.savedUsers;
