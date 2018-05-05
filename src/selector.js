// @flow

import { createSelector } from 'reselect';
//import type { GlobalState } from './state';

const pool = state => state.pool;
const cardCache = state => state.cardCache;
const filters = state => state.filters;

export const poolCards = createSelector(
  [pool, cardCache],
  (pool, cardCache) => pool.map(name => cardCache[name] || {}),
);

export const filteredPoolCards = createSelector(
  [poolCards, filters],
  (poolCards, filters) => {
    let cards = poolCards;
    if (filters.cmc != null) {
      cards = cards.filter(_ => _.cmc === filters.cmc);
    }
    return cards;
  },
);

export const poolCmcs = createSelector(
  [poolCards],
  (poolCards) => {
    const cmcs = {};
    poolCards.forEach(_ => cmcs[_.cmc] = true);
    return Object.keys(cmcs).sort();
  },
);
