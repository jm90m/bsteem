import _ from 'lodash';
import { FETCH_POST_DETAILS } from 'state/actions/actionTypes';

const INITIAL_STATE = {
  postsDetails: {}, //postID -> postDetails
  postLoading: false,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_POST_DETAILS.ACTION:
      return {
        ...state,
        postLoading: true,
      };
    case FETCH_POST_DETAILS.SUCCESS: {
      const { author, permlink } = action.payload;
      const postKey = `${author}/${permlink}`;
      return {
        ...state,
        postLoading: false,
        postsDetails: {
          ...state.postsDetails,
          [postKey]: action.payload,
        },
      };
    }
    case FETCH_POST_DETAILS.ERROR:
      return {
        ...state,
        postLoading: false,
      };
    default:
      return state;
  }
}

export const getPostsDetails = state => state.postsDetails;
export const getPostLoading = state => state.postLoading;
