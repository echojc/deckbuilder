// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filteredPoolCards } from './selector';
import { addCardInstanceToDeck } from './state';
import Card from './Card';
import './Pool.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  filteredPool: CardDataInstance[],
  addCardInstanceToDeck: (name: string) => void,
};

const Pool = ({ filteredPool, addCardInstanceToDeck }: Props) =>
  <div className="Pool">
    Pool:
    <div className="Pool-cards">
      {filteredPool.map(card => (
        <div
          key={card.instanceId}
          className="Pool-card"
          onClick={() => addCardInstanceToDeck(card.instanceId)}
        >
          <Card {...card.card} />
        </div>
      ))}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    filteredPool: filteredPoolCards(state),
  }),
  (dispatch) => ({
    addCardInstanceToDeck: (name: string) => dispatch(addCardInstanceToDeck(name)),
  }),
)(Pool);
