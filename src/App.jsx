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

const App = () =>
  <div className="App">
    <Search />
    <Filter />
    <Sorting />
    <Pool />
    <Deck />
  </div>
;

export default hot(module)(App);
