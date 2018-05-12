// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCards, deckCardsByCmc } from './selector';
import { removeCardInstanceFromDeck } from './state';
import Card from './Card';
import DeckPicker from './DeckPicker';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deckSize: number,
  deckByCmc: { [cmc: string]: CardDataInstance[] },
  removeCardInstanceFromDeck: (name: string) => void,
};

const Deck = ({ deckSize, deckByCmc, removeCardInstanceFromDeck }: Props) =>
  <div className="Deck">
    Deck (card count: {deckSize}) <DeckPicker />
    <div className="Deck-cards">
      {Object.keys(deckByCmc).map(cmc => (
        <div key={cmc} className="Deck-cards-mana">
          {deckByCmc[cmc].map(card => (
            <div
              key={card.instanceId}
              className="Deck-card"
              onClick={() => removeCardInstanceFromDeck(card.instanceId)}
            >
              <Card {...card.card} />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    deckSize: deckCards(state).length,
    deckByCmc: deckCardsByCmc(state),
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
