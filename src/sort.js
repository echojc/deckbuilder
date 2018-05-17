// @flow

import type { CardDataInstance } from './selector';
import type { Sort } from './state';

type SortingFunc = (a: CardDataInstance, b: CardDataInstance) => number;

const rarityOrder = {
  common: 0,
  uncommon: 1,
  rare: 2,
  mythic: 3,
};

const sortingFuncs: { [by: string]: { asc: SortingFunc, desc: SortingFunc } } = {
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

export function sortComparator(sorting: Sort, sortingThenBys: Sort[]): SortingFunc {
  return (a: CardDataInstance, b: CardDataInstance): number => {
    const result = sortingFuncs[sorting.by][sorting.direction](a, b);
    if (result !== 0 || sortingThenBys.length === 0) {
      return result;
    } else {
      return sortComparator(sortingThenBys[0], sortingThenBys.slice(1))(a, b);
    }
  };
}
