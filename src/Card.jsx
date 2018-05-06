// @flow

import React, { Component } from 'react';
import './Card.css';

import type { CardData } from './saga';

type Props = $Shape<CardData> & {
  name: string,
};

const Card = ({ name, manaCost, typeLine, oracleText, power, toughness, imageUris }: Props) =>
  <div className="Card">
    <div>{name}</div>
    <div>{manaCost}</div>
    <div>{typeLine}</div>
    <div>{oracleText}</div>
    <div>{power}/{toughness}</div>
    <img className="Card-art" src={imageUris && imageUris.small} />
  </div>
;

export default Card;
