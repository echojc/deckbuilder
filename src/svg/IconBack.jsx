// @flow

import React, { Component } from 'react';

type Props = {
  className?: string,
  onClick?: () => void,
};

export const IconBack = ({ className, onClick }: Props) =>
  <svg className={className} onClick={onClick} width="32px" height="32px" viewBox="0 0 32 32">
    <g strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M19,9 L12,16 L19,23" />
    </g>
  </svg>
;
