import { describe, expect, it } from "vitest";
import { COLOR_GROUPS, COLORS, type CssColor } from "./colors.js";
import { byLightness, byName, bySpectrum, groupColors, sortColors } from "./sort.js";

const ALL = Object.values(COLORS);

const sortNames = (key: (c: CssColor) => string | number, reverse = false) =>
  sortColors(ALL, key, { reverse }).map((c) => c.name);

describe("sort orders", () => {
  it("by name", () => {
    expect(sortNames(byName)).toMatchSnapshot();
    expect(sortNames(byName, true)).toMatchSnapshot();
  });

  it("by lightness", () => {
    expect(sortNames(byLightness)).toMatchSnapshot();
    expect(sortNames(byLightness, true)).toMatchSnapshot();
  });

  it("by spectrum", () => {
    expect(sortNames(bySpectrum())).toMatchSnapshot();
    expect(sortNames(bySpectrum(), true)).toMatchSnapshot();
  });
});

describe("sortColors", () => {
  it("sorts anything the key accepts", () => {
    const colors = [{ hex: "#FFFFFF" }, { hex: "#000080" }, { hex: "#00FF00" }];
    expect(sortColors(colors, byLightness)).toEqual([{ hex: "#000080" }, { hex: "#00FF00" }, { hex: "#FFFFFF" }]);
  });

  it("leaves its input alone", () => {
    const colors = [COLORS.White, COLORS.Black];
    sortColors(colors, byLightness, { reverse: true });
    expect(colors).toEqual([COLORS.White, COLORS.Black]);
  });

  it("can put neutrals after the hue bands", () => {
    const names = sortColors([COLORS.Gray, COLORS.Purple, COLORS.Red], bySpectrum({ neutrals: "last" })).map(
      (c) => c.name,
    );
    expect(names).toEqual(["Red", "Purple", "Gray"]);
  });
});

describe("groupColors", () => {
  it("returns groups in COLOR_GROUPS order, keeping the order within each", () => {
    const sorted = sortColors(ALL, byLightness);
    const groups = groupColors(sorted);

    expect(groups.map(({ group }) => group)).toEqual(COLOR_GROUPS);
    for (const { group, colors } of groups) {
      expect(colors).toEqual(sorted.filter((c) => c.group === group));
    }
  });

  it("leaves out empty groups", () => {
    expect(groupColors([COLORS.Navy, COLORS.Red]).map(({ group }) => group)).toEqual(["Reds", "Blues"]);
  });
});
