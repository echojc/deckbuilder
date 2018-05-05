// @flow

export type CardData = {
  // name is unique enough as id
  name: string,
  mana_cost: string,
  cmc: number,
  type_line: string,
  oracle_text: string,
  power: string, // can be "*"
  toughness: string, // can be "*"
  rarity: string,
  colors: string,
  image_uris: {
    small: string,
    normal: string,
  },
};

const base = 'https://api.scryfall.com';
//const base = 'http://localhost:8080';

export async function autocomplete(partial: string): Promise<string[]> {
  if (!partial || partial.length < 3) return [];

  const res = await fetch(`${base}/cards/autocomplete?q=${partial}`);
  const json = await res.json();
  return json.data;
}

export async function named(exact: string): Promise<CardData> {
  if (!exact) throw new Error('card not found');

  const res = await fetch(`${base}/cards/named?exact=${exact}`);
  if (res.status === 404) throw new Error('card not found');

  // the exported type has limited fields, but the data itself has all the fields
  return await res.json();
}
