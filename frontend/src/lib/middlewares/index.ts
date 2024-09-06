import Debug from 'debug';
import concat from 'lodash/concat';
import isArray from 'lodash/isArray';

import type { Action, Reducer } from './types';

const debug = Debug('lib:middlewares');

export type IndexProps<I, A> = {
  state: I;
  action: A;
  handler: any;
  before: any;
  after: any;
};

export function applyMiddlewares<I, A>({
  state,
  action,
  handler,
  before,
  after,
}: IndexProps<I, A>) {
  debug('apply middlewares');

  let chain: any = [];
  // before middlewares
  if (before) {
    chain = [...before, ...chain];
  }

  if (handler) {
    if (isArray(handler)) {
      chain = concat(chain, handler);
    } else {
      chain.push(handler);
    }
  }

  // after middlewares
  if (after) {
    chain = [...chain, ...after];
  }

  return chain.reduce(
    (st: I, fn: Reducer<I, any>) => fn(st, action as Action<any>),
    state,
  );
}

export type CreateReducerParams<I> = {
  handlers: Record<string, any>;
  before?: Reducer<I, any>[];
  after?: Reducer<I, any>[];
};

export function createReducer<I>({
  handlers,
  before,
  after,
}: CreateReducerParams<I>) {
  debug('create reducer');
  return (state: I, action: Action<any>) => {
    debug('run reducer');

    if (
      !action.type ||
      !Object.prototype.hasOwnProperty.call(handlers, action.type)
    ) {
      return state;
    }

    return applyMiddlewares<I, any>({
      state,
      action,
      handler: handlers[action.type],
      before,
      after,
    });
  };
}
