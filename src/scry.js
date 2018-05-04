// @flow

export type Card = {
  id: string,
  name: string,
  mana_cost: string,
  cmc: number,
  oracle_text: string,
  colors: string,
  rarity: string,
  image_uris: {
    small: string,
    normal: string,
  },
};

const base = 'https://api.scryfall.com';

export async function autocomplete(partial: string): Promise<string[]> {
  if (!partial || partial.length < 3) return [];

  const res = await fetch(`${base}/cards/autocomplete?q=${partial}`);
  const json = await res.json();
  return json.data;
}

export async function named(exact: string): Promise<Card> {
  if (!exact) throw new Error('card not found');

  const res = await fetch(`${base}/cards/named?exact=${exact}`);
  if (res.status === 404) throw new Error('card not found');

  // the exported type has limited fields, but the data itself has all the fields
  return await res.json();
}
