// @flow

import update from 'immutability-helper';

// migrates saved state to newer versions
// remember _NOT_ to put `break` at the end of each case!
export function migrateState(initialState: any) {
  let state = initialState;
  switch (state._version) {
    // changed filters to accept arrays instead of single inputs
    case undefined:
    case null:
    case 0:
      state = update(state, {
        filters: { $set: {
          cmcs: state.filters.cmc ? [state.filters.cmc.toString()] : [],
          colors: state.filters.color ? [state.filters.color] : [],
          types: state.filters.type ? [state.filters.type] : [],
          text: state.filters.text || '',
        }},
      });
  }
  return state;
}
