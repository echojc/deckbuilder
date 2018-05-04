// @flow

import { takeEvery, select, put } from 'redux-saga/effects';
import { cacheCard } from './state';
import * as scry from './scry';

function* ensureCached(action) {
  const { name } = action;
  const existing = yield select(_ => _.cardCache[name]);
  if (existing) {
    return;
  }

  // placeholder for loading
  yield put(cacheCard(name, {}));
  // update when we have a result
  try {
    const cardData = yield scry.named(name);
    yield put(cacheCard(name, cardData));
  } catch (e) {
    yield put(cacheCard(name, null));
  }
}

export default function*() {
  yield takeEvery(['ADD_CARD_TO_POOL'], ensureCached);
}
