# @vdeantoni/csscolors

The 141 CSS named colors, grouped into ten families, with sort keys for name, perceptual lightness and spectrum. The sorting and the color math work on any hex color, not only the named ones.

[Live demo](https://csscolors.dev)

## Install

```sh
pnpm add @vdeantoni/csscolors
```

The package is ESM only and has no dependencies.

## Usage

```ts
import { COLORS, bySpectrum, groupColors, sortColors } from "@vdeantoni/csscolors";

COLORS.RebeccaPurple; // { name: "RebeccaPurple", hex: "#663399", group: "Purples" }

const sorted = sortColors(Object.values(COLORS), bySpectrum());

for (const { group, colors } of groupColors(sorted)) {
  // "Reds" first, then "Pinks", …, each in spectrum order
}
```

The sort keys only read `hex` (or `name`), so your own colors sort the same way:

```ts
const palette = [{ hex: "#EF4444" }, { hex: "#FFFFFF" }, { hex: "#3B82F6" }, { hex: "#111111" }];

sortColors(palette, bySpectrum({ neutrals: "last" }));
// #EF4444, #3B82F6, #111111, #FFFFFF
```

## Data

`COLORS` maps each name to `{ name, hex, group }`:

- `name` is the CSS keyword in PascalCase, such as `"IndianRed"`. CSS ignores case in keywords, so it works as written.
- `hex` is uppercase `#RRGGBB`.
- `group` is one of `COLOR_GROUPS`: `"Reds"`, `"Pinks"`, `"Oranges"`, `"Yellows"`, `"Greens"`, `"Blues"`, `"Purples"`, `"Browns"`, `"Whites"`, `"Grays"`.

The seven `grey` spellings (`grey`, `darkgrey`, `slategrey`, …) are left out, since each has a `gray` twin with the same value. `Aqua` and `Cyan`, and `Fuchsia` and `Magenta`, are both in, with the same values.

The types `CssColor`, `CssColorName` (a union of the 141 names) and `ColorGroup` are exported too.

## Sorting

`sortColors(colors, key, { reverse })` returns a new, stably sorted array. It computes the key once per color, not once per comparison. `reverse` flips the result, ties included.

| Key                    | Sorts by                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `byName`               | `name`, A to Z.                                                                                             |
| `byLightness`          | CIE L\*, dark to light. Unlike summing R, G and B, it ranks pure green lighter than navy.                   |
| `bySpectrum(options?)` | Hue bands around the color wheel, each dark to light, so a family reads as one ramp. Neutrals form a band of their own. |

Any function that returns a string or a number works as a key too.

`bySpectrum` takes these options:

| Option             | Default   | Description                                                                                   |
| ------------------ | --------- | --------------------------------------------------------------------------------------------- |
| `bands`            | `12`      | Hue bands around the wheel. Fewer merge families that read as distinct; more split them up.   |
| `achromaticChroma` | `12`      | LCH chroma below which a color counts as neutral, because its hue angle is noise at that point. |
| `neutrals`         | `"first"` | Whether neutrals come before or after the hue bands.                                          |

## Grouping

`groupColors(colors)` returns `{ group, colors }[]` in `COLOR_GROUPS` order, leaving out empty groups. Colors keep their order within each group, so sort first and group second.

## Color math

| Function                     | Description                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `lch(hex)`                   | `[l, c, h]` in CIE LCH (D65), with the hue in degrees. Takes `#RGB` or `#RRGGBB`, `#` optional, and throws a `TypeError` for anything else. |
| `lightness(hex)`             | CIE L\*, from 0 for black to 100 for white.                                                                         |
| `spectrumRank(hex, options)` | The number `bySpectrum` sorts on. Takes the same options.                                                           |

## Development

```sh
pnpm install
pnpm dev          # demo at http://localhost:1112
pnpm test
pnpm build        # library into dist/
pnpm build:demo   # demo site into dist-demo/
```

Vite 8 needs Node `^20.19.0 || >=22.12.0`. That applies to working on the repo, not to using the package.

A merged `version` bump in `package.json` publishes to npm.
