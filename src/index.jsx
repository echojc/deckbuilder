// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createHashHistory } from 'history';

import App from './App';
import './index.css';
import reducer from './state';
import saga from './saga';

const devCompose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, devCompose(applyMiddleware(sagaMiddleware)));
const history = createHashHistory();

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(
    <Provider store={store}>
      <App history={history} />
    </Provider>,
    root,
  );
}

sagaMiddleware.run(saga);
store.dispatch({ type: 'LOAD_STATE' });
