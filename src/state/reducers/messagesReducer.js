import _ from 'lodash';
import {
  FETCH_DISPLAYED_MESSAGES,
  SEARCH_USER_MESSAGES,
  SEND_MESSAGE,
  FETCH_CURRENT_MESSAGES,
  FETCH_BLOCKED_USERS,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  loadingFetchMessages: false,
  messages: {}, // username -> message obj
  messagesSearchUserResults: [],
  loadingMessagesSearchUserResults: false,
  displayedMessages: [],
  blockedUsers: {},
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DISPLAYED_MESSAGES.ACTION:
      return {
        ...state,
        loadingFetchMessages: true,
      };
    case FETCH_DISPLAYED_MESSAGES.SUCCESS: {
      const displayedMessages = _.sortBy(
        _.map(action.payload, (message, username) => ({
          ...message,
          toUser: username,
        })),
        'timestamp',
      ).reverse();
      return {
        ...state,
        loadingFetchMessages: false,
        displayedMessages,
      };
    }
    case FETCH_DISPLAYED_MESSAGES.ERROR:
    case FETCH_DISPLAYED_MESSAGES.LOADING_END:
      return {
        ...state,
        loadingFetchMessages: false,
      };

    case SEARCH_USER_MESSAGES.ACTION:
      return {
        ...state,
        loadingMessagesSearchUserResults: true,
      };

    case SEARCH_USER_MESSAGES.SUCCESS:
      return {
        ...state,
        messagesSearchUserResults: action.payload,
        loadingMessagesSearchUserResults: false,
      };
    case SEARCH_USER_MESSAGES.ERROR:
    case SEARCH_USER_MESSAGES.LOADING_END:
      return {
        ...state,
        loadingMessagesSearchUserResults: false,
      };
    case SEND_MESSAGE.SUCCESS:
      return {
        ...state,
      };

    case FETCH_CURRENT_MESSAGES.SUCCESS: {
      const { username, messages } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [username]: messages,
        },
      };
    }

    case FETCH_BLOCKED_USERS.SUCCESS:
      return {
        ...state,
        blockedUsers: action.payload,
      };
    default:
      return state;
  }
}

export const getLoadingFetchMessages = state => state.loadingFetchMessages;
export const getMessages = state => state.messages;
export const getMessagesSearchUserResults = state => state.messagesSearchUserResults;
export const getLoadingMessagesSearchUserResults = state => state.loadingMessagesSearchUserResults;
export const getUserMessages = (state, username) => _.get(state.messages, username);
export const getDisplayedMessages = state => state.displayedMessages;
export const getBlockedUsers = state => state.blockedUsers;
