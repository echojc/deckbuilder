// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setSorting } from './state';
import type { GlobalState, Sort, SortBy, SortDirection } from './state';

type Props = {
  sorting: Sort,
  setSorting: (by: SortBy, direction: SortDirection) => void,
};

const Sorting = ({ sorting, setSorting }: Props) =>
  <div className="Sorting">
    Sorting:
    <select value={sorting.by} onChange={e => setSorting(e.target.value, sorting.direction)}>
      <option>name</option>
      <option>cmc</option>
      <option>power</option>
      <option>toughness</option>
      <option>rarity</option>
    </select>
    <select value={sorting.direction} onChange={e => setSorting(sorting.by, e.target.value)}>
      <option>asc</option>
      <option>desc</option>
    </select>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    sorting: state.sorting,
  }),
  (dispatch) => ({
    setSorting: (by: SortBy, direction: SortDirection) => dispatch(setSorting(by, direction)),
  }),
)(Sorting);
