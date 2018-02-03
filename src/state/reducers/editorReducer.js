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
    case CREATE_POST.ERROR:
    case CREATE_POST.LOADING_END:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}

export const getCreatePostLoading = state => state.loading;
