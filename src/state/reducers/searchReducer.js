import _ from 'lodash';
import {
  SEARCH_FETCH_POSTS,
  SEARCH_SET_TRENDING_TAGS,
  SEARCH_FETCH_USERS,
  SEARCH_FETCH_TAGS,
} from 'state/actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
  searchError: false,

  allTrendingTags: [],

  searchUserResults: [],
  searchPostResults: [],
  searchTagsResults: [],

  loadingSearchUser: false,
  loadingSearchPost: false,
  loadingSearchTag: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_FETCH_POSTS.ACTION:
      return {
        ...state,
        loadingSearchPost: true,
        searchPostResults: [],
      };
    case SEARCH_FETCH_POSTS.SUCCESS: {
      return {
        ...state,
        searchPostResults: _.compact(action.payload),
        loadingSearchPost: false,
      };
    }
    case SEARCH_FETCH_POSTS.ERROR:
      return {
        ...state,
        loadingSearchPost: false,
      };

    case SEARCH_FETCH_USERS.ACTION:
      return {
        ...state,
        searchUserResults: [],
        loadingSearchUser: true,
      };
    case SEARCH_FETCH_USERS.SUCCESS:
      return {
        ...state,
        loadingSearchUser: false,
        searchUserResults: action.payload,
      };
    case SEARCH_FETCH_USERS.ERROR:
      return {
        ...state,
        loadingSearchUser: false,
      };
    case SEARCH_FETCH_TAGS.ACTION:
      return {
        ...state,
        searchTagsResults: [],
        loadingSearchTag: true,
      };
    case SEARCH_FETCH_TAGS.SUCCESS:
      return {
        ...state,
        loadingSearchTag: false,
        searchTagsResults: action.payload,
      };
    case SEARCH_FETCH_TAGS.ERROR:
      return {
        ...state,
        loadingSearchTag: false,
      };
    case SEARCH_SET_TRENDING_TAGS:
      return {
        ...state,
        allTrendingTags: action.payload,
      };
    default:
      return state;
  }
}

export const getAllTrendingTags = state => state.allTrendingTags;
export const getSearchUserResults = state => state.searchUserResults;
export const getSearchPostResults = state => state.searchPostResults;
export const getSearchTagsResults = state => state.searchTagsResults;
export const getLoadingSearchUser = state => state.loadingSearchUser;
export const getLoadingSearchPost = state => state.loadingSearchPost;
export const getLoadingSearchTag = state => state.loadingSearchTag;
