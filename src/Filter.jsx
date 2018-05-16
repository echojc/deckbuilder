// @flow

import React from 'react';
import { connect } from 'react-redux';
import { poolCardsCmcs, poolCardsColors, poolCardsTypes } from './selector';
import { setFilters, defaultFilters } from './state';
import type { GlobalState, Filters } from './state';
import './Filter.css';

type Props = {
  setFilters: (filters: $Shape<Filters>) => void,
  filters: Filters,
  poolCardsCmcs: string[],
  poolCardsColors: string[],
  poolCardsTypes: string[],
};

// nothing selected is display visually the same as everything selected, but the original internal state is preserved
// this leads to 2 behaviours when visually clicking an option with everything selected:
//   - if everything was deselected, only the selected option becomes chosen
//   - if everything was manually selected, the selected option becomes deselected
function renderCheckboxes(options: string[], selected: string[], onChange: (vs: string[]) => void): React$Node {
  return (
    <span>
      {options.map(option => (
        <label key={option}>
          <input
            type="checkbox"
            checked={selected.length === 0 || selected.includes(option)}
            onChange={() => onChange(selected.includes(option) ? selected.filter(_ => _ !== option) : selected.concat(option))}
          />
          {option}
        </label>
      ))}
    </span>
  );
}

const Filter = ({ setFilters, filters, poolCardsCmcs, poolCardsColors, poolCardsTypes }: Props) =>
  <div className="Filter">
    Filters:
    <button onClick={() => setFilters(defaultFilters)}>Reset all</button>
    <span><input placeholder="search card text..." value={filters.text} onChange={e => setFilters({ text: e.target.value })} /></span>
    <span>CMC {renderCheckboxes(poolCardsCmcs, filters.cmcs, cmcs => setFilters({ cmcs }))}</span>
    <span>Color {renderCheckboxes(poolCardsColors, filters.colors, colors => setFilters({ colors }))}</span>
    <span>Type {renderCheckboxes(poolCardsTypes, filters.types, types => setFilters({ types }))}</span>
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
    setFilters: (filters: $Shape<Filters>) => dispatch(setFilters(filters)),
  }),
)(Filter);
