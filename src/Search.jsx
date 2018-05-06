// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as scry from './scry';
import debounce from 'debounce';
import { addCardToPool } from './state';

type Props = {
  addCardToPool: (name: string) => void;
};

type State = {
  searchValue: string,
  autocompleteResults: string[],
};

class Search extends Component<Props, State> {
  state = {
    searchValue: '',
    autocompleteResults: [],
  };

  searchOrSelect = (value) => {
    if (this.state.autocompleteResults.includes(value)) {
      this.setState({ searchValue: '' });
      this.props.addCardToPool(value);
    } else {
      this.setState({ searchValue: value });
      this.search(value);
    }
  };

  search = debounce(
    async (partial) => this.setState({ autocompleteResults: await scry.autocomplete(partial) }),
    250,
  );

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
          {this.state.autocompleteResults.map(n => <option key={n}>{n}</option>)}
        </datalist>
      </div>
    );
  }
}

export default connect(
  null,
  (dispatch) => ({
    addCardToPool: (name: string) => dispatch(addCardToPool(name)),
  }),
)(Search);
