// @flow

export function toCockatriceFormat(name: string, cardNames: string[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?><cockatrice_deck version="1"><deckname>${name}</deckname><zone name="main">`;
  const footer = '</zone></cockatrice_deck>';

  const groupedCardNames = {};
  for (const name of cardNames) {
    if (groupedCardNames.hasOwnProperty(name)) {
      groupedCardNames[name] += 1;
    } else {
      groupedCardNames[name] = 1;
    }
  }

  const cards = Object.keys(groupedCardNames).map(name => `<card number="${groupedCardNames[name]}" name="${name}"/>`);
  return `${header}\n${cards.join('\n')}\n${footer}`;
}

export function asDataUrl(mimeType: string, data: string): string {
  return `data:${mimeType};base64,${btoa(data)}`;
}
