import _ from 'lodash';
import { SEARCH_ASK_STEEM, SEARCH_FETCH_POST_DETAILS } from 'state/actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
  searchError: false,
  searchResults: [],
  currentSearchPageOptions: {},
  currentSearchedPosts: {}, //postID -> postDetails
  searchFetchPostLoading: false,
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

    case SEARCH_FETCH_POST_DETAILS.ACTION:
      return {
        ...state,
        searchFetchPostLoading: true,
      };
    case SEARCH_FETCH_POST_DETAILS.SUCCESS: {
      const { author, permlink } = action.payload;
      const postKey = `${author}/${permlink}`;
      return {
        ...state,
        searchFetchPostLoading: false,
        currentSearchedPosts: {
          ...state.currentSearchedPosts,
          [postKey]: action.payload,
        },
      };
    }
    case SEARCH_FETCH_POST_DETAILS.ERROR:
      return {
        ...state,
        searchFetchPostLoading: false,
      };
    default:
      return state;
  }
}

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getCurrentSearchedPosts = state => state.currentSearchedPosts;
export const getSearchFetchPostLoading = state => state.searchFetchPostLoading;
