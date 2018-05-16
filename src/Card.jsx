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
  >
    <div><strong>{card.name}</strong></div>
    <div>{card.manaCost}</div>
    <div>{card.typeLine}</div>
    <div className="Card-text">
      {card.oracleText && card.oracleText.split('\n').map((line, i) => <p key={i}>{line}</p>)}
    </div>
    {card.power && card.toughness && <div>{card.power} / {card.toughness}</div>}
    <div
      className="Card-art"
      style={{ backgroundImage: `url(${card.imageUris && card.imageUris[size]})` }}
    />
  </div>
;

export default connect(
  null,
  (dispatch) => ({
    setPreviewCardName: (cardName: ?string) => dispatch(setPreviewCardName(cardName)),
  }),
)(Card);
