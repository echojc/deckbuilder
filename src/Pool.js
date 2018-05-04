// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import './Pool.css';

type Props = {
  pool: string[],
};

const Pool = ({ pool }: Props) =>
  <div className="Pool">
    {pool.map(name => <Card key={name} name={name} />)}
  </div>
;

export default connect(
  (state: GlobalState) => ({
    pool: state.pool,
  }),
)(Pool);

