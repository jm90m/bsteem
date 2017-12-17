import { FETCH_CURRENT_USER_FEED, FETCH_MORE_CURRENT_USER_FEED } from '../actions/actionTypes';

const INITIAL_STATE = {
  currentUserFeed: [],
  loadingFetchCurrentUserFeed: false,
  loadingFetchMoreCurrentUserFeed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.payload) {
    case FETCH_CURRENT_USER_FEED.PENDING:
      return {
        ...state,
        loadingFetchCurrentUserFeed: true,
      };
    case FETCH_CURRENT_USER_FEED.SUCCESS:
      return {
        ...state,
        currentUserFeed: action.payload,
        loadingFetchCurrentUserFeed: false,
      };
    case FETCH_CURRENT_USER_FEED.ERROR:
      return {
        ...state,
        loadingFetchCurrentUserFeed: false,
      };
    case FETCH_MORE_CURRENT_USER_FEED.PENDING:
      return {
        ...state,
        loadingFetchMoreCurrentUserFeed: true,
      };
    case FETCH_MORE_CURRENT_USER_FEED.SUCCESS:
      return {
        ...state,
        currentUserFeed: state.currentUserFeed.concat(
          action.payload.slice(1, action.payload.length),
        ),
        loadingFetchMoreCurrentUserFeed: false,
      };
    case FETCH_MORE_CURRENT_USER_FEED.ERROR:
      return {
        ...state,
        loadingFetchMoreCurrentUserFeed: false,
      };
    default:
      return state;
  }
};

export const getCurrentUserFeed = state => state.currentUserFeed;
export const getLoadingFetchCurrentUserFeed = state => state.loadingFetchCurrentUserFeed;
export const getLoadingFetchMoreCurrentUserFeed = state => state.loadingFetchMoreCurrentUserFeed;
