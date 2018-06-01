// @flow

type ImportCard = {
  originalLine: string,
  originalName: string,
  count: number,
};

export function parseLines(lines: string[]): Array<?ImportCard> {
  return lines.map(parseLine);
}

const OnlyNumbersRegex = /^\d+$/;
const LeadingCountRegex = /^(\d+)\s+(.+?)$/;
const OptionalTrailingCountRegex = /^(.+?)(\s+\d*)?$/;

export function parseLine(line: string): ?ImportCard {
  const trimmedLine = line.trim();

  if (!trimmedLine || trimmedLine.match(OnlyNumbersRegex)) {
    return null;
  }

  const maybeLeadingCount = trimmedLine.match(LeadingCountRegex);
  if (maybeLeadingCount) {
    const [, countString, originalName] = maybeLeadingCount;
    const count = parseInt(countString, 10);
    return isNaN(count) ? null : {
      originalLine: line,
      originalName,
      count,
    };
  }

  const maybeTrailingCount = trimmedLine.match(OptionalTrailingCountRegex)
  if (maybeTrailingCount) {
    const [, originalName, countString] = maybeTrailingCount;
    const count = countString == null ? 1 : parseInt(countString, 10);
    return isNaN(count) ? null : {
      originalLine: line,
      originalName,
      count,
    };
  }

  return null;
}
