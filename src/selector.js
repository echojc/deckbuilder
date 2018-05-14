// @flow

import { createSelector } from 'reselect';
import { toCockatriceFormat, asDataUrl } from './export';
import type { CardData } from './saga';
//import type { GlobalState } from './state';

const pools = state => state.pools;
const currentPoolId = state => state.currentPoolId;
const currentDeckId = state => state.currentDeckId;
const cardCache = state => state.cardCache;
const filters = state => state.filters;
const sorting = state => state.sorting;
const previewCardName = state => state.previewCardName;

const pool = createSelector(
  [pools, currentPoolId],
  (pools, currentPoolId) => pools[currentPoolId] || {},
);

export const deck = createSelector(
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
  (deck, pool, cardCache) =>
    Object.keys(deck.cardInstanceIds || {})
      .map(instanceId => ({
        instanceId,
        card: cardCache[(pool.cards || {})[instanceId]],
      }))
      .filter(_ => _.card)
);

export const deckCardsByCmcSorted = createSelector(
  [deckCards],
  (deckCards) => {
    const result = {};
    // group by cmc
    for (const cardInstance of deckCards) {
      if (result[cardInstance.card.cmc]) {
        result[cardInstance.card.cmc].push(cardInstance);
      } else {
        result[cardInstance.card.cmc] = [cardInstance];
      }
    }
    // sort by name
    Object.keys(result).forEach(_ => result[_].sort((a, b) => a.card.name.localeCompare(b.card.name)));
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
const sortingFuncs: { [by: string]: { asc: (a: CardDataInstance, b: CardDataInstance) => number, desc: (a: CardDataInstance, b: CardDataInstance) => number } } = {
  name: {
    asc: (a, b) => a.card.name.localeCompare(b.card.name),
    desc: (a, b) => b.card.name.localeCompare(a.card.name),
  },
  cmc: {
    asc: (a, b) => a.card.cmc - b.card.cmc,
    desc: (a, b) => b.card.cmc - a.card.cmc,
  },
  power: {
    asc: (a, b) => (parseInt(a.card.power, 10) || 0) - (parseInt(b.card.power, 10) || 0),
    desc: (a, b) => (parseInt(b.card.power, 10) || 0) - (parseInt(a.card.power, 10) || 0),
  },
  toughness: {
    asc: (a, b) => (parseInt(a.card.toughness, 10) || 0) - (parseInt(b.card.toughness, 10) || 0),
    desc: (a, b) => (parseInt(b.card.toughness, 10) || 0) - (parseInt(a.card.toughness, 10) || 0),
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
      if (filters.color === 'colorless') {
        cards = cards.filter(_ => _.card.colors.length === 0);
      } else {
        cards = cards.filter(_ => _.card.colors.includes(filters.color));
      }
    }
    if (filters.type != null) {
      cards = cards.filter(_ => _.card.typeLine && _.card.typeLine.includes(filters.type));
    }
    if (filters.text) {
      const lowered = filters.text.toLowerCase();
      cards = cards.filter(_ => _.card.oracleText && _.card.oracleText.toLowerCase().includes(lowered));
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
    poolCards.forEach(_ => {
      if (!_.card.colors) return;
      if (_.card.colors.length === 0) {
        result['colorless'] = true;
      } else {
        _.card.colors.forEach(color => result[color] = true);
      }
    });
    return Object.keys(result).sort();
  },
);

export const poolCardsTypes = createSelector(
  [poolCards],
  (poolCards) => {
    const result = {};
    poolCards.forEach(_ => {
      if (!_.card.typeLine) return;
      const types = _.card.typeLine.split('—')[0].split(/\s/).filter(_ => _.length);
      types.forEach(type => result[type] = true);
    });
    return Object.keys(result).sort();
  },
);

export const exportCockatriceFormatBase64 = createSelector(
  [deck, deckCards],
  (deck, deckCards) => asDataUrl('text/xml', toCockatriceFormat(deck.name, deckCards.map(_ => _.card.name))),
);

export const previewCard = createSelector(
  [previewCardName, cardCache],
  (previewCardName, cardCache) => previewCardName && (cardCache[previewCardName] || { name: previewCardName }),
);
