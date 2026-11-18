export type Lch = [l: number, c: number, h: number];

export interface SpectrumOptions {
  /** Hue bands around the wheel. Fewer merge families that read as distinct; more split them up. Defaults to 12. */
  bands?: number;
  /** LCH chroma below which a color counts as neutral, because its hue angle is noise. Defaults to 12. */
  achromaticChroma?: number;
  /** Whether neutrals come before or after the hue bands. Defaults to `"first"`. */
  neutrals?: "first" | "last";
}

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

const toLinear = (channel: number) => {
  const c = channel / 255;
  return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92;
};

const labF = (t: number) => (t > (6 / 29) ** 3 ? t ** (1 / 3) : 7.787 * t + 16 / 116);

/** CIE LCH (D65) of a `#RGB` or `#RRGGBB` color, with or without the `#`. Hue is in degrees, 0 to 360. */
export const lch = (hex: string): Lch => {
  const match = HEX.exec(hex.trim());
  if (!match) {
    throw new TypeError(`Expected a #RGB or #RRGGBB color, got ${JSON.stringify(hex)}`);
  }

  const digits = match[1].length === 3 ? [...match[1]].map((d) => d + d).join("") : match[1];
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(digits.slice(i, i + 2), 16)));

  const x = labF((r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047);
  const y = labF(r * 0.2126729 + g * 0.7151522 + b * 0.072175);
  const z = labF((r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883);

  const a = 500 * (x - y);
  const bLab = 200 * (y - z);
  const hue = (Math.atan2(bLab, a) * 180) / Math.PI;

  return [116 * y - 16, Math.hypot(a, bLab), hue < 0 ? hue + 360 : hue];
};

/** CIE L*, 0 for black to 100 for white. Perceptually even, unlike summing R+G+B. */
export const lightness = (hex: string) => lch(hex)[0];

/**
 * Sort key that buckets colors into hue bands and orders by lightness inside each one,
 * so a family reads as a single dark-to-light ramp. Neutrals form their own band.
 */
export const spectrumRank = (
  hex: string,
  { bands = 12, achromaticChroma = 12, neutrals = "first" }: SpectrumOptions = {},
) => {
  const [l, chroma, hue] = lch(hex);
  const width = 360 / bands;
  const band =
    chroma >= achromaticChroma ? Math.floor(((hue + width / 2) % 360) / width) : neutrals === "first" ? -1 : bands;

  // Bands sit 1000 apart and L* tops out at 100, so band always outranks lightness.
  return band * 1000 + l;
};
