import { createAsyncSagaAction } from 'util/reduxUtils';
import { SEARCH_ASK_STEEM } from './actionTypes';

export const searchAskSteem = createAsyncSagaAction(SEARCH_ASK_STEEM);
