// @flow

import update from 'immutability-helper';
import uuidv4 from 'uuid/v4';

import { STATE_VERSION } from './saga';
import type { CardData } from './saga';

export type Filters = {
  cmcs: string[],
  colors: string[],
  types: string[],
  text: string,
};

export const defaultFilters = {
  cmcs: [],
  colors: [],
  types: [],
  text: '',
};

export type SortBy = 'name' | 'cmc' | 'power' | 'toughness' | 'rarity';
export type SortDirection = 'asc' | 'desc';
export type Sort = {
  id: string,
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
  _version: number,
  currentPoolId: string,
  currentDeckId: string,
  filters: Filters,
  sorting: Sort,
  sortingThenBys: Sort[],
  isSplitCreatures: boolean,
  pools: { [id: string]: Pool },

  isOffline: boolean,
  cardCache: { [name: string]: $Shape<CardData> },
  autocompleteResults: string[],
  previewCardName: ?string,
  highlightCardType: ?string,
};

const defaultState: GlobalState = {
  _version: STATE_VERSION,
  currentPoolId: 'default',
  currentDeckId: 'default',
  filters: defaultFilters,
  sorting: {
    id: 'root',
    by: 'name',
    direction: 'asc',
  },
  sortingThenBys: [],
  isSplitCreatures: false,
  pools: {
    default: newPool('default', 'default'),
  },

  isOffline: false,
  cardCache: {},
  autocompleteResults: [],
  previewCardName: null,
  highlightCardType: null,
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

export type SetFilters = { type: 'SET_FILTERS', filters: $Shape<Filters> };
export const setFilters = (filters: $Shape<Filters>): SetFilters => ({ type: 'SET_FILTERS', filters });

export type SetSorting = { type: 'SET_SORTING', by: SortBy, direction: SortDirection, thenByIndex?: number };
export const setSorting = (by: SortBy, direction: SortDirection, thenByIndex?: number): SetSorting => ({ type: 'SET_SORTING', by, direction, thenByIndex });

export type AddSortingThenBy = { type: 'ADD_SORTING_THEN_BY', by: SortBy };
export const addSortingThenBy = (by: SortBy): AddSortingThenBy => ({ type: 'ADD_SORTING_THEN_BY', by });

export type RemoveLastSortingThenBy = { type: 'REMOVE_LAST_SORTING_THEN_BY' };
export const removeLastSortingThenBy = (): RemoveLastSortingThenBy => ({ type: 'REMOVE_LAST_SORTING_THEN_BY' });

export type AutocompleteRequest = { type: 'AUTOCOMPLETE_REQUEST', partial: string };
export const autocompleteRequest = (partial: string): AutocompleteRequest => ({ type: 'AUTOCOMPLETE_REQUEST', partial });

export type AutocompleteResult = { type: 'AUTOCOMPLETE_RESULT', results: string[] };
export const autocompleteResult = (results: string[]): AutocompleteResult => ({ type: 'AUTOCOMPLETE_RESULT', results });

export type SetCurrentPool = { type: 'SET_CURRENT_POOL', id: string };
export const setCurrentPool = (id: string): SetCurrentPool => ({ type: 'SET_CURRENT_POOL', id });

export type AddAndSwitchToPool = { type: 'ADD_AND_SWITCH_TO_POOL', name?: string };
export const addAndSwitchToPool = (name?: string): AddAndSwitchToPool => ({ type: 'ADD_AND_SWITCH_TO_POOL', name });

export type RenamePool = { type: 'RENAME_POOL', id: string, newName: string };
export const renamePool = (id: string, newName: string): RenamePool => ({ type: 'RENAME_POOL', id, newName });

export type SetCurrentDeck = { type: 'SET_CURRENT_DECK', id: string };
export const setCurrentDeck = (id: string): SetCurrentDeck => ({ type: 'SET_CURRENT_DECK', id });

export type AddAndSwitchToDeck = { type: 'ADD_AND_SWITCH_TO_DECK', name?: string };
export const addAndSwitchToDeck = (name?: string): AddAndSwitchToDeck => ({ type: 'ADD_AND_SWITCH_TO_DECK', name });

export type RenameDeck = { type: 'RENAME_DECK', id: string, newName: string };
export const renameDeck = (id: string, newName: string): RenameDeck => ({ type: 'RENAME_DECK', id, newName });

export type DuplicateDeck = { type: 'DUPLICATE_DECK', id: string };
export const duplicateDeck = (id: string): DuplicateDeck => ({ type: 'DUPLICATE_DECK', id });

export type SetPreviewCardName = { type: 'SET_PREVIEW_CARD_NAME', cardName: ?string };
export const setPreviewCardName = (cardName: ?string): SetPreviewCardName => ({ type: 'SET_PREVIEW_CARD_NAME', cardName });

export type SetHighlightCardType = { type: 'SET_HIGHLIGHT_CARD_TYPE', cardType: ?string };
export const setHighlightCardType = (cardType: ?string): SetHighlightCardType => ({ type: 'SET_HIGHLIGHT_CARD_TYPE', cardType });

export type SetSplitCreatures = { type: 'SET_SPLIT_CREATURES', value: boolean };
export const setSplitCreatures = (value: boolean): SetSplitCreatures => ({ type: 'SET_SPLIT_CREATURES', value });

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
  AddSortingThenBy |
  RemoveLastSortingThenBy |
  AutocompleteRequest |
  AutocompleteResult |
  SetCurrentPool |
  AddAndSwitchToPool |
  RenamePool |
  SetCurrentDeck |
  AddAndSwitchToDeck |
  RenameDeck |
  DuplicateDeck |
  SetPreviewCardName |
  SetHighlightCardType |
  SetSplitCreatures;
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
      filters: { $merge: action.filters },
    });
    case 'SET_SORTING': return action.thenByIndex == null
      ? update(state, {
          sorting: {
            by: { $set: action.by },
            direction: { $set: action.direction },
          },
        })
      : update(state, {
          sortingThenBys: {
            [action.thenByIndex]: {
              by: { $set: action.by },
              direction: { $set: action.direction },
            },
          },
        });
    case 'ADD_SORTING_THEN_BY': return update(state, {
      sortingThenBys: { $push: [{
        id: uuidv4(),
        by: action.by,
        direction: 'asc',
      }]},
    });
    case 'REMOVE_LAST_SORTING_THEN_BY': return update(state, {
      sortingThenBys: { $set: state.sortingThenBys.slice(0, state.sortingThenBys.length - 1) },
    });
    case 'AUTOCOMPLETE_RESULT': return update(state, {
      autocompleteResults: { $set: action.results },
    });
    case 'SET_CURRENT_POOL': return update(state, {
      currentPoolId: { $set: action.id },
      currentDeckId: { $set: Object.keys(state.pools[action.id].decks)[0] },
      filters: { $set: defaultFilters },
      previewCardName: { $set: null },
    });
    case 'ADD_AND_SWITCH_TO_POOL': {
      const newId = uuidv4();
      return update(state, {
        currentPoolId: { $set: newId },
        currentDeckId: { $set: 'default' },
        filters: { $set: defaultFilters },
        pools: { $merge: { [newId]: newPool(newId, action.name)} },
        previewCardName: { $set: null },
      });
    }
    case 'RENAME_POOL': return update(state, {
      pools: {
        [action.id]: {
          name: { $set: action.newName },
        },
      },
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
    case 'DUPLICATE_DECK': {
      const newId = uuidv4();
      const targetDeck = state.pools[state.currentPoolId].decks[action.id];
      const copiedDeck = update(targetDeck, {
        id: { $set: newId },
        name: { $set: `Copy of ${targetDeck.name}` },
      });
      return update(state, {
        currentDeckId: { $set: newId },
        pools: {
          [state.currentPoolId]: {
            decks: { $merge: { [newId]: copiedDeck } },
          },
        },
      });
    }
    case 'SET_PREVIEW_CARD_NAME': return update(state, {
      previewCardName: { $set: action.cardName },
    });
    case 'SET_HIGHLIGHT_CARD_TYPE': return update(state, {
      highlightCardType: { $set: action.cardType },
    });
    case 'SET_SPLIT_CREATURES': return update(state, {
      isSplitCreatures: { $set: action.value },
    });
    default: return state;
  }
};
