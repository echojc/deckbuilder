// @flow

import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';

import type { CardData } from './saga';

export type Filters = {
  cmc?: number,
  color?: string,
  type?: string,
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
      default: newDeck('default', 'default'),
    },
  };
}

export type GlobalState = {
  isOffline: boolean,
  currentPoolId: string,
  currentDeckId: string,
  cardCache: { [name: string]: $Shape<CardData> },
  autocompleteResults: string[],
  filters: Filters,
  sorting: Sort,
  pools: { [id: string]: Pool },
};

const defaultState: GlobalState = {
  isOffline: false,
  currentPoolId: 'default',
  currentDeckId: 'default',
  cardCache: {},
  autocompleteResults: [],
  filters: {},
  sorting: {
    by: 'name',
    direction: 'asc',
  },
  pools: {
    default: newPool('default', 'default'),
  },
};

export type MergeState = { type: 'MERGE_STATE', state: $Shape<GlobalState> };
export const mergeState = (state: $Shape<GlobalState>): MergeState => ({ type: 'MERGE_STATE', state });

export type SetOffline = { type: 'SET_OFFLINE', isOffline: boolean };
export const setOffline = (isOffline: boolean): SetOffline => ({ type: 'SET_OFFLINE', isOffline });

export type AddCardToPool = { type: 'ADD_CARD_TO_POOL', cardName: string };
export const addCardToPool = (cardName: string): AddCardToPool => ({ type: 'ADD_CARD_TO_POOL', cardName });

export type RemoveCardInstanceFromPool = { type: 'REMOVE_CARD_INSTANCE_FROM_POOL', instanceId: string };
export const removeCardInstanceFromPool = (instanceId: string): RemoveCardInstanceFromPool => ({ type: 'REMOVE_CARD_INSTANCE_FROM_POOL', instanceId });

export type AddCardInstanceToDeck = { type: 'ADD_CARD_INSTANCE_TO_DECK', instanceId: string };
export const addCardInstanceToDeck = (instanceId: string): AddCardInstanceToDeck => ({ type: 'ADD_CARD_INSTANCE_TO_DECK', instanceId });

export type RemoveCardInstanceFromDeck = { type: 'REMOVE_CARD_INSTANCE_FROM_DECK', instanceId: string };
export const removeCardInstanceFromDeck = (instanceId: string): RemoveCardInstanceFromDeck => ({ type: 'REMOVE_CARD_INSTANCE_FROM_DECK', instanceId });

export type CacheCard = { type: 'CACHE_CARD', cardName: string, cardData: $Shape<CardData> };
export const cacheCard = (cardName: string, cardData: $Shape<CardData>): CacheCard => ({ type: 'CACHE_CARD', cardName, cardData });

export type SetFilters = { type: 'SET_FILTERS', filters: Filters };
export const setFilters = (filters: Filters): SetFilters => ({ type: 'SET_FILTERS', filters });

export type SetSorting = { type: 'SET_SORTING', by: SortBy, direction: SortDirection };
export const setSorting = (by: SortBy, direction: SortDirection): SetSorting => ({ type: 'SET_SORTING', by, direction });

export type AutocompleteRequest = { type: 'AUTOCOMPLETE_REQUEST', partial: string };
export const autocompleteRequest = (partial: string): AutocompleteRequest => ({ type: 'AUTOCOMPLETE_REQUEST', partial });

export type AutocompleteResult = { type: 'AUTOCOMPLETE_RESULT', results: string[] };
export const autocompleteResult = (results: string[]): AutocompleteResult => ({ type: 'AUTOCOMPLETE_RESULT', results });

export type SetCurrentDeck = { type: 'SET_CURRENT_DECK', id: string };
export const setCurrentDeck = (id: string): SetCurrentDeck => ({ type: 'SET_CURRENT_DECK', id });

export type AddAndSwitchToDeck = { type: 'ADD_AND_SWITCH_TO_DECK', name?: string };
export const addAndSwitchToDeck = (name?: string): AddAndSwitchToDeck => ({ type: 'ADD_AND_SWITCH_TO_DECK', name });

export type RenameDeck = { type: 'RENAME_DECK', id: string, newName: string };
export const renameDeck = (id: string, newName: string): RenameDeck => ({ type: 'RENAME_DECK', id, newName });

export type Action =
  MergeState |
  SetOffline |
  AddCardToPool |
  RemoveCardInstanceFromPool |
  AddCardInstanceToDeck |
  RemoveCardInstanceFromDeck |
  CacheCard |
  SetFilters |
  SetSorting |
  AutocompleteRequest |
  AutocompleteResult |
  SetCurrentDeck |
  AddAndSwitchToDeck |
  RenameDeck;
export default (state: GlobalState = defaultState, action: Action): GlobalState => {
  switch (action.type) {
    case 'MERGE_STATE': return update(state, { $merge: action.state });
    case 'SET_OFFLINE': {
      console.log('switching to', action.isOffline ? 'offline' : 'online', 'mode');
      return update(state, {
        isOffline: { $set: action.isOffline },
      });
    }
    case 'ADD_CARD_TO_POOL': return update(state, {
      pools: {
        [state.currentPoolId]: {
          cards: { $merge: { [uuidv4()]: action.cardName } },
        },
      },
    });
    case 'REMOVE_CARD_INSTANCE_FROM_POOL': return update(state, {
      pools: {
        [state.currentPoolId]: {
          cards: { $unset: [action.instanceId] },
          decks: ((action) => (decks) => {
            const result = {};
            for (const deckId of Object.keys(decks)) {
              result[deckId] = update(decks[deckId], {
                cardInstanceIds: { $unset: [action.instanceId] },
              });
            }
            return result;
          })(action),
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
    case 'AUTOCOMPLETE_RESULT': return update(state, {
      autocompleteResults: { $set: action.results },
    });
    case 'SET_CURRENT_DECK': return update(state, {
      currentDeckId: { $set: action.id },
    });
    case 'ADD_AND_SWITCH_TO_DECK': {
      const newId = uuidv4();
      return update(state, {
        currentDeckId: { $set: newId },
        pools: {
          [state.currentPoolId]: {
            decks: { $merge: { [newId]: newDeck(newId, action.name)} },
          },
        },
      });
    }
    case 'RENAME_DECK': return update(state, {
      pools: {
        [state.currentPoolId]: {
          decks: {
            [action.id]: {
              name: { $set: action.newName },
            },
          },
        },
      },
    });
    default: return state;
  }
};
