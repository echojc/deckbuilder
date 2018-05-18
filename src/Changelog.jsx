// @flow

import React, { Component } from 'react';
import './Changelog.css';

type State = {
  isShow: boolean,
};

class Changelog extends Component<{}, State> {
  state: State = {
    isShow: false,
  };

  render() {
    return (
      <div className="Changelog">
        <div>
          <button onClick={() => this.setState({ isShow: !this.state.isShow })}>
            {this.state.isShow ? 'Hide' : 'Show'} changelog
          </button>
        </div>
        {this.state.isShow && <iframe className="Changelog-log" src="changelog.html" />}
      </div>
    );
  }
}

export default Changelog;
