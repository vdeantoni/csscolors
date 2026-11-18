# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The repo is both the npm package `@vdeantoni/csscolors` and its demo site, csscolors.dev.

- `src/` is the library: the CSS named colors as typed data, LCH color math, and sort and group helpers. It
  is published from `dist/`.
- `demo/` is a single-page Vite + React app that renders the colors as a grid of swatches with sort and
  group controls. There is no router and no server: `index.html` boots `demo/main.tsx`, which mounts
  `demo/App.tsx`. Vercel deploys it as a static SPA out of `dist-demo/`, as `vercel.json` says.

## Commands

Package manager is pnpm. Node must satisfy `^20.19.0 || >=22.12.0` (Vite 8).

```
pnpm dev         # demo dev server on port 1112
pnpm test        # vitest run
pnpm lint        # eslint .
pnpm build       # library: tsc -p tsconfig.build.json -> dist/
pnpm build:demo  # tsc -b && vite build -> dist-demo/
pnpm preview     # serve dist-demo/ on 1112
```

`npx tsc -b` typechecks `src/` and `demo/` without bundling. `pnpm build` checks `src/` again under Node's
resolution rules (`tsconfig.build.json`), so run it too after touching the library's imports.

`pnpm dlx publint` and `pnpm dlx @arethetypeswrong/cli --pack . --profile esm-only` check that the exports and
types resolve for consumers. Both run in CI. `publint` packs without running `prepack`, so build first.

There is no `format` script, and prettier is not a dependency, so `.prettierrc` (printWidth 120) only applies if
your editor picks it up.

pnpm 12 fails an install with `ERR_PNPM_IGNORED_BUILDS` when any package in the tree has a build script nobody
has reviewed. A new dependency with one needs an `allowBuilds` entry in `pnpm-workspace.yaml`.

## Releases

A push to `main` that changes `package.json` runs `.github/workflows/publish.yml`, which publishes the
`version` unless npm already has it. So a release is a merged `version` bump. The workflow authenticates
through npm trusted publishing, configured on npmjs.com for that file name, so renaming the file stops
publishing and no npm token is stored anywhere. `publishConfig` pins the public registry, because a
machine-wide registry setting would otherwise receive the package. `.github/workflows/ci.yml` runs lint, tests,
both builds and the package checks on pull requests.

## Library

`src/index.ts` is the only entry point. The library has no runtime dependencies and no DOM or framework code;
`tsconfig.build.json` sets `lib: ["ES2022"]` with no DOM, so a DOM reference fails the build. Relative imports
end in `.js` even though the files are `.ts`, because tsc copies import paths into the emitted `.d.ts` files
as written. `tsconfig.build.json` uses `NodeNext` resolution, so an import missing its extension fails the
build.

Everything the demo uses as a dependency (React, Tailwind, Font Awesome, `color`, analytics) is a
devDependency. Anything in `dependencies` would be installed by every consumer of the package.

`src/colors.ts` is the single source of truth: `DEFINITIONS`, an `as const` object keyed by color name, each
entry `{ name, hex, group }`. `CssColorName` is derived from its keys, and `COLORS` re-exports it typed as
`Record<CssColorName, CssColor>` so consumers see a plain interface rather than 141 literal types. `hex` is
uppercase `#RRGGBB`. The seven `grey` spellings are deliberately left out. `src/colors.test.ts` checks every
entry against the `color-name` package (the CSS spec values) and that each key equals its `name`.

`COLOR_GROUPS` lists the groups in display order, and `groupColors` returns groups in that order. A group in
the data that is missing from `COLOR_GROUPS` fails the type check, since `group` is typed `ColorGroup`.

`src/sort.ts` holds `sortColors`, a stable sort that computes the key once per item, not once per comparison,
since the lightness and spectrum keys each run an LCH conversion. The keys (`byName`, `byLightness`,
`bySpectrum`) take structural types (`{ name }`, `{ hex }`), so they sort any color objects, not just
`CssColor`s.

## Sorting

`src/metrics.ts` holds the color math. Everything reads LCH from `lch()`, which is CIELAB in polar form, so
lightness, chroma, and hue all come from one conversion. The conversion is a copy of the `color-convert`
package's sRGB → XYZ → Lab → LCH steps, constants included. `src/metrics.test.ts` checks it against the `color`
package for all 141 colors, so a change to a constant shows up there.

`lightness` is CIE L*. Do not go back to summing R+G+B: that weights the channels equally, so it ranks pure
green as darker than navy, which is backwards. Note the `color` package's own `.lightness()` is HSL lightness,
a different and non-perceptual number.

`spectrumRank` is what clusters similar colors. It buckets hue into 12 bands and orders by lightness inside
each band, so a family reads as one dark-to-light ramp. Colors with LAB chroma under 12 count as neutral and
get a band of their own, first (-1) or last (`bands`) depending on the `neutrals` option. A near-grey's hue
angle is numerical noise and would otherwise scatter neutrals across the spectrum. The rank encodes both parts
as `band * 1000 + lightness`, which stays ordered only because lightness tops out at 100; widening the
lightness range means widening that multiplier.

The band count and the chroma cutoff are the two knobs worth touching, and both are options. Twelve bands split
the 141 named colors into families of 4 to 18; fewer bands merge families that read as distinct, more bands
fragment them.

`src/sort.test.ts` snapshots all six demo sort orders. A changed snapshot means a visible change in the demo and
for consumers, so update it only on purpose. Under `CI=true`, vitest fails on a missing snapshot instead of
writing it.

## Demo

`demo/App.tsx` holds the two pieces of state (`sortByType`, `groupByType`) and derives the grouped, sorted
colors from them in a `useMemo`. Everything below it is presentational. It imports the library from
`../src/index.js`, like a consumer would, never from the library's internal modules.

`demo/components/Color.tsx` paints a swatch by setting `backgroundColor` to the color's **name**, not its hex.
The hex is used only for the hover labels and to pick black or white text via `color(...).contrast(black) <
5.5`. If a hex in `colors.ts` disagreed with the real CSS named color, the swatch and its label would silently
disagree too; the data test guards against that.

`demo/components/ColorHeader.tsx` maps each `ColorGroup` to a Tailwind gradient pair via `GRADIENT_MAP`, typed
`Record<ColorGroup, …>`, so adding a group to the library is a compile error here until it gets a gradient.

### Tailwind v4

Tailwind v4 is wired through the `@tailwindcss/vite` plugin, not PostCSS. There is no `tailwind.config.ts` and
no `postcss.config.js`; all configuration lives in `demo/styles/globals.css` via `@import "tailwindcss"` and an
`@theme` block. v4 auto-discovers source files.

Class names must appear as complete literal strings for the scanner to find them. `GRADIENT_MAP` stores full
classes like `"from-[LightBlue]"` for exactly this reason. Do not build class names by concatenation.

The Inter font is self-hosted through `@fontsource-variable/inter`, but `demo/styles/globals.css` declares the
`@font-face` by hand against the latin `.woff2` rather than importing the package entry, which would ship seven
language subsets. `--font-sans` in the `@theme` block points at it. Keep it self-hosted: fetching from Google
Fonts at build time breaks on networks that block `fonts.gstatic.com`.

### Control pattern

The sort and group modes live in `demo/utils/modes.ts` as `as const` arrays, each with its type derived from
the array:

```ts
export const SORT_BY_TYPES = ["AZ", "ZA", "LD", "DL", "HUE", "HUE_REV"] as const;
export type SortByType = (typeof SORT_BY_TYPES)[number];
```

The array is the single source of truth. Declaration order is click order, and `nextInCycle` in
`demo/utils/cycle.ts` advances one step per click and wraps.

`App.tsx` keys behavior off these modes through `Record`-typed lookups (`SORTS`, `GROUPERS`), and `SortBy.tsx`
does the same in its `MODES` table for the icon and tooltip. Adding a mode to the array is therefore a compile
error until you supply its sort key, grouper, icon, and label. Keep it that way: a `switch` over the modes
would silently fall through on a new one and blank the grid.

One button cycles all six sort modes, so the tooltip and `aria-label` name the current mode rather than
saying "Sort by". An unlabelled six-state toggle is not discoverable.

Do not convert these to TypeScript `enum`s. Numeric enums carry a runtime reverse mapping, which makes
`Object.keys`/`Object.values` return twice the member count and breaks any modulo-based cycling built on them.
`erasableSyntaxOnly` rejects `enum` outright.

The modes deliberately live outside the component files. `eslint-plugin-react-refresh` errors if a component
file also exports constants, since that breaks fast refresh.

## Conventions

- Path alias `@/*` maps to `./src/*` in both `tsconfig.app.json` and `vite.config.ts`, but nothing uses it.
  Imports are relative.
- Components are arrow functions with a typed props interface and a default export. `App` is the one
  exception, a function declaration, since it is the root.
- `verbatimModuleSyntax` is on, so type-only imports must be written `import { type Foo }` or `import type`.
