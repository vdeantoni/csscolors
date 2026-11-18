import names from "color-name";
import { describe, expect, it } from "vitest";
import { COLOR_GROUPS, COLORS } from "./colors.js";

const GREY_SPELLINGS = ["grey", "darkgrey", "darkslategrey", "dimgrey", "lightgrey", "lightslategrey", "slategrey"];

const toHex = (rgb: readonly number[]) =>
  `#${rgb
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;

describe("COLORS", () => {
  it("holds every CSS named color but the grey spellings", () => {
    const expected = Object.keys(names).filter((name) => !GREY_SPELLINGS.includes(name));
    const actual = Object.values(COLORS).map((c) => c.name.toLowerCase());

    expect(actual.sort()).toEqual(expected.sort());
  });

  it("matches the spec's value for each color", () => {
    for (const { name, hex } of Object.values(COLORS)) {
      expect(hex, name).toBe(toHex(names[name.toLowerCase() as keyof typeof names]));
    }
  });

  it("keys each color by its name", () => {
    for (const [key, { name }] of Object.entries(COLORS)) {
      expect(name).toBe(key);
    }
  });

  it("uses every group in COLOR_GROUPS and no other", () => {
    expect(new Set(Object.values(COLORS).map((c) => c.group))).toEqual(new Set(COLOR_GROUPS));
  });
});
