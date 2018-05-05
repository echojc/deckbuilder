// @flow

import React from 'react';
import { connect } from 'react-redux';

type Props = {};

const Sorting = ({}: Props) =>
  <div className="Sorting">
    Sorting:
    <select>
      <option>Name</option>
      <option>CMC</option>
      <option>Power</option>
      <option>Toughness</option>
      <option>Rarity</option>
    </select>
    <select>
      <option>asc</option>
      <option>desc</option>
    </select>
  </div>
;

export default Sorting;
