export const createAsyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
  ACTION: `${type}_ACTION`,
});

export const createAsyncSagaAction = actionType => ({
  action: payload => ({
    type: actionType.ACTION,
    payload,
  }),
  success: payload => ({
    type: actionType.SUCCESS,
    payload,
  }),
  fail: error => ({
    type: actionType.ERROR,
    error,
  }),
});
