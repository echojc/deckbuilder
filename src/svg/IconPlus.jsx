// @flow

import React, { Component } from 'react';

type Props = {
  className?: string,
  onClick?: () => void,
};

export const IconPlus = ({ className, onClick }: Props) =>
  <svg className={className} onClick={onClick} width="32px" height="32px" viewBox="0 0 32 32">
    <g strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M16,6 L16,26" />
      <path d="M6,16 L26,16" />
    </g>
  </svg>
;
