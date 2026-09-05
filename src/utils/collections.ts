/** Stable sort on a computed key. The key is computed once per item, not once per comparison. */
export const sortBy = <T>(items: readonly T[], key: (item: T) => string | number): T[] =>
  items
    .map((item) => ({ item, k: key(item) }))
    .sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0))
    .map(({ item }) => item);

export const groupBy = <T>(items: readonly T[], key: (item: T) => string): Record<string, T[]> => {
  const groups: Record<string, T[]> = {};

  for (const item of items) {
    (groups[key(item)] ??= []).push(item);
  }

  return groups;
};
