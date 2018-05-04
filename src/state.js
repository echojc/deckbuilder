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

type AddCardToPool = { type: 'ADD_CARD_TO_POOL', name: string };
export const addCardToPool = (name: string): AddCardToPool => ({ type: 'ADD_CARD_TO_POOL', name });

type CacheCard = { type: 'CACHE_CARD', name: string, cardData: CardData };
export const cacheCard = (name: string, cardData: CardData): CacheCard => ({ type: 'CACHE_CARD', name, cardData });

type Action = AddCardToPool | CacheCard;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'ADD_CARD_TO_POOL': return update(state, {
      pool: { $push: [action.name] },
    });
    case 'CACHE_CARD': return update(state, {
      cardCache: { $merge: { [action.name]: action.cardData } },
    });
    default: return state;
  }
};
