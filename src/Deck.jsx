// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCards } from './selector';
import { removeCardInstanceFromDeck } from './state';
import Card from './Card';
import DeckPicker from './DeckPicker';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deck: CardDataInstance[],
  removeCardInstanceFromDeck: (name: string) => void,
};

const Deck = ({ deck, removeCardInstanceFromDeck }: Props) =>
  <div className="Deck">
    Deck (card count: {deck.length}) <DeckPicker />
    <div className="Deck-cards">
      {deck.map(card => (
        <div
          key={card.instanceId}
          className="Deck-card"
          onClick={() => removeCardInstanceFromDeck(card.instanceId)}
        >
          <Card {...card.card} />
        </div>
      ))}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    deck: deckCards(state),
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
