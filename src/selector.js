// @flow

import { createSelector } from 'reselect';
import type { CardData } from './saga';
//import type { GlobalState } from './state';

const pools = state => state.pools;
const currentPoolId = state => state.currentPoolId;
const currentDeckId = state => state.currentDeckId;
const cardCache = state => state.cardCache;
const filters = state => state.filters;
const sorting = state => state.sorting;

const pool = createSelector(
  [pools, currentPoolId],
  (pools, currentPoolId) => pools[currentPoolId] || {},
);

const deck = createSelector(
  [pool, currentDeckId],
  (pool, currentDeckId) => pool.decks[currentDeckId] || {},
);

export const availableDecks = createSelector(
  [pool],
  (pool) => {
    const decks = pool.decks || {};
    const result = {};
    Object.keys(decks).forEach(deckId => result[deckId] = decks[deckId].name);
    return result;
  },
);

export type CardDataInstance = {
  instanceId: string,
  card: CardData,
};

export const deckCards = createSelector(
  [deck, pool, cardCache],
  (deck, pool, cardCache) => Object.keys(deck.cardInstanceIds || {}).map(instanceId => ({
    instanceId,
    card: cardCache[(pool.cards || {})[instanceId]] || {},
  }))
);

export const deckCardsByCmc = createSelector(
  [deckCards],
  (deckCards) => {
    const result = {};
    for (const cardInstance of deckCards) {
      if (result[cardInstance.card.cmc]) {
        result[cardInstance.card.cmc].push(cardInstance);
      } else {
        result[cardInstance.card.cmc] = [cardInstance];
      }
    }
    return result;
  },
);

export const poolCards = createSelector(
  [pool, deck, cardCache],
  (pool, deck, cardCache) =>
    Object.entries(pool.cards || {})
      .filter(([instanceId, _]) => !(deck.cardInstanceIds || {}).hasOwnProperty(instanceId))
      .map(([instanceId, cardName]) => ({
        instanceId,
        card: cardCache[cardName] || { name: cardName },
      }))
);

const rarityOrder = {
  common: 0,
  uncommon: 10,
  rare: 20,
  mythic: 30,
};
const sortingFuncs = {
  name: {
    asc: (a, b) => a.card.name.localeCompare(b.card.name),
    desc: (a, b) => b.card.name.localeCompare(a.card.name),
  },
  cmc: {
    asc: (a, b) => a.card.cmc - b.card.cmc,
    desc: (a, b) => b.card.cmc - a.card.cmc,
  },
  power: {
    asc: (a, b) => a.card.power - b.card.power,
    desc: (a, b) => b.card.power - a.card.power,
  },
  toughness: {
    asc: (a, b) => a.card.toughness - b.card.toughness,
    desc: (a, b) => b.card.toughness - a.card.toughness,
  },
  rarity: {
    asc: (a, b) => rarityOrder[a.card.rarity] - rarityOrder[b.card.rarity],
    desc: (a, b) => rarityOrder[b.card.rarity] - rarityOrder[a.card.rarity],
  },
};
export const filteredPoolCards = createSelector(
  [poolCards, filters, sorting],
  (poolCards, filters, sorting) => {
    let cards = poolCards.slice();
    if (filters.cmc != null) {
      cards = cards.filter(_ => _.card.cmc === filters.cmc);
    }
    if (filters.color != null) {
      cards = cards.filter(_ => _.card.colors.includes(filters.color));
    }
    return cards.sort(sortingFuncs[sorting.by][sorting.direction]);
  },
);

export const poolCardsCmcs = createSelector(
  [poolCards],
  (poolCards) => {
    const result = {};
    poolCards.forEach(_ => result[_.card.cmc] = true);
    return Object.keys(result).sort();
  },
);

export const poolCardsColors = createSelector(
  [poolCards],
  (poolCards) => {
    const result = {};
    poolCards.forEach(_ => (_.card.colors || []).forEach(color => result[color] = true));
    return Object.keys(result).sort();
  },
);
