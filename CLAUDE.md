# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page Vite + React app that renders the CSS named colors as a grid of swatches, with client-side
sort and group controls. There is no router and no server: `index.html` boots `src/main.tsx`, which mounts
`src/App.tsx`. Deployed to Vercel as a static SPA out of `dist/`.

## Commands

Package manager is pnpm. Node must satisfy `^20.19.0 || >=22.12.0` (Vite 8).

```
pnpm dev      # dev server on port 1112
pnpm build    # tsc -b && vite build  -> dist/
pnpm preview  # serve the built output on 1112
pnpm lint     # eslint .
```

There is no test suite and no test runner installed. There is also no `format` script, and prettier is not a
dependency, so `.prettierrc` (printWidth 120) only applies if your editor picks it up.

`pnpm build` typechecks first via `tsc -b`, so a type error fails the build. `npx tsc -b` alone is the fast
way to typecheck without bundling.

## Architecture

`src/utils/colors.js` is the single source of truth: a `COLORS` object keyed by color name, each entry
`{ name, hex, group }`. It is the only `.js` file in the source tree (`allowJs` is on); everything else is
`.ts`/`.tsx`. `App.tsx` derives `ColorEntry` from it with `(typeof COLORS)[keyof typeof COLORS]`, so the
whole chain stays typed without a hand-written interface.

`src/App.tsx` holds the two pieces of state (`sortByType`, `groupByType`) and derives the grouped, sorted
colors from them in a `useMemo`. Everything below it is presentational.

`sortBy` and `groupBy` live in `src/utils/collections.ts` rather than coming from lodash. lodash is CJS and
does not tree-shake, so importing those two functions cost ~26 kB gzip for ~10 lines of behavior. `sortBy`
computes its key once per item, not once per comparison, since the lightness key builds a `Color` object.

`src/components/Color.tsx` paints a swatch by setting `backgroundColor` to the color's **name**, not its hex.
The hex in `COLORS` is used only for the hover labels and to pick black or white text via
`color(...).contrast(black) < 5.5`. If a hex in `colors.js` disagrees with the real CSS named color, the
swatch and the label it displays will silently disagree too.

`src/components/ColorHeader.tsx` maps a group name to a Tailwind gradient pair via `GRADIENT_MAP`. **Adding a
new group to `colors.js` requires adding the matching entry here**, otherwise the heading renders as
transparent text with no gradient behind it.

## Sorting

`src/utils/colorMetrics.ts` holds the color math. Everything reads LCH off the `color` package, which is
CIELAB in polar form, so lightness, chroma, and hue all come from one conversion.

`lightness` is CIE L*. Do not go back to summing R+G+B: that weights the channels equally, so it ranks pure
green as darker than navy, which is backwards. Note the `color` package's own `.lightness()` is HSL lightness,
a different and non-perceptual number.

`spectrumRank` is what clusters similar colors. It buckets hue into 12 bands and orders by lightness inside
each band, so a family reads as one dark-to-light ramp. Colors with LAB chroma under 12 get band -1 and lead,
because a near-grey's hue angle is numerical noise and would otherwise scatter them across the spectrum. The
rank encodes both parts as `band * 1000 + lightness`, which stays ordered only because lightness tops out at
100; widening the lightness range means widening that multiplier.

The band count and the chroma cutoff are the two knobs worth touching. Twelve bands split the 141 named
colors into families of 4 to 18; fewer bands merge families that read as distinct, more bands fragment them.

## Tailwind v4

Tailwind v4 is wired through the `@tailwindcss/vite` plugin, not PostCSS. There is no `tailwind.config.ts`
and no `postcss.config.js`; all configuration lives in `src/styles/globals.css` via `@import "tailwindcss"`
and an `@theme` block. v4 auto-discovers source files.

Class names must appear as complete literal strings for the scanner to find them. `GRADIENT_MAP` stores full
classes like `"from-[LightBlue]"` for exactly this reason. Do not build class names by concatenation.

The Inter font is self-hosted through `@fontsource-variable/inter`, but `src/styles/globals.css` declares the
`@font-face` by hand against the latin `.woff2` rather than importing the package entry, which would ship seven
language subsets. `--font-sans` in the `@theme` block points at it. Keep it self-hosted: fetching from Google
Fonts at build time breaks on networks that block `fonts.gstatic.com`.

## Control pattern

The sort and group modes live in `src/utils/modes.ts` as `as const` arrays, each with its type derived from
the array:

```ts
export const SORT_BY_TYPES = ["AZ", "ZA", "LD", "DL", "HUE", "HUE_REV"] as const;
export type SortByType = (typeof SORT_BY_TYPES)[number];
```

The array is the single source of truth. Declaration order is click order, and `nextInCycle` in
`src/utils/cycle.ts` advances one step per click and wraps.

`App.tsx` keys behavior off these modes through `Record`-typed lookups (`SORTS`, `GROUPERS`), and `SortBy.tsx`
does the same in its `MODES` table for the icon and tooltip. Adding a mode to the array is therefore a compile
error until you supply its sort key, grouper, icon, and label. Keep it that way: a `switch` over the modes
would silently fall through on a new one and blank the grid.

One button cycles all six sort modes, so the tooltip and `aria-label` name the current mode rather than
saying "Sort by". An unlabelled six-state toggle is not discoverable.

Do not convert these to TypeScript `enum`s. Numeric enums carry a runtime reverse mapping, which makes
`Object.keys`/`Object.values` return twice the member count and breaks any modulo-based cycling built on them.
`erasableSyntaxOnly` in `tsconfig.app.json` rejects `enum` outright.

The modes deliberately live outside the component files. `eslint-plugin-react-refresh` errors if a component
file also exports constants, since that breaks fast refresh.

## Conventions

- Path alias `@/*` maps to `./src/*` in both `tsconfig.app.json` and `vite.config.ts`, but all current
  imports are relative. Match the file you are editing.
- Components are arrow functions with a typed props interface and a default export. `App` is the one
  exception, a function declaration, since it is the root.
- `verbatimModuleSyntax` is on, so type-only imports must be written `import { type Foo }` or `import type`.
