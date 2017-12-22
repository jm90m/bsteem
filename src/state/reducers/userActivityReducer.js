import _ from 'lodash';
import {
  FETCH_USER_ACCOUNT_HISTORY,
  FETCH_MORE_USER_ACCOUNT_HISTORY,
} from 'state/actions/actionTypes';

const initialState = {
  usersTransactions: {},
  usersAccountHistory: {},
  usersAccountHistoryLoading: true,
  loadingEstAccountValue: true,
  loadingGlobalProperties: true,
  loadingMoreUsersAccountHistory: false,
  accountHistoryFilter: [],
  currentDisplayedActions: [],
  currentFilteredActions: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
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
        loadingMoreUsersAccountHistory: false,
      };
    }
    default:
      return state;
  }
}

export const getUsersTransactions = state => state.usersTransactions;
export const getUsersAccountHistory = state => state.usersAccountHistory;
