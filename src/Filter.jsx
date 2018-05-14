// @flow

import React from 'react';
import { connect } from 'react-redux';
import { poolCardsCmcs, poolCardsColors, poolCardsTypes } from './selector';
import { setFilters } from './state';
import type { GlobalState, Filters } from './state';

type Props = {
  setFilters: (filters: Filters) => void,
  filters: Filters,
  poolCardsCmcs: number[],
  poolCardsColors: string[],
  poolCardsTypes: string[],
};

function renderSelect(options: any[], selected: any, onSelect: (v?: string) => void): React$Node {
  return (
    <select
      value={selected === undefined ? 'any' : selected}
      onChange={e => {
        const value = e.target.value;
        onSelect(value === 'any' ? undefined : value);
      }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function numberify(f: (v?: number) => void): (v?: string) => void {
  return (v?: string) => v ? f(parseInt(v, 10)) : f();
}

const Filter = ({ setFilters, filters, poolCardsCmcs, poolCardsColors, poolCardsTypes }: Props) =>
  <div className="Filter">
    Filters:
    CMC {renderSelect(['any', ...poolCardsCmcs], filters.cmc, numberify(cmc => setFilters({ cmc })))}
    Color {renderSelect(['any', ...poolCardsColors], filters.color, color => setFilters({ color }))}
    Type {renderSelect(['any', ...poolCardsTypes], filters.type, type => setFilters({ type }))}
    Text <input value={filters.text || ''} onChange={e => setFilters({ text: e.target.value })} />
  </div>
;

export default connect(
  (state: GlobalState) => ({
    filters: state.filters,
    poolCardsCmcs: poolCardsCmcs(state),
    poolCardsColors: poolCardsColors(state),
    poolCardsTypes: poolCardsTypes(state),
  }),
  (dispatch) => ({
    setFilters: (filters: Filters) => dispatch(setFilters(filters)),
  }),
)(Filter);
