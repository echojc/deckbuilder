// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCardsGroupedByLandCmc } from './selector';
import { removeCardInstanceFromDeck } from './state';
import Card from './Card';
import DeckPicker from './DeckPicker';
import DeckCounts from './DeckCounts';
import Exporter from './Exporter';
import './Deck.css';
import type { GlobalState } from './state';
import type { CardDataInstance } from './selector';

type Props = {
  deckCardsGrouped: { [group: string]: CardDataInstance[] },
  highlightCardType: ?string,
  removeCardInstanceFromDeck: (name: string) => void,
};

class Deck extends Component<Props> {
  renderCardGroup(groupName: string) {
    const { deckCardsGrouped, highlightCardType, removeCardInstanceFromDeck } = this.props;
    return (
      <div key={groupName} className="Deck-card-group">
        {deckCardsGrouped[groupName].map(card => (
          <div
            key={card.instanceId}
            className="Deck-card"
            onClick={() => removeCardInstanceFromDeck(card.instanceId)}
          >
            <Card card={card.card} size="small" />
            {/* partially block out the card if NOT highlighting its card type */}
            <div
              className="Deck-card-overlay"
              style={{
                opacity: highlightCardType && (!card.card.typeLine || !card.card.typeLine.includes(highlightCardType)) ? 0.5 : 0,
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { deckCardsGrouped, highlightCardType, removeCardInstanceFromDeck } = this.props;
    const cardGroupOrder = Object.keys(deckCardsGrouped).filter(_ => _ !== 'land').sort();
    return (
      <div className="Deck">
        Deck
        <DeckPicker />
        <DeckCounts />
        <Exporter />
        <div className="Deck-cards">
          {deckCardsGrouped['land'] && this.renderCardGroup('land')}
          {cardGroupOrder.map(groupName => this.renderCardGroup(groupName))}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: GlobalState) => ({
    deckCardsGrouped: deckCardsGroupedByLandCmc(state),
    highlightCardType: state.highlightCardType,
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
  }),
)(Deck);
