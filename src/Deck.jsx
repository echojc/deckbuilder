// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCards } from './selector';
import Card from './Card';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deck: CardDataInstance[],
};

const Deck = ({ deck }: Props) =>
  <div className="Deck">
    Deck:
    <div className="Deck-cards">
      {deck.map(card => <Card key={card.instanceId} {...card.card} />)}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    deck: deckCards(state),
  }),
)(Deck);
