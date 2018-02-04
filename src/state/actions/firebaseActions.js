import { createAsyncSagaAction } from 'util/reduxUtils';
import { FETCH_SAVED_TAGS, SAVE_TAG, UNSAVE_TAG } from './actionTypes';

export const fetchSavedTags = createAsyncSagaAction(FETCH_SAVED_TAGS);
export const saveTag = createAsyncSagaAction(SAVE_TAG);
export const unsaveTag = createAsyncSagaAction(UNSAVE_TAG);
