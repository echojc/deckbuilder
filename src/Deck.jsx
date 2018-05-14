// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCards, deckCardsByCmcSorted } from './selector';
import { removeCardInstanceFromDeck } from './state';
import Card from './Card';
import DeckPicker from './DeckPicker';
import Exporter from './Exporter';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deckCounts: {
    total: number,
    creature: number,
    instant: number,
    sorcery: number,
    enchantment: number,
    artifact: number,
    land: number,
  },
  deckByCmc: { [cmc: string]: CardDataInstance[] },
  removeCardInstanceFromDeck: (name: string) => void,
};

const Deck = ({ deckCounts, deckByCmc, removeCardInstanceFromDeck }: Props) =>
  <div className="Deck">
    Deck
    <DeckPicker />
    <ul className="Deck-counts">
      <li>({deckCounts.total} cards)</li>
      {deckCounts.creature > 0 && <li>{deckCounts.creature} creatures</li>}
      {deckCounts.instant > 0 && <li>{deckCounts.instant} instants</li>}
      {deckCounts.sorcery > 0 && <li>{deckCounts.sorcery} sorceries</li>}
      {deckCounts.enchantment > 0 && <li>{deckCounts.enchantment} enchantments</li>}
      {deckCounts.artifact > 0 && <li>{deckCounts.artifact} artifacts</li>}
      {deckCounts.land > 0 && <li>{deckCounts.land} lands</li>}
    </ul>
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
      enchantment: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Enchantment')).length,
      artifact: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Artifact')).length,
      land: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Land')).length,
    },
    deckByCmc: deckCardsByCmcSorted(state),
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
