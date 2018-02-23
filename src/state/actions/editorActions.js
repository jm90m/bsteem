import { createAsyncSagaAction } from 'util/reduxUtils';
import { CREATE_POST, UPLOAD_IMAGE, CREATE_COMMENT } from './actionTypes';

export const createPost = createAsyncSagaAction(CREATE_POST);
export const createComment = createAsyncSagaAction(CREATE_COMMENT);
export const uploadImage = createAsyncSagaAction(UPLOAD_IMAGE);
