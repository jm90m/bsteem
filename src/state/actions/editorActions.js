import { createAsyncSagaAction } from 'util/reduxUtils';
import { CREATE_POST, UPLOAD_IMAGE } from './actionTypes';

export const createPost = createAsyncSagaAction(CREATE_POST);
export const uploadImage = createAsyncSagaAction(UPLOAD_IMAGE);
