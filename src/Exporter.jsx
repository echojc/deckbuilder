// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deck, deckCards, exportCockatriceFormatBase64 } from './selector';
import type { GlobalState } from './state';

type Props = {
  deckCount: number,
  deckName: string,
  exportCockatriceFormatBase64: string,
};

const Exporter = ({ deckCount, deckName, exportCockatriceFormatBase64 }: Props) =>
  <span className="Exporter">
    [{deckCount === 0
      ? <span>export to cockatrice</span>
      : <a href={exportCockatriceFormatBase64} download={`${deckName.replace(/\s/, '-')}.cod`}>
          export to cockatrice
        </a>
    }]
  </span>
;

export default connect(
  (state: GlobalState) => ({
    deckCount: deckCards(state).length,
    deckName: deck(state).name,
    exportCockatriceFormatBase64: exportCockatriceFormatBase64(state),
  }),
)(Exporter);
