import _ from 'lodash';
import {
  AUTHENTICATE_USER,
  LOGOUT_USER,
  GET_AUTH_USER_SC_DATA,
  SAVE_NOTIFICATIONS_LAST_TIMESTAMP,
  SET_CURRENT_USER_NAVIGATION,
} from '../actions/actionTypes';

const INITIAL_STATE = {
  accessToken: '',
  expiresIn: '',
  username: '',
  maxAge: null,
  authenticated: false,
  userSCMetaData: {},
  currentUserNavigation: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTHENTICATE_USER.SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        expiresIn: action.payload.expiresIn,
        username: action.payload.username,
        maxAge: action.payload.maxAge,
        authenticated: true,
      };
    case LOGOUT_USER:
      return {
        ...INITIAL_STATE,
      };
    case GET_AUTH_USER_SC_DATA.SUCCESS: {
      const userSCMetaData = _.get(action.payload, 'user_metadata', {});
      return {
        ...state,
        userSCMetaData,
      };
    }
    case SAVE_NOTIFICATIONS_LAST_TIMESTAMP.SUCCESS:
      return {
        ...state,
        userSCMetaData: action.payload,
      };
    case SET_CURRENT_USER_NAVIGATION:
      return {
        ...state,
        currentUserNavigation: action.payload,
      };
    default:
      return state;
  }
};

export const getAccessToken = state => state.accessToken;
export const getExpiresIn = state => state.expiresIn;
export const getUsername = state => state.username;
export const getIsAuthenticated = state => state.authenticated;
export const getAuthenticatedUserSCMetaData = state => state.userSCMetaData;
export const getCurrentUserNavigation = state => state.currentUserNavigation;
