// @flow

import React, { Component } from 'react';
import cn from 'classnames';

import './TypeAhead.css';

type Props = {
  className?: string,
  value: string,
  onChange: (v: string) => void,
  onEnter?: () => void,
  placeholder?: string,
  suggestedEnding?: ?string,
};

const TypeAhead = ({ className, value, onChange, onEnter, placeholder, suggestedEnding }: Props) =>
  <div className={cn('TypeAhead', className)}>
    <div className="TypeAhead-shadow">
      <span className="TypeAhead-spacer">{value.replace(/\s/g, '\u00a0')}</span>
      {suggestedEnding && <span>{suggestedEnding}</span>}
    </div>
    <input
      className="TypeAhead-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => onEnter && e.key === 'Enter' && onEnter()}
    />
  </div>
;

export default TypeAhead;
