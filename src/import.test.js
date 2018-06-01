// @flow

import { parseLine } from './import';

describe('import', () => {
  describe('parseLine', () => {
    describe('happy cases', () => {
      [
        ['leading count', '3 foo', { originalName: 'foo', count: 3 }],
        ['leading count with spaces', '3 foo bar', { originalName: 'foo bar', count: 3 }],
        ['trailing count', 'foo 3', { originalName: 'foo', count: 3 }],
        ['trailing count with spaces', 'foo bar 3', { originalName: 'foo bar', count: 3 }],
        ['leading count with leading numbers', '3 4 foo', { originalName: '4 foo', count: 3 }],
        ['trailing count with trailing numbers', 'foo 4 3', { originalName: 'foo 4', count: 3 }],
        ['numbers on both sides uses leading as count', '3 foo 4', { originalName: 'foo 4', count: 3 }],
        ['no count defaults to 1', 'foo', { originalName: 'foo', count: 1 }],
        ['no count with spaces defaults to 1', 'foo bar', { originalName: 'foo bar', count: 1 }],
        ['leading count with leading numbers with spaces', '3 4 foo bar', { originalName: '4 foo bar', count: 3 }],
        ['trailing count with trailing numbers with spaces', 'foo bar 4 3', { originalName: 'foo bar 4', count: 3 }],
        ['numbers on both sides with spaces uses leading as count', '3 foo bar 4', { originalName: 'foo bar 4', count: 3 }],
        ['leading count with leading whitespace', ' 3 foo', { originalName: 'foo', count: 3 }],
        ['leading count with trailing whitespace', '3 foo ', { originalName: 'foo', count: 3 }],
        ['leading count with extra whitespace on both sides', ' 3 foo ', { originalName: 'foo', count: 3 }],
        ['trailing count with leading whitespace', ' foo 3', { originalName: 'foo', count: 3 }],
        ['trailing count with trailing whitespace', 'foo 3 ', { originalName: 'foo', count: 3 }],
        ['trailing count with extra whitespace on both sides', ' foo 3 ', { originalName: 'foo', count: 3 }],
      ].forEach(([testCase, line, expected]) => {
        it(testCase, () => {
          expect(parseLine(line)).toEqual({
            originalLine: line,
            ...expected,
          });
        });
      });
    });

    describe('error cases', () => {
      [
        ['empty string', ''],
        ['whitespace string', ' '],
        ['just numbers', '3'],
      ].forEach(([testCase, line]) => {
        it(testCase, () => {
          expect(parseLine(line)).toBeNull();
        });
      });
    });
  });
});
