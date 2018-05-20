// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import Pool from './Pool';
import Deck from './Deck';
import Filter from './Filter';
import Sorting from './Sorting';
import Preview from './Preview';
import Changelog from './Changelog';
import './App.css';

import type { GlobalState } from './state';

type Props = {
  isOffline: boolean,
};

const App = ({ isOffline }: Props) =>
  <div className="App">
    {isOffline && <div className="App-offline">Offline</div>}
    <Filter />
    <Sorting />
    <div className="App-workspace">
      <div className="App-workspace-main">
        <Pool />
        <Deck />
        <Changelog />
      </div>
      <Preview />
    </div>
  </div>
;

export default hot(module)(connect(
  (state: GlobalState) => ({
    isOffline: state.isOffline,
  }),
)(App));
