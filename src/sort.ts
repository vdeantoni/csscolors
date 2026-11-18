import { COLOR_GROUPS, type ColorGroup } from "./colors.js";
import { lightness, spectrumRank, type SpectrumOptions } from "./metrics.js";

export interface SortOptions {
  /** Reverses the result, ties included. */
  reverse?: boolean;
}

/** Stable sort on a computed key. The key is computed once per color, not once per comparison. */
export const sortColors = <T>(
  colors: readonly T[],
  key: (color: T) => string | number,
  { reverse = false }: SortOptions = {},
): T[] => {
  const sorted = colors
    .map((color) => ({ color, k: key(color) }))
    .sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0))
    .map(({ color }) => color);

  return reverse ? sorted.reverse() : sorted;
};

export const byName = (color: { name: string }) => color.name;

export const byLightness = (color: { hex: string }) => lightness(color.hex);

export const bySpectrum =
  (options?: SpectrumOptions) =>
  (color: { hex: string }): number =>
    spectrumRank(color.hex, options);

/** Splits colors by group, in `COLOR_GROUPS` order, keeping their order within each group. Empty groups are left out. */
export const groupColors = <T extends { group: ColorGroup }>(
  colors: readonly T[],
): { group: ColorGroup; colors: T[] }[] =>
  COLOR_GROUPS.map((group) => ({ group, colors: colors.filter((color) => color.group === group) })).filter(
    ({ colors }) => colors.length > 0,
  );
