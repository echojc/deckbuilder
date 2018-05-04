// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import './App.css';
import Pool from './Pool';
import * as scry from './scry';
import debounce from 'debounce';
import { addToPool } from './state';
import type { GlobalState } from './state';

type Props = {
  pool: string[],
  addToPool: (name: string) => void;
};

type State = {
  searchValue: string,
  autocompleteResults: string[],
};

class App extends Component<Props, State> {
  state = {
    searchValue: '',
    autocompleteResults: [],
  };

  searchOrSelect = (value) => {
    if (this.state.autocompleteResults.includes(value)) {
      this.setState({ searchValue: '' });
      this.props.addToPool(value);
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
      <div className="App">
        <input
          list="list"
          value={this.state.searchValue}
          onChange={e => this.searchOrSelect(e.target.value)}
        />
        <datalist id="list">
          {this.state.autocompleteResults.map(n => <option key={n}>{n}</option>)}
        </datalist>
        <Pool cards={this.props.pool} />
      </div>
    );
  }
}

const connected = connect(
  (state: GlobalState) => ({
    pool: state.pool,
  }),
  (dispatch) => ({
    addToPool: (name: string) => dispatch(addToPool(name)),
  }),
)(App);

export default hot(module)(connected);
