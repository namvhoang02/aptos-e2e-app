const createSymbol = (name: string) => `LANDING/${name}`;

// export const WITHDRAW_CREDITS_REQUEST = createSymbol('WITHDRAW_CREDITS_REQUEST');
// export const WITHDRAW_CREDITS_PREPARING = createSymbol('WITHDRAW_CREDITS_PREPARING');
// export const WITHDRAW_CREDITS_PENDING = createSymbol('WITHDRAW_CREDITS_PENDING');
// export const WITHDRAW_CREDITS_SUCCESS = createSymbol('WITHDRAW_CREDITS_SUCCESS');
// export const WITHDRAW_CREDITS_FAILURE = createSymbol('WITHDRAW_CREDITS_FAILURE');
// export const WITHDRAW_CREDITS_ERROR = createSymbol('WITHDRAW_CREDITS_ERROR');

export const FETCH_LIST_REQUEST = createSymbol('FETCH_LIST_REQUEST');
export const FETCH_LIST_SUCCESS = createSymbol('FETCH_LIST_SUCCESS');
export const FETCH_LIST_FAILURE = createSymbol('FETCH_LIST_FAILURE');

export const COMPLETE_TASK = createSymbol('UPDATE_TASK');

export const ADD_TASK = createSymbol('ADD_TASK');

export const DELETE_TASK = createSymbol('DELETE_TASK');
