// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPreviewCardName } from './state';
import './Card.css';

import type { CardData } from './saga';

type Props = {
  card: $Shape<CardData>,
  size: 'small' | 'normal',
  setPreviewCardName: (cardName: ?string) => void,
};

const Card = ({ card, size, setPreviewCardName }: Props) =>
  <div
    className={`Card Card-${size}`}
    onMouseEnter={() => setPreviewCardName(card.name)}
    onMouseLeave={() => setPreviewCardName(null)}
  >
    <div>{card.name}</div>
    <div>{card.manaCost}</div>
    <div>{card.typeLine}</div>
    <div>{card.oracleText}</div>
    <div>{card.power}/{card.toughness}</div>
    <img className="Card-art" src={card.imageUris && card.imageUris[size]} />
  </div>
;

export default connect(
  null,
  (dispatch) => ({
    setPreviewCardName: (cardName: ?string) => dispatch(setPreviewCardName(cardName)),
  }),
)(Card);
