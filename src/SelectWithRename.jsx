// @flow

import React, { Component } from 'react';
import './SelectWithRename.css';

type Props = {
  options: { [value: string]: string },
  value: string,
  onChange: (value: string) => void,
  onRename: (value: string, newLabel: string) => void,
};

type State = {
  isRenaming: boolean,
  inputValue: string,
};

class SelectWithRename extends Component<Props, State> {
  inputEl: ?HTMLInputElement;

  state: State = {
    isRenaming: false,
    inputValue: '',
  };

  initRename = () => {
    this.setState({ isRenaming: true, inputValue: this.props.options[this.props.value] });
    requestAnimationFrame(() => { this.inputEl && this.inputEl.select(); });
  };

  completeRename = () => {
    this.props.onRename(this.props.value, this.state.inputValue);
    this.setState({ isRenaming: false, inputValue: '' });
  };

  render() {
    return this.state.isRenaming
      ? <span className="SelectWithRename">
          <input
            ref={e => this.inputEl = e}
            value={this.state.inputValue}
            onChange={e => this.setState({ inputValue: e.target.value })}
            onKeyPress={e => e.key === 'Enter' && this.completeRename() }
          />
          [<a href="javascript:;" onClick={this.completeRename}>done</a>]
        </span>
      : <span className="SelectWithRename">
          <select value={this.props.value} onChange={e => this.props.onChange(e.target.value)}>
            {Object.entries(this.props.options).map(([value, label]) => <option key={value} value={value} label={label} />)}
          </select>
          [<a href="javascript:;" onClick={this.initRename}>rename</a>]
        </span>
    ;
  }
}

export default SelectWithRename;
