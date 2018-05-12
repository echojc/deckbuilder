// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as scry from './scry';
import debounce from 'debounce';
import { addCardToPool, autocompleteRequest } from './state';
import type { GlobalState } from './state';

type Props = {
  autocompleteResults: string[],
  autocompleteRequest: (partial: string) => void,
  addCardToPool: (name: string) => void,
};

type State = {
  searchValue: string,
};

class Search extends Component<Props, State> {
  state = {
    searchValue: '',
  };

  searchOrSelect = (value) => {
    if (this.props.autocompleteResults.includes(value)) {
      this.setState({ searchValue: '' });
      this.props.addCardToPool(value);
    } else {
      this.setState({ searchValue: value });
      this.search(value);
    }
  };

  search = debounce(partial => this.props.autocompleteRequest(partial), 250);

  render() {
    return (
      <div className="Search">
        Search:
        <input
          list="list"
          value={this.state.searchValue}
          onChange={e => this.searchOrSelect(e.target.value)}
        />
        <datalist id="list">
          {this.props.autocompleteResults.map(n => <option key={n}>{n}</option>)}
        </datalist>
      </div>
    );
  }
}

export default connect(
  (state: GlobalState) => ({
    autocompleteResults: state.autocompleteResults,
  }),
  (dispatch) => ({
    autocompleteRequest: (partial: string) => dispatch(autocompleteRequest(partial)),
    addCardToPool: (name: string) => dispatch(addCardToPool(name)),
  }),
)(Search);
