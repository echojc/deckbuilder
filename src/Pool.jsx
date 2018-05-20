// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { poolCards, filteredPoolCards } from './selector';
import { addCardInstanceToDeck, removeCardInstanceFromPool } from './state';
import PoolPicker from './PoolPicker';
import Search from './Search';
import Card from './Card';
import './Pool.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  poolSize: number,
  filteredPool: CardDataInstance[],
  addCardInstanceToDeck: (instanceId: string) => void,
  removeCardInstanceFromPool: (instanceId: string) => void,
};

const Pool = ({ poolSize, filteredPool, addCardInstanceToDeck, removeCardInstanceFromPool }: Props) =>
  <div className="Pool">
    Pool
    <PoolPicker />
    <Search />
    (showing {filteredPool.length} of {poolSize}):
    <div className="Pool-cards">
      {filteredPool.map(card => (
        <div
          key={card.instanceId}
          className="Pool-card"
          onClick={() => addCardInstanceToDeck(card.instanceId)}
        >
          <Card card={card.card} size="small" />
          <div
            className="Pool-card-delete"
            onClick={e => { removeCardInstanceFromPool(card.instanceId); e.stopPropagation(); }}
          />
        </div>
      ))}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    poolSize: poolCards(state).length,
    filteredPool: filteredPoolCards(state),
  }),
  (dispatch) => ({
    addCardInstanceToDeck: (instanceId: string) => dispatch(addCardInstanceToDeck(instanceId)),
    removeCardInstanceFromPool: (instanceId: string) => dispatch(removeCardInstanceFromPool(instanceId)),
  }),
)(Pool);
