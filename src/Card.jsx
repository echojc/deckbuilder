// @flow

import React, { Component } from 'react';
import './Card.css';

import type { CardData } from './scry';

type Props = CardData & {};

const Card = ({ name, mana_cost, type_line, oracle_text, power, toughness, image_uris }: Props) =>
  <div className="Card">
    <div>{name}</div>
    <div>{mana_cost}</div>
    <div>{type_line}</div>
    <div>{oracle_text}</div>
    <div>{power}/{toughness}</div>
    <img className="Card-art" src={image_uris && image_uris.small} />
  </div>
;

export default Card;
