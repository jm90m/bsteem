import _ from 'lodash';
import {
  SEARCH_ASK_STEEM,
  SEARCH_FETCH_POST_DETAILS,
  SEARCH_SET_TRENDING_TAGS,
  SEARCH_FETCH_USERS,
  SEARCH_FETCH_TAGS,
} from 'state/actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
  searchError: false,
  searchResults: [],

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
    case SEARCH_ASK_STEEM.ACTION:
      return {
        ...state,
        loading: true,
        searchError: false,
      };
    case SEARCH_ASK_STEEM.SUCCESS: {
      const askSteemResults = _.get(action.payload, 'askSteemResults', []);
      const steemAccountLookupResults = _.get(action.payload, 'steemAccountLookupResults', []);
      const formattedSteemLookupResults = _.map(steemAccountLookupResults, name => ({
        type: 'user',
        name,
      }));
      const searchResults = _.compact(_.concat(formattedSteemLookupResults, askSteemResults));
      return {
        searchResults,
        loading: false,
      };
    }
    case SEARCH_ASK_STEEM.ERROR:
      return {
        ...state,
        loading: false,
        searchError: true,
        searchResults: [],
      };

    case SEARCH_FETCH_USERS.ACTION:



    case SEARCH_SET_TRENDING_TAGS:
      return {
        ...state,
        allTrendingTags: action.payload,
      };
    default:
      return state;
  }
}

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getAllTrendingTags = state => state.allTrendingTags;
export const getSearchUserResults = state => state.searchUserResults;
export const getSearchPostResults = state => state.searchPostResults;
export const getSearchTagsResults = state => state.searchTagsResults;
export const getLoadingSearchUser = state => state.loadingSearchUser;
export const getLoadingSearchPost = state => state.loadingSearchPost;
export const getLoadingSearchTag = state => state.loadingSearchTag;
