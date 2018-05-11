// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filteredPoolCards } from './selector';
import { addCardToDeck } from './state';
import Card from './Card';
import './Pool.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  filteredPool: CardDataInstance[],
  addCardToDeck: (name: string) => void,
};

const Pool = ({ filteredPool, addCardToDeck }: Props) =>
  <div className="Pool">
    Pool:
    <div className="Pool-cards">
      {filteredPool.map(card => (
        <div key={card.instanceId} onClick={() => addCardToDeck(card.card.name)}>
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
    addCardToDeck: (name: string) => dispatch(addCardToDeck(name)),
  }),
)(Pool);
