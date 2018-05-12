// @flow

import { takeEvery, select, put, call, all } from 'redux-saga/effects';
import { autocompleteResult, cacheCard, setOffline } from './state';
import * as scry from './scry';
import type { AutocompleteRequest, CacheCard } from './state';

export type CardData = {
  _version: number,
  id: string,
  name: string,
  manaCost: string,
  cmc: number,
  typeLine: string,
  oracleText: string,
  power: string, // can be "*"
  toughness: string, // can be "*"
  rarity: string,
  colors: string,
  imageUris: {
    small: string,
    normal: string,
  },
};

const CACHE_VERSION = 0;

function extractCardData(card: any): CardData {
  return {
    _version: CACHE_VERSION,
    id: card.id,
    name: card.name,
    manaCost: card.mana_cost,
    cmc: card.cmc,
    typeLine: card.type_line,
    oracleText: card.oracle_text,
    power: card.power,
    toughness: card.toughness,
    rarity: card.rarity,
    colors: card.colors,
    imageUris: {
      small: card.image_uris.small,
      normal: card.image_uris.normal,
    },
  };
}

function* ensureCached(localStorage, action: CacheCard): any {
  const { cardName } = action;
  const existing = yield select(_ => _.cardCache[cardName]);
  if (existing && existing._version === CACHE_VERSION) {
    return;
  }

  // check local storage first
  try {
    const storedData = yield call([localStorage, 'getItem'], cardName);
    const cardData = JSON.parse(storedData);
    if (cardData && cardData._version === CACHE_VERSION) {
      yield put(cacheCard(cardName, cardData));
      return;
    }
  } catch (e) {
    console.group('ensureCached - save card data');
    console.error(e);
    console.groupEnd();
  }

  // not available in local storage, download from scryfall
  const isOffline = yield select(_ => _.isOffline);
  try {
    // placeholder for loading
    yield put(cacheCard(cardName, { name: cardName }));

    let response;
    try {
      response = yield call(scry.named, cardName);
      if (isOffline) {
        yield put(setOffline(false));
      }
    } catch (e) {
      if (!isOffline) {
        yield put(setOffline(true));
      }
      throw e;
    }

    const cardData = extractCardData(response);
    // save to local storage for future
    yield call([localStorage, 'setItem'], cardName, JSON.stringify(cardData));
    yield put(cacheCard(cardName, cardData));
  } catch (e) {
    if (!isOffline) {
      console.group('ensureCached - scry');
      console.error(e);
      console.groupEnd();
    }
  }
}

function* autocomplete(localStorage, action: AutocompleteRequest): any {
  // reset if request is too short
  if (!action.partial || action.partial.length < 2) {
    yield put(autocompleteResult([]));
    return;
  }

  // normalize to lower case for internal usage
  const partial = action.partial.toLowerCase();

  const isOffline = yield select(_ => _.isOffline);
  try {
    // fetch online results
    const results = yield call(scry.autocomplete, partial);
    if (isOffline) {
      yield put(setOffline(true));
    }

    // try save to known cards in local storage (for offline)
    try {
      const groupedByInitialLetters = {};
      for (const name of results) {
        const initialLetters = name.slice(0, 2).toLowerCase();
        if (groupedByInitialLetters[initialLetters]) {
          groupedByInitialLetters[initialLetters][name] = 0;
        } else {
          groupedByInitialLetters[initialLetters] = { [name]: 0 };
        }
      }
      for (const initialLetters of Object.keys(groupedByInitialLetters)) {
        const keyName = `names/${initialLetters}`;
        // get existing card names and merge
        const knownCards = JSON.parse(yield call([localStorage, 'getItem'], keyName)) || {};
        const mergedCards = { ...knownCards, ...groupedByInitialLetters[initialLetters] };
        yield call([localStorage, 'setItem'], keyName, JSON.stringify(mergedCards));
      }
    } catch (e) {
      console.group('autocomplete - save known cards');
      console.error(e);
      console.groupEnd();
    }

    // save to state
    yield put(autocompleteResult(results));
  } catch (e) {
    if (!isOffline) {
      console.group('autocomplete - scry');
      console.error(e);
      console.groupEnd();
      yield put(setOffline(true));
    }

    // failed to retrieve online, fallback to known cards
    try {
      const initialLetters = partial.slice(0, 2);
      const keyName = `names/${initialLetters}`;
      const knownCards = JSON.parse(yield call([localStorage, 'getItem'], keyName)) || {};
      const offlineResults = Object.keys(knownCards).filter(_ => _.toLowerCase().startsWith(partial));
      yield put(autocompleteResult(offlineResults));
    } catch (e) {
      console.group('autocomplete - retrieve known cards');
      console.error(e);
      console.groupEnd();
      yield put(autocompleteResult([]));
    }
  }
}

export default function*(): any {
  yield all([
    takeEvery(['ADD_CARD_TO_POOL'], ensureCached, window.localStorage),
    takeEvery(['AUTOCOMPLETE_REQUEST'], autocomplete, window.localStorage),
  ]);
}
