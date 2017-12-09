import _ from 'lodash';
import { SEARCH_ASK_STEEM } from 'state/actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
  searchError: false,
  searchResults: [],
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
      console.log('SEARCH_ASK_STEEM.SUCCESS');
      console.log(action.payload);
      const results = _.get(action.payload, 'results', []);
      console.log('SEARCH RESULTS', results);
      return {
        ...state,
        searchResults: results,
        loading: false,
      };
    }
    case SEARCH_ASK_STEEM.ERROR:
      return {
        ...state,
        loading: false,
        searchError: true,
      };
    default:
      return state;
  }
}

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
