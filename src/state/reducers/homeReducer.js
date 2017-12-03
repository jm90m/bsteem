import {
  FETCH_TAGS,
  FETCH_DISCUSSIONS,
  FETCH_MORE_DISCUSSIONS,
} from '../actions/actionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
  posts: [],
  tags: [],
  loading: false,
  tagsLoading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_TAGS.PENDING:
      return {
        ...state,
        tagsLoading: true,
      };
    case FETCH_TAGS.SUCCESS:
      const tags = _.filter(action.payload, tag => tag.name !== '');
      return {
        ...state,
        tagsLoading: false,
        tags,
      };
    case FETCH_DISCUSSIONS.PENDING:
      return {
        ...state,
        loading: true,
      };
    case FETCH_DISCUSSIONS.SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
      };
    case FETCH_MORE_DISCUSSIONS.SUCCESS:
      return {
        ...state,
        posts: state.posts.concat(action.payload.slice(1, action.payload.length)),
        loading: false,
      };
    default:
      return state;
  }
};
