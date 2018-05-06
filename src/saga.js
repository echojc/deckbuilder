// @flow

import { takeEvery, select, put } from 'redux-saga/effects';
import { cacheCard } from './state';
import * as scry from './scry';

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

function* ensureCached(action): any {
  const { name } = action;
  const existing = yield select(_ => _.cardCache[name]);
  if (existing && existing._version === CACHE_VERSION) {
    return;
  }

  // placeholder for loading
  yield put(cacheCard(name, { name }));
  // update when we have a result
  try {
    const card = yield scry.named(name);
    yield put(cacheCard(name, extractCardData(card)));
  } catch (e) {
    yield put(cacheCard(name, null));
  }
}

export default function*(): any {
  yield takeEvery(['ADD_CARD_TO_POOL'], ensureCached);
}
