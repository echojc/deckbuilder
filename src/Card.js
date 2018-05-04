// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Card.css';

import type { CardData } from './scry';
import type { GlobalState } from './state';

type Props = CardData & {};

    //<img src="image_uris" width="200" height="280" />
const Card = ({ name, mana_cost, type_line, oracle_text, power, toughness }: Props) =>
  <div className="Card">
    <div>{name}</div>
    <div>{mana_cost}</div>
    <div>{type_line}</div>
    <div>{oracle_text}</div>
    <div>{power}/{toughness}</div>
  </div>
;

export default connect(
  (state: GlobalState, props: Props) => ({
    // TODO reselect
    ...(state.cardCache[props.name] || {}),
  }),
)(Card);
