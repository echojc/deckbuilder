// @flow

import React, { Component } from 'react';
import Card from './Card';
import './Pool.css';

type Props = {
  cards: string[],
};

export default ({ cards }: Props) =>
  <div className="Pool">
    {cards.map(name => <Card key={name} name={name} />)}
  </div>
;
