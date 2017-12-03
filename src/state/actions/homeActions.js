import { FETCH_TAGS, FETCH_DISCUSSIONS, FETCH_MORE_DISCUSSIONS } from './actionTypes';

export const fetchTags = () => ({
  type: FETCH_TAGS.PENDING,
});

export const fetchTagsSuccess = payload => ({
  type: FETCH_TAGS.SUCCESS,
  payload,
});

export const fetchTagsFail = error => ({
  type: FETCH_TAGS.ERROR,
  error,
});

export const fetchDiscussions = filter => ({
  type: FETCH_DISCUSSIONS.PENDING,
  payload: {
    filter,
  },
});

export const fetchDiscussionsSuccess = payload => ({
  type: FETCH_DISCUSSIONS.SUCCESS,
  payload,
});

export const fetchDiscussionsFail = error => ({
  type: FETCH_DISCUSSIONS.ERROR,
  error,
});

export const fetchMoreDiscussions = (startAuthor, startPermlink, filter) => ({
  type: FETCH_MORE_DISCUSSIONS.PENDING,
  payload: {
    startAuthor,
    startPermlink,
    filter,
  },
});

export const fetchMoreDiscussionsSuccess = payload => ({
  type: FETCH_MORE_DISCUSSIONS.SUCCESS,
  payload,
});

export const fetchMoreDiscussionsFail = error => ({
  type: FETCH_MORE_DISCUSSIONS.ERROR,
  error,
});
