import _ from 'lodash';
import { FETCH_SAVED_TAGS, SAVE_TAG } from '../actions/actionTypes';

const INITIAL_STATE = {
  savedTags: [],
  pendingSavingTags: [],
  loadingSaving: false,
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
        loadingSaving: true,
        pendingSavingTags: [...state.pendingSavingTags, action.payload],
      };
    case SAVE_TAG.SUCCESS:
    case SAVE_TAG.LOADING_END:
    case SAVE_TAG.ERROR:
      return {
        ...state,
        pendingSavingTags: _.remove(state.pendingSavingTags, tag => tag !== action.payload),
      };
    default:
      return state;
  }
};

export const getLoadingSavedTags = state => state.loadingSavedTags;
export const getPendingSavingTags = state => state.pendingSavingTags;
export const getSavedTags = state => state.savedTags;
