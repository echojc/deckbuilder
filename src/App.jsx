// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import Pool from './Pool';
import Deck from './Deck';
import Search from './Search';
import Filter from './Filter';
import Sorting from './Sorting';
import './App.css';

import type { GlobalState } from './state';

type Props = {
  isOffline: boolean,
};

const App = ({ isOffline }: Props) =>
  <div className="App">
    {isOffline && <div className="App-offline">Offline</div>}
    <Search />
    <Filter />
    <Sorting />
    <Pool />
    <Deck />
  </div>
;

export default hot(module)(connect(
  (state: GlobalState) => ({
    isOffline: state.isOffline,
  }),
)(App));
