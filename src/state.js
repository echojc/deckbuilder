// @flow

import type { CardData } from './scry';
import update from 'immutability-helper';

export type GlobalState = {
  pool: string[],
  cardCache: { [name: string]: CardData },
};

const defaultState = {
  pool: [],
  cardCache: {},
};

type AddToPool = { type: 'ADD_TO_POOL', name: string };
export const addToPool = (name: string): AddToPool => ({ type: 'ADD_TO_POOL', name });

type Action = AddToPool;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'ADD_TO_POOL': return update(state, {
      pool: { $push: [action.name] },
    });
    default: return state;
  }
};
