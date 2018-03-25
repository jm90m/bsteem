import _ from 'lodash';
import {
  FETCH_MESSAGES,
  SEARCH_USER_MESSAGES,
  SEND_MESSAGE,
  FETCH_CURRENT_MESSAGES,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  loadingFetchMessages: false,
  messages: {}, // username -> message obj
  messagesSearchUserResults: [],
  loadingMessagesSearchUserResults: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_MESSAGES.ACTION:
      return {
        ...state,
        loadingFetchMessages: true,
      };
    case FETCH_MESSAGES.SUCCESS:
    case FETCH_MESSAGES.ERROR:
    case FETCH_MESSAGES.LOADING_END:
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
    default:
      return state;
  }
}

export const getLoadingFetchMessages = state => state.loadingFetchMessages;
export const getMessages = state => state.messages;
export const getMessagesSearchUserResults = state => state.messagesSearchUserResults;
export const getLoadingMessagesSearchUserResults = state => state.loadingMessagesSearchUserResults;
export const getUserMessages = (state, username) => _.get(state.messages, username);
