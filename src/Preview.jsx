// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from './Card';
import { previewCard } from './selector';
import './Preview.css';
import type { CardData } from './saga';
import type { GlobalState } from './state';

type Props = {
  card: ?$Shape<CardData>,
};

const Preview = ({ card }: Props) =>
  <div className="Preview">
    <div className="Preview-sticky">
      Preview:
      <div className="Preview-card">
        {card && <Card card={card} size="normal" />}
      </div>
    </div>
  </div>
;

export default connect(
  (state: GlobalState) => ({
    card: previewCard(state),
  }),
)(Preview);
