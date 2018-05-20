// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deckCardsGroupedByLandCmc } from './selector';
import { removeCardInstanceFromDeck, setSplitCreatures } from './state';
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
  isSplitCreatures: boolean,
  removeCardInstanceFromDeck: (name: string) => void,
  setSplitCreatures: (value: boolean) => void,
};

function isType(cardInstance: CardDataInstance, type: string): boolean {
  return (cardInstance.card.typeLine || '').includes(type);
}
function isCreature(cardInstance: CardDataInstance): boolean {
  return isType(cardInstance, 'Creature');
}
function isNonCreature(cardInstance: CardDataInstance): boolean {
  return !isCreature(cardInstance);
}

class Deck extends Component<Props> {
  renderCardGroup = (groupName: string, filter: (card: CardDataInstance) => boolean = () => true) => (
    <div key={groupName} className="Deck-card-group">
      {this.props.deckCardsGrouped[groupName].filter(filter).map(cardInstance => (
        <div
          key={cardInstance.instanceId}
          className="Deck-card"
          onClick={() => this.props.removeCardInstanceFromDeck(cardInstance.instanceId)}
        >
          <Card card={cardInstance.card} size="small" />
          {/* partially block out the card if NOT highlighting its card type */}
          <div
            className="Deck-card-overlay"
            style={{ opacity: this.props.highlightCardType && !isType(cardInstance, this.props.highlightCardType) ? 0.5 : 0 }}
          />
        </div>
      ))}
    </div>
  );

  render() {
    const cardGroupOrder = Object.keys(this.props.deckCardsGrouped).filter(_ => _ !== 'land').sort();
    const splitGroupFilters = this.props.isSplitCreatures
      ? [isCreature, isNonCreature]
      : [() => true];
    return (
      <div className="Deck">
        Deck
        <DeckPicker />
        <DeckCounts />
        <label>
          <input
            type="checkbox"
            checked={this.props.isSplitCreatures}
            onChange={() => this.props.setSplitCreatures(!this.props.isSplitCreatures) }
          />
          Split creatures
        </label>
        <Exporter />
        <div className="Deck-cards">
          {this.props.deckCardsGrouped['land'] && this.renderCardGroup('land')}
          <div className="Deck-nonlands">
            {splitGroupFilters.map(filter => (
              <div key={filter.name} className="Deck-split">
                {cardGroupOrder.map(groupName => this.renderCardGroup(groupName, filter))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: GlobalState) => ({
    deckCardsGrouped: deckCardsGroupedByLandCmc(state),
    highlightCardType: state.highlightCardType,
    isSplitCreatures: state.isSplitCreatures,
  }),
  (dispatch) => ({
    removeCardInstanceFromDeck: (name: string) => dispatch(removeCardInstanceFromDeck(name)),
    setSplitCreatures: (value: boolean) => dispatch(setSplitCreatures(value)),
  }),
)(Deck);
