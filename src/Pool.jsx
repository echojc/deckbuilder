// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filteredPoolCards } from './selector';
import Card from './Card';
import './Pool.css';
import type { GlobalState } from './state';
import type { CardData } from './scry';

type Props = {
  filteredPool: CardData[],
};

const Pool = ({ filteredPool }: Props) =>
  <div className="Pool">
    {filteredPool.map(card => <Card key={card.name} {...card} />)}
  </div>
;

export default connect(
  (state: GlobalState) => ({
    filteredPool: filteredPoolCards(state),
  }),
)(Pool);
