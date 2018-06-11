// @flow

import React, { Component } from 'react';
import cn from 'classnames';

import './TypeAhead.css';

type Props = {
  inputRef?: (el: ?HTMLInputElement) => void,
  className?: string,
  value: string,
  onChange: (v: string) => void,
  onEnter?: () => void,
  onFocus?: () => void,
  placeholder?: string,
  suggestedEnding?: ?string,
};

const TypeAhead = ({ inputRef, className, value, onChange, onEnter, onFocus, placeholder, suggestedEnding }: Props) =>
  <div className={cn('TypeAhead', className)}>
    <div className="TypeAhead-shadow">
      <span className="TypeAhead-spacer">{value.replace(/\s/g, '\u00a0')}</span>
      {suggestedEnding && <span>{suggestedEnding}</span>}
    </div>
    <input
      ref={inputRef}
      className="TypeAhead-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyPress={e => onEnter && e.key === 'Enter' && onEnter()}
      onFocus={onFocus}
    />
  </div>
;

export default TypeAhead;
