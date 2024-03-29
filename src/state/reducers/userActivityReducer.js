import _ from 'lodash';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
  FETCH_USER_TRANSFER_HISTORY,
} from 'state/actions/actionTypes';
import { FETCH_USER } from '../actions/actionTypes';

const initialState = {
  usersTransactions: {},
  usersAccountHistory: {},
  loadingFetchUserAccountHistory: false,
  loadingFetchMoreUserAccountHistory: false,

  loadingFetchUserTransferHistory: false,
  userTransferHistory: {},
  // loadingEstAccountValue: true,
  // loadingGlobalProperties: true,
  // accountHistoryFilter: [],
  // currentDisplayedActions: [],
  // currentFilteredActions: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_ACCOUNT_HISTORY.ACTION:
      return {
        ...state,
        loadingFetchUserAccountHistory: true,
      };
    case FETCH_USER_ACCOUNT_HISTORY.SUCCESS: {
      const { username, userWalletTransactions, userAccountHistory } = action.payload;
      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [username]: userWalletTransactions,
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [username]: userAccountHistory,
        },
      };
    }
    case FETCH_USER_ACCOUNT_HISTORY.LOADING_END: {
      return {
        ...state,
        loadingFetchUserAccountHistory: false,
      };
    }
    case FETCH_MORE_USER_ACCOUNT_HISTORY.ACTION:
      return {
        ...state,
        loadingFetchMoreUserAccountHistory: true,
      };
    case FETCH_MORE_USER_ACCOUNT_HISTORY.SUCCESS: {
      const { username, userWalletTransactions, userAccountHistory } = action.payload;
      const userCurrentWalletTransactions = _.get(state.usersTransactions, username, []);
      const userCurrentAccountHistory = _.get(state.usersAccountHistory, username, []);
      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [username]: _.uniqBy(
            userCurrentWalletTransactions.concat(userWalletTransactions),
            'actionCount',
          ),
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [action.payload.username]: _.uniqBy(
            userCurrentAccountHistory.concat(userAccountHistory),
            'actionCount',
          ),
        },
      };
    }
    case FETCH_MORE_USER_ACCOUNT_HISTORY.ERROR:
    case FETCH_MORE_USER_ACCOUNT_HISTORY.LOADING_END:
      return {
        ...state,
        loadingFetchMoreUserAccountHistory: false,
      };

    case FETCH_USER_TRANSFER_HISTORY.ACTION:
      return {
        ...state,
        loadingFetchUserTransferHistory: true,
      };
    case FETCH_USER_TRANSFER_HISTORY.SUCCESS: {
      const { username, userTransferHistory } = action.payload;
      return {
        ...state,
        loadingFetchUserTransferHistory: false,
        userTransferHistory: {
          ...state.userTransferHistory,
          [username]: userTransferHistory,
        },
      };
    }
    case FETCH_USER_TRANSFER_HISTORY.LOADING_END:
    case FETCH_USER_TRANSFER_HISTORY.ERROR:
      return {
        ...state,
        loadingFetchUserTransferHistory: false,
      };
    default:
      return state;
  }
}

export const getUsersTransactions = state => state.usersTransactions;
export const getUsersAccountHistory = state => state.usersAccountHistory;
export const getLoadingFetchUserAccountHistory = state => state.loadingFetchUserAccountHistory;
export const getLoadingFetchMoreUserAccountHistory = state =>
  state.loadingFetchMoreUserAccountHistory;
export const getUserTransferHistory = state => state.userTransferHistory;
export const getLoadingFetchUserTransferHistory = state => state.loadingFetchUserTransferHistory;
