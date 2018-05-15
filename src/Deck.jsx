// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCardsByCmcSorted } from './selector';
import { removeCardInstanceFromDeck } from './state';
import Card from './Card';
import DeckPicker from './DeckPicker';
import DeckCounts from './DeckCounts';
import Exporter from './Exporter';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deckByCmc: { [cmc: string]: CardDataInstance[] },
  highlightCardType: ?string,
  removeCardInstanceFromDeck: (name: string) => void,
};

const Deck = ({ deckByCmc, highlightCardType, removeCardInstanceFromDeck }: Props) =>
  <div className="Deck">
    Deck
    <DeckPicker />
    <DeckCounts />
    <Exporter />
    <div className="Deck-cards">
      {Object.keys(deckByCmc).map(cmc => (
        <div key={cmc} className="Deck-card-group">
          {deckByCmc[cmc].map(card => (
            <div
              key={card.instanceId}
              className="Deck-card"
              onClick={() => removeCardInstanceFromDeck(card.instanceId)}
            >
              <Card card={card.card} size="small" />
              {/* partially block out the card if NOT highlighting its card type */}
              <div
                className="Deck-card-overlay"
                style={{ opacity: highlightCardType && (!card.card.typeLine || !card.card.typeLine.includes(highlightCardType)) ? 0.5 : 0}}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    deckByCmc: deckCardsByCmcSorted(state),
    highlightCardType: state.highlightCardType,
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
