import { FETCH_COMMENTS } from '../actions/actionTypes';

const INITIAL_STATE = {
  commentsByPostId: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_COMMENTS.SUCCESS:
      console.log(action.payload);
      return {
        ...state,
      };
    default:
      return state;
  }
};
