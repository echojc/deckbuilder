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
  deckCounts: {
    total: number,
    creature: number,
    instant: number,
    sorcery: number,
  },
  deckByCmc: { [cmc: string]: CardDataInstance[] },
  removeCardInstanceFromDeck: (name: string) => void,
};

const Deck = ({ deckCounts, deckByCmc, removeCardInstanceFromDeck }: Props) =>
  <div className="Deck">
    Deck ({deckCounts.total}): {deckCounts.creature} creatures / {deckCounts.instant} instants / {deckCounts.sorcery} sorceries <DeckPicker />
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
    deckCounts: {
      total: deckCards(state).length,
      creature: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Creature')).length,
      instant: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Instant')).length,
      sorcery: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Sorcery')).length,
    },
    deckByCmc: deckCardsByCmc(state),
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
