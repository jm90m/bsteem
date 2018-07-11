import _ from 'lodash';
import {
  FETCH_POST_DETAILS,
  ADD_POST_TO_SAVED_OFFLINE,
  SAVE_POST_OFFLINE,
  UNSAVE_POST_OFFLINE,
  REMOVE_POST_SAVED_OFFLINE,
  ADD_POSTS_TO_POST_MAP,
} from 'state/actions/actionTypes';

const INITIAL_STATE = {
  postsDetails: {}, //postKey (author/permlink) -> postDetails
  postLoading: false,
  savedOfflinePosts: {},
  pendingSavingPostsOffline: [],
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
    case ADD_POSTS_TO_POST_MAP: {
      const newPostsDetails = _.reduce(
        action.payload,
        (acc, post) => {
          const author = _.get(post, 'author', null);
          const permlink = _.get(post, 'permlink', null);

          if (author !== null && permlink !== null) {
            const postKey = `${author}/${permlink}`;
            acc[postKey] = post;
          }

          return acc;
        },
        {},
      );
      return {
        ...state,
        postsDetails: {
          ...state.postsDetails,
          ...newPostsDetails,
        },
      };
    }
    case UNSAVE_POST_OFFLINE.ACTION:
    case SAVE_POST_OFFLINE.ACTION: {
      const id = _.get(action, 'payload.postData.id');
      return {
        ...state,
        pendingSavingPostsOffline: _.concat(state.pendingSavingPosts, id),
      };
    }
    case UNSAVE_POST_OFFLINE.ERROR:
    case UNSAVE_POST_OFFLINE.LOADING_END:
    case UNSAVE_POST_OFFLINE.SUCCESS:
    case SAVE_POST_OFFLINE.ERROR:
    case SAVE_POST_OFFLINE.LOADING_END:
    case SAVE_POST_OFFLINE.SUCCESS: {
      const id = _.get(action, 'payload.postData.id');
      return {
        ...state,
        pendingSavingPostsOffline: _.remove(
          state.pendingSavingPostsOffline,
          postId => postId !== id,
        ),
      };
    }
    case ADD_POST_TO_SAVED_OFFLINE: {
      const { postDataString } = action.payload;
      const parsePostData = _.attempt(JSON.parse, postDataString);
      const newState = { ...state };

      if (!_.isError(parsePostData)) {
        const id = _.get(parsePostData, 'id', 0);
        newState.savedOfflinePosts = {
          ...state.savedOfflinePosts,
          [id]: parsePostData,
        };
      }

      return newState;
    }
    case REMOVE_POST_SAVED_OFFLINE: {
      const id = _.get(action, 'payload.postData.id');
      const newSavedOfflinePosts = { ...state.savedOfflinePosts };
      delete newSavedOfflinePosts[id];
      return {
        ...state,
        savedOfflinePosts: newSavedOfflinePosts,
      };
    }
    default:
      return state;
  }
}

export const getPostsDetails = state => state.postsDetails;
export const getSinglePostDetails = (state, postKey) => _.get(state.postsDetails, postKey, {});
export const getPostLoading = state => state.postLoading;
export const getSavedOfflinePosts = state => state.savedOfflinePosts;
export const getPendingSavingPostsOffline = state => state.pendingSavingPostsOffline;
