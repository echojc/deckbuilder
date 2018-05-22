// @flow

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Portal.css';

type Props = {
  onClose?: () => void,
  children: React$Node[],
};

const portalEl = document.getElementById('portal');

class Portal extends Component<Props> {
  render() {
    if (!portalEl) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="Portal" onClick={this.props.onClose && ((e) => e.target === e.currentTarget && this.props.onClose())}>
        <div className="Portal-contents">
          {this.props.children}
        </div>
      </div>,
      portalEl,
    );
  }
}

export default Portal;
