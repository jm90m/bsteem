import { CREATE_POST } from '../actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_POST.ACTION:
      return {
        ...state,
        loading: true,
      };
    case CREATE_POST.SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        loading: false,
      };
    case CREATE_POST.ERROR:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
