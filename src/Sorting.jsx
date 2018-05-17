// @flow

import React from 'react';
import { connect } from 'react-redux';
import { setSorting, addSortingThenBy, removeLastSortingThenBy } from './state';
import type { GlobalState, Sort, SortBy, SortDirection } from './state';

type Props = {
  sorting: Sort,
  sortingThenBys: Sort[],
  setSorting: (by: SortBy, direction: SortDirection, thenByIndex?: number) => void,
  addSortingThenBy: (by: SortBy) => void,
  removeLastSortingThenBy: () => void,
};

// all available sorting options
const allSortBys: SortBy[] = ['name', 'cmc', 'power', 'toughness', 'rarity'];

const Sorting = ({ sorting, sortingThenBys, setSorting, addSortingThenBy, removeLastSortingThenBy }: Props) => {
  // pull sort renderer into a function for reuse
  // it's nested here because we close over `setSorting`
  const renderSorting = (sorting: Sort, thenByIndex?: number): React$Node => (
    <span>
      <select value={sorting.by} onChange={e => setSorting(e.target.value, sorting.direction, thenByIndex)}>
        {allSortBys.map(option => <option key={option}>{option}</option>)}
      </select>
      <select value={sorting.direction} onChange={e => setSorting(sorting.by, e.target.value, thenByIndex)}>
        <option>asc</option>
        <option>desc</option>
      </select>
    </span>
  );

  // try find a useful default when adding a new sort by
  const unusedSortBy = allSortBys.find(sortBy => sortBy !== sorting.by && !sortingThenBys.some(_ => _.by  === sortBy)) || 'name';

  return (
    <div className="Sorting">
      Sorting:
      {renderSorting(sorting)}
      {sortingThenBys.map((sorting, thenByIndex) => <span key={sorting.id}>then by{renderSorting(sorting, thenByIndex)}</span>)}
      {sortingThenBys.length > 0 && <button onClick={() => removeLastSortingThenBy()}>remove</button>}
      <button onClick={() => addSortingThenBy(unusedSortBy)}>then by...</button>
    </div>
  );
};

export default connect(
  (state: GlobalState) => ({
    sorting: state.sorting,
    sortingThenBys: state.sortingThenBys,
  }),
  (dispatch) => ({
    setSorting: (by: SortBy, direction: SortDirection, thenByIndex?: number) => dispatch(setSorting(by, direction, thenByIndex)),
    addSortingThenBy: (by: SortBy) => dispatch(addSortingThenBy(by)),
    removeLastSortingThenBy: () => dispatch(removeLastSortingThenBy()),
  }),
)(Sorting);
