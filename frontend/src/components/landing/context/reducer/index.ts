// https://github.com/redux-utilities/redux-actions/blob/master/src/handleAction.js
// https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#creating-the-root-reducer
import Debug from 'debug';
import { createReducer } from '@/lib/middlewares';
import { type InitialLandingState } from '../types';
import {
  FETCH_LIST_REQUEST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
} from '../constants';
import {
  handleListRequest,
  handleListSuccess,
  handleListFailure,
} from './tasks';

const debug = Debug('views:landing:context:reducer');

// export interface GenerateInitialState {}

export function generateInitialState(): InitialLandingState {
  debug('generate initial state');

  return {
    fetchStatus: null,
    errors: null,
    list: [],
    data: {}
  };
}

export default createReducer<InitialLandingState>({
  handlers: {
    [FETCH_LIST_REQUEST]: handleListRequest,
    [FETCH_LIST_SUCCESS]: handleListSuccess,
    [FETCH_LIST_FAILURE]: handleListFailure,
    // [FETCH_CREDIT_DATA_REQUEST]: handleCreditDataRequest,
    // [FETCH_CREDIT_DATA_SUCCESS]: handleCreditDataSuccess,
    // [FETCH_CREDIT_DATA_FAILURE]: handleCreditDataFailure,
    // [WITHDRAW_CREDITS_REQUEST]: handleWithdrawCreditsRequest,
    // [WITHDRAW_CREDITS_PREPARING]: handleWithdrawCreditsPreparing,
    // [WITHDRAW_CREDITS_PENDING]: handleWithdrawCreditsPending,
    // [WITHDRAW_CREDITS_SUCCESS]: handleWithdrawCreditsSuccess,
    // [WITHDRAW_CREDITS_FAILURE]: handleWithdrawCreditsFailure,
    // [WITHDRAW_CREDITS_ERROR]: handleWithdrawCreditsError,
  },
  before: [],
  after: [],
});
