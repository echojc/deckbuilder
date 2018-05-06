// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filteredPoolCards } from './selector';
import Card from './Card';
import './Pool.css';
import type { GlobalState } from './state';
import type { CardData } from './saga';

type Props = {
  filteredPool: CardData[],
};

const Pool = ({ filteredPool }: Props) =>
  <div className="Pool">
    Pool:
    <div className="Pool-cards">
      {filteredPool.map(card => <Card key={card.name} {...card} />)}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    filteredPool: filteredPoolCards(state),
  }),
)(Pool);
