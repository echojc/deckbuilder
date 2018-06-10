// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';

import Explorer from './Explorer';
import Card from './Card';
import CardSearch from './CardSearch';
import './App.css';

import type { GlobalState } from './state';
import type { CardData } from './saga';

type Props = {
  cardCache: { [name: string]: $Shape<CardData> },
};

const App = ({ cardCache }: Props) =>
  <div className="App">
    <Explorer itemWidth={146} itemHeight={204} minGutterWidth={16} gutterHeight={16}>
      {Object.keys(cardCache).map(name => <Card key={name} card={cardCache[name]} size="small" />)}
    </Explorer>
    <CardSearch />
  </div>
;

export default hot(module)(connect(
  (state: GlobalState) => ({
    cardCache: state.cardCache,
  }),
)(App));
