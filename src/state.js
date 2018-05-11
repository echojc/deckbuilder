// @flow

import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';

import type { CardData } from './saga';

export type Filters = {
  cmc?: number,
};

export type SortBy = 'name' | 'cmc' | 'power' | 'toughness' | 'rarity';
export type SortDirection = 'asc' | 'desc';
export type Sort = {
  by: SortBy,
  direction: SortDirection,
};

export type Deck = {
  id: string,
  name: string,
  cardInstanceIds: { [instanceId: string]: {} },
};

function newDeck(id?: string = uuidv4(), name?: string = 'new deck'): Deck {
  return {
    id,
    name,
    cardInstanceIds: {},
  };
}

export type Pool = {
  id: string,
  name: string,
  cards: { [instanceId: string]: string }, // instanceId -> cardName
  decks: { [id: string]: Deck },
};

function newPool(id?: string = uuidv4(), name?: string = 'new pool'): Pool {
  return {
    id,
    name,
    cards: {},
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
  sorting: Sort,
  pools: { [id: string]: Pool },
};

const defaultState: GlobalState = {
  currentPoolId: 'default',
  currentDeckId: 'default',
  cardCache: {},
  filters: {},
  sorting: {
    by: 'name',
    direction: 'asc',
  },
  pools: {
    default: newPool('default'),
  },
};

export type AddCardToPool = { type: 'ADD_CARD_TO_POOL', cardName: string };
export const addCardToPool = (cardName: string): AddCardToPool => ({ type: 'ADD_CARD_TO_POOL', cardName });

export type AddCardInstanceToDeck = { type: 'ADD_CARD_INSTANCE_TO_DECK', instanceId: string };
export const addCardInstanceToDeck = (instanceId: string): AddCardInstanceToDeck => ({ type: 'ADD_CARD_INSTANCE_TO_DECK', instanceId });

export type RemoveCardInstanceFromDeck = { type: 'REMOVE_CARD_INSTANCE_FROM_DECK', instanceId: string };
export const removeCardInstanceFromDeck = (instanceId: string): RemoveCardInstanceFromDeck => ({ type: 'REMOVE_CARD_INSTANCE_FROM_DECK', instanceId });

export type CacheCard = { type: 'CACHE_CARD', cardName: string, cardData: ?$Shape<CardData> };
export const cacheCard = (cardName: string, cardData: ?$Shape<CardData>): CacheCard => ({ type: 'CACHE_CARD', cardName, cardData });

export type SetFilters = { type: 'SET_FILTERS', filters: Filters };
export const setFilters = (filters: Filters): SetFilters => ({ type: 'SET_FILTERS', filters });

export type SetSorting = { type: 'SET_SORTING', by: SortBy, direction: SortDirection };
export const setSorting = (by: SortBy, direction: SortDirection): SetSorting => ({ type: 'SET_SORTING', by, direction });

export type Action = AddCardToPool | AddCardInstanceToDeck | RemoveCardInstanceFromDeck | CacheCard | SetFilters;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'ADD_CARD_TO_POOL': return update(state, {
      pools: {
        [state.currentPoolId]: {
          cards: { $merge: { [uuidv4()]: action.cardName } },
        },
      },
    });
    case 'ADD_CARD_INSTANCE_TO_DECK': return update(state, {
      pools: {
        [state.currentPoolId]: {
          decks: {
            [state.currentDeckId]: {
              cardInstanceIds: { $merge: { [action.instanceId]: {} } },
            },
          },
        },
      },
    });
    case 'REMOVE_CARD_INSTANCE_FROM_DECK': return update(state, {
      pools: {
        [state.currentPoolId]: {
          decks: {
            [state.currentDeckId]: {
              cardInstanceIds: { $unset: [action.instanceId] },
            },
          },
        },
      },
    });
    case 'CACHE_CARD': return update(state, {
      cardCache: { $merge: { [action.cardName]: action.cardData } },
    });
    case 'SET_FILTERS': return update(state, {
      filters: { $merge: { ...action.filters } },
    });
    case 'SET_SORTING': return update(state, {
      sorting: {
        by: { $set: action.by },
        direction: { $set: action.direction },
      },
    });
    default: return state;
  }
};
