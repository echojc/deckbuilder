// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { availableDecks } from './selector';
import { setCurrentDeck, addAndSwitchToDeck, renameDeck, duplicateDeck } from './state';
import SelectWithRename from './SelectWithRename';

import type { GlobalState } from './state';

type Props = {
  availableDecks: { [id: string]: string },
  currentDeckId: string,
  setCurrentDeck: (id: string) => void,
  addAndSwitchToDeck: () => void,
  renameDeck: (id: string, newName: string) => void,
  duplicateDeck: (id: string) => void,
};

function removeExtraSpaces(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

const DeckPicker = ({ availableDecks, currentDeckId, setCurrentDeck, addAndSwitchToDeck, renameDeck, duplicateDeck }: Props) =>
  <span className="DeckPicker">
    <SelectWithRename
      options={availableDecks}
      value={currentDeckId}
      onChange={newId => setCurrentDeck(newId)}
      onRename={(id, newName) => renameDeck(id, removeExtraSpaces(newName))}
    />
    <button onClick={() => duplicateDeck(currentDeckId) }>duplicate</button>
    <button onClick={() => addAndSwitchToDeck() }>create new</button>
  </span>
;

export default connect(
  (state: GlobalState) => ({
    currentDeckId: state.currentDeckId,
    availableDecks: availableDecks(state),
  }),
  (dispatch) => ({
    setCurrentDeck: (id: string) => dispatch(setCurrentDeck(id)),
    addAndSwitchToDeck: () => dispatch(addAndSwitchToDeck()),
    renameDeck: (id: string, newName: string) => dispatch(renameDeck(id, newName)),
    duplicateDeck: (id: string) => dispatch(duplicateDeck(id)),
  }),
)(DeckPicker);
