import color from "color";
import { describe, expect, it } from "vitest";
import { COLORS } from "./colors.js";
import { lch, spectrumRank } from "./metrics.js";

describe("lch", () => {
  it("matches the color package for every named color", () => {
    for (const { name, hex } of Object.values(COLORS)) {
      const [l, c, h] = lch(hex);
      const [el, ec, eh] = color(hex).lch().array();

      expect(l, name).toBeCloseTo(el, 9);
      expect(c, name).toBeCloseTo(ec, 9);
      // A grey's chroma is rounding noise, around 1e-5, so its hue angle can't be compared.
      if (ec >= 1) {
        expect(h, name).toBeCloseTo(eh, 9);
      }
    }
  });

  it("accepts short hex and a missing #", () => {
    expect(lch("f00")).toEqual(lch("#FF0000"));
  });

  it("rejects anything else", () => {
    for (const input of ["", "#ff", "#ff00000", "red", "#gg0000", "rgb(0, 0, 0)"]) {
      expect(() => lch(input), input).toThrow(TypeError);
    }
  });
});

describe("spectrumRank", () => {
  it("puts neutrals before the hue bands unless asked to put them after", () => {
    expect(spectrumRank("#FFFFFF")).toBeLessThan(spectrumRank("#000080"));
    expect(spectrumRank("#000000", { neutrals: "last" })).toBeGreaterThan(spectrumRank("#FF00FF", { neutrals: "last" }));
  });

  it("orders by lightness within a band", () => {
    expect(spectrumRank("#8B0000")).toBeLessThan(spectrumRank("#FF0000"));
  });
});
