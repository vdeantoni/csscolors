import { describe, expect, it } from "vitest";
import { sortBy } from "./collections.js";
import { lightness, spectrumRank, type ColorEntry } from "./metrics.js";
import { COLORS } from "./colors.js";

const sortNames = (key: (c: ColorEntry) => string | number, reverse = false) => {
  const sorted = sortBy(Object.values(COLORS), key).map((c) => c.name);
  return reverse ? sorted.reverse() : sorted;
};

describe("sort orders", () => {
  it("by name", () => {
    expect(sortNames((c) => c.name)).toMatchSnapshot();
    expect(sortNames((c) => c.name, true)).toMatchSnapshot();
  });

  it("by lightness", () => {
    expect(sortNames(lightness)).toMatchSnapshot();
    expect(sortNames(lightness, true)).toMatchSnapshot();
  });

  it("by spectrum", () => {
    expect(sortNames(spectrumRank)).toMatchSnapshot();
    expect(sortNames(spectrumRank, true)).toMatchSnapshot();
  });
});
