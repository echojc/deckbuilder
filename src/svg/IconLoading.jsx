// @flow

import React, { Component } from 'react';

import './IconLoading.css';

type Props = {
  className?: string,
  onClick?: () => void,
};

export const IconLoading = ({ className, onClick }: Props) =>
  <svg className={className} onClick={onClick} width="64px" height="64px" viewBox="-32 -32 64 64">
    <g stroke="#2b8bff" strokeWidth="3" strokeLinecap="round" fill="none">
      <circle className="IconLoading-s" cx="0" cy="0" r="14" />
      <circle className="IconLoading-m" cx="0" cy="0" r="22" />
      <circle className="IconLoading-l" cx="0" cy="0" r="30" />
    </g>
  </svg>
;
