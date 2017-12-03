import { FETCH_USER } from '../actions/actionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
  usersMap: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER.SUCCESS: {
      const user = _.head(action.payload);
      return {
        ...state,
        usersMap: {
          ...state.usersMap,
          [user.name]: user,
        },
      };
    }
    default:
      return state;
  }
};
