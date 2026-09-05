import color from "color";
import { COLORS } from "./colors";

export type ColorEntry = (typeof COLORS)[keyof typeof COLORS];

/** Below this LCH chroma the hue angle is numerical noise, so the color sorts as a grey. */
const ACHROMATIC_CHROMA = 12;
const HUE_BANDS = 12;
const BAND_WIDTH = 360 / HUE_BANDS;

const lch = (entry: ColorEntry) => color(`#${entry.hex}`).lch().array();

/** CIE L*, 0 for black to 100 for white. Perceptually even, unlike summing R+G+B. */
export const lightness = (entry: ColorEntry) => lch(entry)[0];

/**
 * Buckets colors into hue bands and orders by lightness inside each one, so a family
 * reads as a single dark-to-light ramp. Achromatic colors take band -1 and lead.
 */
export const spectrumRank = (entry: ColorEntry) => {
  const [l, chroma, hue] = lch(entry);
  const band = chroma < ACHROMATIC_CHROMA ? -1 : Math.floor(((hue + BAND_WIDTH / 2) % 360) / BAND_WIDTH);

  // Bands sit 1000 apart and L* tops out at 100, so band always outranks lightness.
  return band * 1000 + l;
};
