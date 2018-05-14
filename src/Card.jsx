// @flow

import React, { Component } from 'react';
import './Card.css';

import type { CardData } from './saga';

type Props = {
  card: $Shape<CardData>,
  size: 'small' | 'normal',
};

const Card = ({ card, size }: Props) =>
  <div className={`Card Card-${size}`}>
    <div>{card.name}</div>
    <div>{card.manaCost}</div>
    <div>{card.typeLine}</div>
    <div>{card.oracleText}</div>
    <div>{card.power}/{card.toughness}</div>
    <img className="Card-art" src={card.imageUris && card.imageUris[size]} />
  </div>
;

export default Card;
