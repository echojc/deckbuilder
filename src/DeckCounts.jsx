// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCards } from './selector';
import { setHighlightCardType } from './state';
import './DeckCounts.css';
import type { GlobalState } from './state';

type Props = {
  total: number,
  creature: number,
  instant: number,
  sorcery: number,
  enchantment: number,
  artifact: number,
  land: number,
  setHighlightCardType: (cardType: ?string) => void,
};

const Deck = ({ total, creature, instant, sorcery, enchantment, artifact, land, setHighlightCardType }: Props) =>
  <ul className="DeckCounts">
    <li>({total} cards)</li>
    {[
      { cardType: 'Creature', value: creature },
      { cardType: 'Instant', value: instant },
      { cardType: 'Sorcery', value: sorcery },
      { cardType: 'Enchantment', value: enchantment },
      { cardType: 'Artifact', value: artifact },
      { cardType: 'Land', value: land },
    ].map(({ cardType, value }) => value > 0 && (
      <li
        key={cardType}
        onMouseOver={() => setHighlightCardType(cardType)}
        onMouseLeave={() => setHighlightCardType(null)}
      >
        {value} {cardType}
      </li>
    ))}
  </ul>
;

export default connect(
  (state: GlobalState) => ({
    total: deckCards(state).length,
    creature: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Creature')).length,
    instant: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Instant')).length,
    sorcery: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Sorcery')).length,
    enchantment: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Enchantment')).length,
    artifact: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Artifact')).length,
    land: deckCards(state).filter(_ => _.card.typeLine && _.card.typeLine.includes('Land')).length,
  }),
  (dispatch) => ({
    setHighlightCardType: (cardType: ?string) => dispatch(setHighlightCardType(cardType)),
  }),
)(Deck);
