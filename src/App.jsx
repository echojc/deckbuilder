// @flow

import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router';
import propTypes from 'prop-types';

import Explorer from './Explorer';
import Card from './Card';
import CardSearch from './CardSearch';
import './App.css';

import type { GlobalState } from './state';
import type { CardData } from './saga';

type Props = {
  cardCache: { [name: string]: $Shape<CardData> },
};

class Main extends Component<Props> {
  render() {
    const { cardCache } = this.props;
    return (
      <Explorer history={this.props.history} itemWidth={146} itemHeight={204} minGutterWidth={16} gutterHeight={16}>
        {Object.keys(cardCache).map(name => <Card key={name} card={cardCache[name]} size="small" />)}
      </Explorer>
    );
  }
}

const MainC = connect(
  (state: GlobalState) => ({
    cardCache: state.cardCache,
  }),
)(Main);

class AnimRoute extends Component<*, *> {
  timeout = null;
  state = {
    previousLocation: null,
  };

  static contextTypes = {
    router: propTypes.object,
  };

  componentWillReceiveProps(_, nextContext) {
    if (nextContext.router.route.location.pathname.indexOf(this.context.router.route.location.pathname) === 0) {
      // moving from parent to child
      console.log('parent -> child');
    } else if (this.context.router.route.location.pathname.indexOf(nextContext.router.route.location.pathname) === 0) {
      // moving from child to parent
      console.log('child -> parent');
      this.setState({ previousLocation: this.context.router.route.location });
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ previousLocation: null });
        this.timeout = null;
      }, 300);
    }
  }

  render() {
    return <Route {...this.props} location={this.state.previousLocation || this.context.router.route.location} />;
  }
}

const App = ({ history, cardCache }: Props) =>
  <Router history={history}>
    <div className="App">
      <AnimRoute path="/" component={MainC} />
      <AnimRoute path="/search" component={CardSearch} />
    </div>
  </Router>
;

export default hot(module)(App);
