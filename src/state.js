// @flow

import type { CardData } from './scry';
import update from 'immutability-helper';

export type Filters = {
  cmc?: number,
};

export type GlobalState = {
  pool: string[],
  cardCache: { [name: string]: $Shape<CardData> },
  filters: Filters,
};

const defaultState = {
  pool: [],
  cardCache: {},
  filters: {},
};

type AddCardToPool = { type: 'ADD_CARD_TO_POOL', name: string };
export const addCardToPool = (name: string): AddCardToPool => ({ type: 'ADD_CARD_TO_POOL', name });

type CacheCard = { type: 'CACHE_CARD', name: string, cardData: ?$Shape<CardData> };
export const cacheCard = (name: string, cardData: ?$Shape<CardData>): CacheCard => ({ type: 'CACHE_CARD', name, cardData });

type SetFilters = { type: 'SET_FILTERS', filters: Filters };
export const setFilters = (filters: Filters): SetFilters => ({ type: 'SET_FILTERS', filters });

type Action = AddCardToPool | CacheCard | SetFilters;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'ADD_CARD_TO_POOL': return update(state, {
      pool: { $push: [action.name] },
    });
    case 'CACHE_CARD': return update(state, {
      cardCache: { $merge: { [action.name]: action.cardData } },
    });
    case 'SET_FILTERS': return update(state, {
      filters: { $merge: { ...action.filters } },
    });
    default: return state;
  }
};
