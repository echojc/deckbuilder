// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Preview.css';

import type { GlobalState } from './state';

type Props = {
};

const Preview = ({}: Props) =>
  <div className="Preview">
    Preview:
    <div className="Preview-card">
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
  }),
)(Preview);
