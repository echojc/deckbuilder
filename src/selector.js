// @flow

import { createSelector } from 'reselect';
//import type { GlobalState } from './state';

const pool = state => state.pool;
const cardCache = state => state.cardCache;

export const poolCards = createSelector(
  [pool, cardCache],
  (pool, cardCache) => pool.map(name => cardCache[name] || {}),
);

export const poolCmcs = createSelector(
  [poolCards],
  (poolCards) => {
    const cmcs = {};
    poolCards.forEach(_ => cmcs[_.cmc] = true);
    return Object.keys(cmcs).sort();
  },
);
