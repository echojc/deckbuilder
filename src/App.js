// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import * as scry from './scry.js';
import type { Card } from './scry.js';
import debounce from 'debounce';

class App extends Component<{}, { names: string[] }> {
  state = { names: [] };

  search = debounce(async (partial) => this.setState({ names: await scry.autocomplete(partial) }), 250);

  render() {
    return (
      <div className="App">
        <input
          list="list"
          onChange={e => {
            const name = e.target.value;
            if (this.state.names.includes(name)) {
              console.log(`selected: ${name}`);
            } else {
              this.search(e.target.value);
            }
          }}
        />
        <datalist id="list">
          {this.state.names.map(n => <option key={n}>{n}</option>)}
        </datalist>
      </div>
    );
  }
}

export default hot(module)(App);
