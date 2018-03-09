import { createAsyncSagaAction } from 'util/reduxUtils';
import { UPDATE_NSFW_DISPLAY_SETTING, FETCH_CURRENT_USER_SETTINGS } from './actionTypes';

export const updateNSFWDisplaySettings = createAsyncSagaAction(UPDATE_NSFW_DISPLAY_SETTING);
export const getCurrentUserSettings = createAsyncSagaAction(FETCH_CURRENT_USER_SETTINGS);
