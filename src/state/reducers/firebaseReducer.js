import _ from 'lodash';
import { FETCH_SAVED_TAGS, SAVE_TAG, SAVE_POST, FETCH_SAVED_POSTS } from '../actions/actionTypes';

const INITIAL_STATE = {
  savedTags: [],
  pendingSavingTags: [],
  pendingSavingPosts: [],
  savedPosts: [],
  loadingSavedTags: false,
  loadingSavedPosts: false,
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
      console.log(action.payload, savedTags);
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
        pendingSavingPosts: _.remove(state.pendingSavingPosts, postID => postID !== action.payload),
      };
    case FETCH_SAVED_POSTS.ACTION:
      return {
        ...state,
        loadingSavedPosts: true,
      };
    case FETCH_SAVED_POSTS.SUCCESS: {
      const savedPosts = _.map(action.payload, post => post);
      console.log(action.payload, savedPosts);
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
    default:
      return state;
  }
};

export const getLoadingSavedTags = state => state.loadingSavedTags;
export const getPendingSavingTags = state => state.pendingSavingTags;
export const getSavedTags = state => state.savedTags;
export const getPendingSavingPosts = state => state.pendingSavingPosts;
export const getSavedPosts = state => state.savedPosts;
