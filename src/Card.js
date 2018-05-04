// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import type { CardData } from './scry';
import type { GlobalState } from './state';

type Props = CardData & {};

const Card = ({ name, image_uris }: Props) =>
  <div className="Card">
    <img src="image_uris" width="200" height="280" />
  </div>
;

export default connect(
  (state: GlobalState, props: Props) => ({
    // TODO reselect
    ...(state.cardCache[props.name] || {}),
  }),
)(Card);
