// @flow

import { takeEvery, select, put, call } from 'redux-saga/effects';
import { cacheCard } from './state';
import * as scry from './scry';
import type { CacheCard } from './state';

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
    console.error(e);
  }

  // not available in local storage, download from scryfall
  try {
    // placeholder for loading
    yield put(cacheCard(cardName, { name: cardName }));
    const cardData = extractCardData(yield scry.named(cardName));
    // save to local storage for future
    yield call([localStorage, 'setItem'], cardName, JSON.stringify(cardData));
    yield put(cacheCard(cardName, cardData));
  } catch (e) {
    console.error(e);
    yield put(cacheCard(cardName, null));
  }
}

export default function*(): any {
  yield takeEvery(['ADD_CARD_TO_POOL'], ensureCached, window.localStorage);
}
