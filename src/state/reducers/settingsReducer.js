import _ from 'lodash';
import { FETCH_CURRENT_USER_SETTINGS, UPDATE_NSFW_DISPLAY_SETTING } from '../actions/actionTypes';

const INITIAL_STATE = {
  displayNSFWContent: false,
  reportedPosts: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_NSFW_DISPLAY_SETTING.SUCCESS:
      return {
        ...state,
        displayNSFWContent: action.payload,
      };
    case FETCH_CURRENT_USER_SETTINGS.SUCCESS: {
      const displayNSFWContent = _.get(action.payload, 'display-nsfw-setting', false);
      return {
        ...state,
        displayNSFWContent,
      };
    }
    default:
      return state;
  }
};

export const getDisplayNSFWContent = state => state.displayNSFWContent;
export const getReportedPosts = state => state.reportedPosts;
