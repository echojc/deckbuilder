// @flow

import React from 'react';
import { connect } from 'react-redux';
import { poolCmcs } from './selector';
import { setFilters } from './state';
import type { GlobalState, Filters } from './state';

type Props = {
  setFilters: (filters: Filters) => void,
  filters: Filters,
  poolCmcs: number[],
};

function renderSelect(options: any[], selected: any, onSelect: (v?: string) => void): React$Node {
  return (
    <select
      value={selected || 'any'}
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

const Filter = ({ setFilters, filters, poolCmcs }: Props) =>
  <div className="Filter">
    Filters:
    CMC {renderSelect(['any', ...poolCmcs], filters.cmc, numberify(cmc => setFilters({ cmc })))}
  </div>
;

export default connect(
  (state: GlobalState) => ({
    filters: state.filters,
    poolCmcs: poolCmcs(state),
  }),
  (dispatch) => ({
    setFilters: (filters: Filters) => dispatch(setFilters(filters)),
  }),
)(Filter);
