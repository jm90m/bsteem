import _ from 'lodash';
import {
  FETCH_TAGS,
  FETCH_DISCUSSIONS,
  FETCH_MORE_DISCUSSIONS,
  ENABLE_FILTER_HOME_FEED_BY_FOLLOWERS,
  DISABLE_FILTER_HOME_FEED_BY_FOLLOWERS,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  posts: [],
  tags: [],
  filterFeedByFollowers: false,
  loadingFetchDiscussions: false,
  loadingFetchMoreDiscussions: false,
  tagsLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_TAGS.PENDING:
      return {
        ...state,
        tagsLoading: true,
      };
    case FETCH_TAGS.SUCCESS: {
      const tags = _.filter(action.payload, tag => tag.name !== '');
      return {
        ...state,
        tagsLoading: false,
        tags,
      };
    }
    case FETCH_TAGS.ERROR:
      return {
        ...state,
        tagsLoading: false,
      };
    case FETCH_DISCUSSIONS.PENDING:
      return {
        ...state,
        loadingFetchDiscussions: true,
      };
    case FETCH_DISCUSSIONS.SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loadingFetchDiscussions: false,
      };
    case FETCH_DISCUSSIONS.ERROR:
      return {
        ...state,
        loadingFetchDiscussions: false,
      };
    case FETCH_MORE_DISCUSSIONS.PENDING:
      return {
        ...state,
        loadingFetchMoreDiscussions: true,
      };
    case FETCH_MORE_DISCUSSIONS.SUCCESS:
      return {
        ...state,
        posts: state.posts.concat(action.payload.slice(1, action.payload.length)),
        loadingFetchMoreDiscussions: false,
      };
    case FETCH_MORE_DISCUSSIONS.ERROR:
      return {
        ...state,
        loadingFetchMoreDiscussions: false,
      };
    case ENABLE_FILTER_HOME_FEED_BY_FOLLOWERS:
      return {
        ...state,
        filterFeedByFollowers: true,
      };
    case DISABLE_FILTER_HOME_FEED_BY_FOLLOWERS:
      return {
        ...state,
        filterFeedByFollowers: false,
      };
    default:
      return state;
  }
};

export const getLoadingFetchDiscussions = state => state.loadingFetchDiscussions;
export const getLoadingFetchMoreDiscussions = state => state.loadingFetchMoreDiscussions;
export const getHomeFeedPosts = state => state.posts;
export const getHomeTags = state => state.tags;
export const getFilterFeedByFollowers = state => state.filterFeedByFollowers;
export const getTagsLoading = state => state.tagsLoading;
