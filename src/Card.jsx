// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Card.css';

import type { CardData } from './scry';
import type { GlobalState } from './state';

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

export default connect(
  (state: GlobalState, props: Props) => ({
    ...(state.cardCache[props.name] || {}),
  }),
)(Card);
