// @flow

import { createSelector } from 'reselect';
import { toCockatriceFormat, asDataUrl } from './export';
import { sortComparator } from './sort';
import type { CardData } from './saga';
//import type { GlobalState } from './state';

const pools = state => state.pools;
const currentPoolId = state => state.currentPoolId;
const currentDeckId = state => state.currentDeckId;
const cardCache = state => state.cardCache;
const filters = state => state.filters;
const sorting = state => state.sorting;
const sortingThenBys = state => state.sortingThenBys;
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

export const filteredPoolCards = createSelector(
  [poolCards, filters, sorting, sortingThenBys],
  (poolCards, filters, sorting, sortingThenBys) => {
    let cards = poolCards.slice();
    if (filters.cmcs.length > 0) {
      cards = cards.filter(_ => _.card.cmc && filters.cmcs.includes(_.card.cmc.toString()));
    }
    if (filters.colors.length > 0) {
      const includeColorless = filters.colors.includes('colorless');
      cards = cards.filter(_ => {
        if (!_.card.colors) return false;
        if (_.card.colors.length === 0) {
          return includeColorless;
        } else {
          return _.card.colors.some(color => filters.colors.includes(color));
        }
      });
    }
    if (filters.types.length > 0) {
      cards = cards.filter(_ => _.card.typeLine && filters.types.some(type => _.card.typeLine.includes(type)));
    }
    if (filters.text) {
      const lowered = filters.text.toLowerCase();
      cards = cards.filter(_ => (
        (_.card.oracleText && _.card.oracleText.toLowerCase().includes(lowered)) ||
        (_.card.name && _.card.name.toLowerCase().includes(lowered))
      ));
    }
    return cards.sort(sortComparator([sorting, ...sortingThenBys]));
  },
);

export const poolCardsCmcs = createSelector(
  [poolCards],
  (poolCards) => {
    const result = {};
    poolCards.forEach(_ => {
      if (!_.card.cmc) return;
      result[_.card.cmc.toString()] = true;
    });
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
    // remove "basic" as a type
    return Object.keys(result).filter(_ => _ !== 'Basic').sort();
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
