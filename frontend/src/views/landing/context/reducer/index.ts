// https://github.com/redux-utilities/redux-actions/blob/master/src/handleAction.js
// https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#creating-the-root-reducer
import Debug from 'debug';
import { createReducer } from '@/lib/middlewares';
import { type InitialLandingState } from '../types';
// import {
//   FETCH_REFERRAL_DATA_REQUEST,
//   FETCH_REFERRAL_DATA_SUCCESS,
//   FETCH_REFERRAL_DATA_FAILURE,
//   FETCH_CREDIT_DATA_REQUEST,
//   FETCH_CREDIT_DATA_SUCCESS,
//   FETCH_CREDIT_DATA_FAILURE,
//   WITHDRAW_CREDITS_REQUEST,
//   WITHDRAW_CREDITS_PREPARING,
//   WITHDRAW_CREDITS_PENDING,
//   WITHDRAW_CREDITS_SUCCESS,
//   WITHDRAW_CREDITS_FAILURE,
//   WITHDRAW_CREDITS_ERROR,
// } from '../constants';
// import {
//   handleCreditDataRequest,
//   handleCreditDataSuccess,
//   handleCreditDataFailure,
//   handleWithdrawCreditsRequest,
//   handleWithdrawCreditsPreparing,
//   handleWithdrawCreditsPending,
//   handleWithdrawCreditsSuccess,
//   handleWithdrawCreditsFailure,
//   handleWithdrawCreditsError,
// } from './credit';

const debug = Debug('views:landing:context:reducer');

export interface GenerateInitialState {
  // FIXME: chuyen thanh support network id
  chainid: number;
}

export function generateInitialState({ chainid }: GenerateInitialState): InitialLandingState {
  debug('generate initial state');

  return {
    chainid,
    fetchStatus: null,
    errors: null,
    list: [],
    data: {}
  };
}

export default createReducer<InitialLandingState>({
  handlers: {
    // [FETCH_REFERRAL_DATA_REQUEST]: handleFetchReferralDataRequest,
    // [FETCH_REFERRAL_DATA_SUCCESS]: handleFetchReferralDataSuccess,
    // [FETCH_REFERRAL_DATA_FAILURE]: handleFetchReferralDataFailure,
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
