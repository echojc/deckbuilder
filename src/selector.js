// @flow

import { createSelector } from 'reselect';
import type { CardData } from './saga';
//import type { GlobalState } from './state';

const pools = state => state.pools;
const currentPoolId = state => state.currentPoolId;
const currentDeckId = state => state.currentDeckId;
const cardCache = state => state.cardCache;
const filters = state => state.filters;

const pool = createSelector(
  [pools, currentPoolId],
  (pools, currentPoolId) => pools[currentPoolId] || {},
);

const deck = createSelector(
  [pool, currentDeckId],
  (pool, currentDeckId) => pool.decks[currentDeckId] || {},
);

export type CardDataInstance = {
  instanceId: string,
  card: CardData,
};

export const deckCards = createSelector(
  [deck, cardCache],
  (deck, cardCache) => (deck.cards || []).map(instance => ({
    instanceId: instance.instanceId,
    card: cardCache[instance.cardName] || { name: instance.cardName },
  }))
);

export const poolCards = createSelector(
  [pool, cardCache],
  (pool, cardCache) => (pool.cards || []).map(instance => ({
    instanceId: instance.instanceId,
    card: cardCache[instance.cardName] || { name: instance.cardName },
  }))
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

export const poolCardsCmcs = createSelector(
  [poolCards],
  (poolCards) => {
    const cmcs = {};
    poolCards.forEach(_ => cmcs[_.cmc] = true);
    return Object.keys(cmcs).sort();
  },
);
