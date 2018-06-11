// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import debounce from './debounce';

import TypeAhead from './TypeAhead';
import { IconBack, IconPlus, IconLoading } from './svg';
import './CardSearch.css';

import { poolCardCounts } from './selector';
import { autocompleteRequest, addCardToPool } from './state';
import type { GlobalState } from './state';

type Props = {
  autocompleteResults: string[],
  autocompleteRequest: (partial: string) => void,
  isSearching: boolean,
  poolCardCounts: { [cardName: string]: number },
};

type State = {
  input: string,
  lastAddedCard: string,
  lastAddedQuantity: number,
};

function copies(n: number): string {
  return n === 1 ? '1 copy' : `${n} copies`;
}

class CardSearch extends Component<Props, State> {
  resetLastAddedTimeout: ?number = null;

  state: State = {
    input: '',
    lastAddedCard: '',
    lastAddedQuantity: 0,
  };

  search = debounce(partial => this.props.autocompleteRequest(partial), 250);

  suggestedEnding = (): ?string => {
    const { autocompleteResults } = this.props;
    const { input } = this.state;

    const suggestion = autocompleteResults[0];
    // bail if user has typed nothing or less than 2 chars
    if (input.length < 2) return null;
    // bail if there are no results
    if (!suggestion) return null;
    // bail if best suggestion doesn't start with what the user has typed
    if (!suggestion.toLowerCase().startsWith(input.toLowerCase())) return null;

    // otherwise the suggested ending is the rest of the first suggestion
    return suggestion.substring(input.length);
  }

  hasResults = () => {
    const { isSearching, autocompleteResults } = this.props;
    const { input } = this.state;
    return !isSearching && !this.search.isQueued() && autocompleteResults.length > 1;
  }

  hasNoResults = () => {
    const { isSearching, autocompleteResults } = this.props;
    const { input } = this.state;
    return !isSearching && !this.search.isQueued() && input.length >= 2 && autocompleteResults.length === 0;
  }

  hasAddableSuggestion = () => {
    return this.suggestedEnding() != null;
  }

  addCard = (cardName: string) => {
    const { lastAddedCard, lastAddedQuantity } = this.state;
    this.setState({
      lastAddedCard: cardName,
      lastAddedQuantity: lastAddedCard === cardName ? lastAddedQuantity + 1 : 1,
    });
    this.props.addCardToPool(cardName);
    // clear the lastAddedCard after some time
    this.queueResetLastAddedTimeout();
  }

  queueResetLastAddedTimeout = () => {
    if (this.resetLastAddedTimeout !== null) {
      clearTimeout(this.resetLastAddedTimeout);
    }
    this.resetLastAddedTimeout = setTimeout(() => {
      this.setState({ lastAddedCard: '', lastAddedQuantity: 0 });
      this.resetLastAddedTimeout = null;
    }, 3000);
  }

  render() {
    return (
      <div className="CardSearch">
        <div className="CardSearch-header">
          <IconBack
            className="CardSearch-back"
            onClick={() => {/* TODO */}}
          />

          <TypeAhead
            className="CardSearch-typeahead"
            value={this.state.input}
            onChange={input => { this.setState({ input }); this.search(input); }}
            onEnter={() => this.hasAddableSuggestion() && this.addCard(this.props.autocompleteResults[0])}
            placeholder="Enter the name of a card"
            suggestedEnding={this.suggestedEnding()}
          />

          <div
            className={cn('CardSearch-helptext', {
              show: this.props.autocompleteResults.length > 0,
            })}
          >{(()=>{switch (true){
            case this.hasAddableSuggestion():
              return 'Press ⏎ or';
            case this.hasResults():
              return 'Select card below';
          }})()}</div>

          <IconPlus
            className={cn('CardSearch-add', {
              disabled: !this.hasAddableSuggestion(),
            })}
            onClick={() => this.hasAddableSuggestion() && this.addCard(this.props.autocompleteResults[0])}
          />
        </div>

        <div className="CardSearch-results">
          <IconLoading
            className={cn('CardSearch-loading', {
              show: this.props.isSearching,
            })}
          />

          {this.hasNoResults() && (
            <div className="CardSearch-noresults">
              No cards with that name found.<br />
              Double check your spelling and make sure you're searching for the name of a card.
            </div>
          )}

          <TransitionGroup>
            {this.props.autocompleteResults.map((cardName, i) => (
              <CSSTransition key={cardName} classNames="CardSearch-result" timeout={1300}>
                <div
                  className="CardSearch-result"
                  onClick={() => this.addCard(cardName)}
                  style={{ transitionDelay: `${i*0.02}s` }}
                >
                  <span className="CardSearch-result-primary">{cardName}</span>
                  <span className="CardSearch-result-secondary">
                    {this.state.lastAddedCard === cardName
                      ? `Added ${copies(this.state.lastAddedQuantity)}!`
                      : this.props.poolCardCounts[cardName] && `You have ${copies(this.props.poolCardCounts[cardName])}`
                    }
                  </span>
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: GlobalState) => ({
    autocompleteResults: state.autocompleteResults,
    isSearching: state.flags.isSearching,
    poolCardCounts: poolCardCounts(state),
  }),
  (dispatch) => ({
    autocompleteRequest: (partial: string) => dispatch(autocompleteRequest(partial)),
    addCardToPool: (name: string) => dispatch(addCardToPool(name)),
  }),
)(CardSearch);
