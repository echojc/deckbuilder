// @flow

import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';

import type { CardData } from './saga';

export type Filters = {
  cmc?: number,
};

export type CardInstance = {
  instanceId: string,
  cardName: string,
};

function newCardInstance(name: string): CardInstance {
  return {
    instanceId: uuidv4(),
    cardName: name,
  };
}

export type Deck = {
  id: string,
  name: string,
  cards: CardInstance[],
};

function newDeck(id?: string = uuidv4(), name?: string = 'new deck'): Deck {
  return {
    id,
    name,
    cards: [],
  };
}

export type Pool = {
  id: string,
  name: string,
  cards: CardInstance[],
  decks: { [id: string]: Deck },
};

function newPool(id?: string = uuidv4(), name?: string = 'new pool'): Pool {
  return {
    id,
    name,
    cards: [],
    decks: {
      default: newDeck('default'),
    },
  };
}

export type GlobalState = {
  currentPoolId: string,
  currentDeckId: string,
  cardCache: { [name: string]: $Shape<CardData> },
  filters: Filters,
  pools: { [id: string]: Pool },
};

const defaultState: GlobalState = {
  currentPoolId: 'default',
  currentDeckId: 'default',
  cardCache: {},
  filters: {},
  pools: {
    default: newPool('default'),
  },
};

export type AddCardToPool = { type: 'ADD_CARD_TO_POOL', cardName: string };
export const addCardToPool = (cardName: string): AddCardToPool => ({ type: 'ADD_CARD_TO_POOL', cardName });

export type CacheCard = { type: 'CACHE_CARD', cardName: string, cardData: ?$Shape<CardData> };
export const cacheCard = (cardName: string, cardData: ?$Shape<CardData>): CacheCard => ({ type: 'CACHE_CARD', cardName, cardData });

export type SetFilters = { type: 'SET_FILTERS', filters: Filters };
export const setFilters = (filters: Filters): SetFilters => ({ type: 'SET_FILTERS', filters });

export type Action = AddCardToPool | CacheCard | SetFilters;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'ADD_CARD_TO_POOL': return update(state, {
      pools: {
        [state.currentPoolId]: {
          cards: { $push: [newCardInstance(action.cardName)] },
        }
      },
    });
    case 'CACHE_CARD': return update(state, {
      cardCache: { $merge: { [action.cardName]: action.cardData } },
    });
    case 'SET_FILTERS': return update(state, {
      filters: { $merge: { ...action.filters } },
    });
    default: return state;
  }
};
