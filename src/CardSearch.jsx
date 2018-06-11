// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import debounce from './debounce';

import TypeAhead from './TypeAhead';
import { IconBack, IconPlus } from './svg';
import './CardSearch.css';

import { autocompleteRequest } from './state';
import type { GlobalState } from './state';

type Props = {
  autocompleteResults: string[],
  autocompleteRequest: (partial: string) => void,
  isSearching: boolean,
};

type State = {
  input: string,
};

class CardSearch extends Component<Props, State> {
  state: State = {
    input: '',
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

  hasNoResults = () => {
    const { isSearching, autocompleteResults } = this.props;
    const { input } = this.state;
    return !isSearching && !this.search.isQueued() && input.length >= 2 && autocompleteResults.length === 0;
  }

  render() {
    return (
      <div className="CardSearch">
        <div className="CardSearch-header">
          <IconBack
            className="CardSearch-back"
            onClick={() => {/*TODO*/}}
          />

          <TypeAhead
            className="CardSearch-typeahead"
            value={this.state.input}
            onChange={input => { this.setState({ input }); this.search(input); }}
            placeholder="Enter the name of a card"
            suggestedEnding={this.suggestedEnding()}
          />

          <div
            className={cn('CardSearch-helptext', {
              show: this.suggestedEnding() != null,
            })}
          >Press ⏎ or</div>

          <IconPlus
            className="CardSearch-add"
            onClick={() => {/*TODO*/}}
          />
        </div>

        <div className="CardSearch-results">
          {this.hasNoResults() && (
            <div className="CardSearch-noresults">
              No cards with that name found.<br />
              Double check your spelling and make sure you're searching for the name of a card.
            </div>
          )}

          {this.state.input.length >= 2 && this.props.autocompleteResults.map(cardName => (
            <div
              className="CardSearch-result"
              key={cardName}
              onClick={() => {/*TODO*/}}
            >
              <span className="CardSearch-result-primary">{cardName}</span>
              <span className="CardSearch-result-secondary"></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: GlobalState) => ({
    autocompleteResults: state.autocompleteResults,
    isSearching: state.flags.isSearching,
  }),
  (dispatch) => ({
    autocompleteRequest: (partial: string) => dispatch(autocompleteRequest(partial)),
  }),
)(CardSearch);
