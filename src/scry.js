// @flow

const base = 'https://api.scryfall.com';
//const base = 'http://localhost:8080';

export async function autocomplete(partial: string): Promise<string[]> {
  if (!partial || partial.length < 2) return [];

  const res = await fetch(`${base}/cards/autocomplete?q=${partial}`);
  const json = await res.json();
  return json.data;
}

export async function named(exact: string): Promise<any> {
  if (!exact) throw new Error('card not found');

  const res = await fetch(`${base}/cards/named?exact=${exact}`);
  if (res.status === 404) throw new Error('card not found');

  return await res.json();
}
