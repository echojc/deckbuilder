// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { availablePools } from './selector';
import { setCurrentPool, addAndSwitchToPool, renamePool } from './state';
import SelectWithRename from './SelectWithRename';

import type { GlobalState } from './state';

type Props = {
  availablePools: { [id: string]: string },
  currentPoolId: string,
  setCurrentPool: (id: string) => void,
  addAndSwitchToPool: () => void,
  renamePool: (id: string, newName: string) => void,
};

const PoolPicker = ({ availablePools, currentPoolId, setCurrentPool, addAndSwitchToPool, renamePool }: Props) =>
  <span className="PoolPicker">
    <SelectWithRename
      options={availablePools}
      value={currentPoolId}
      onChange={newId => setCurrentPool(newId)}
      onRename={(id, newName) => renamePool(id, newName)}
    />
    <button onClick={() => addAndSwitchToPool() }>create new</button>
  </span>
;

export default connect(
  (state: GlobalState) => ({
    currentPoolId: state.currentPoolId,
    availablePools: availablePools(state),
  }),
  (dispatch) => ({
    setCurrentPool: (id: string) => dispatch(setCurrentPool(id)),
    addAndSwitchToPool: () => dispatch(addAndSwitchToPool()),
    renamePool: (id: string, newName: string) => dispatch(renamePool(id, newName)),
  }),
)(PoolPicker);
