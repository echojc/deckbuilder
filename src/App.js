// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import Pool from './Pool';
import Search from './Search';
import './App.css';

const App = () =>
  <div className="App">
    <Search />
    <Pool />
  </div>
;

export default hot(module)(App);
