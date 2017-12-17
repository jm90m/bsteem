import { FETCH_COMMENTS } from '../actions/actionTypes';

const INITIAL_STATE = {
  commentsByPostId: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COMMENTS.SUCCESS:
      return {
        ...state,
      };
    default:
      return state;
  }
};
