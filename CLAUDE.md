# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page Next.js App Router app that renders the CSS named colors as a grid of swatches, with client-side
sort and group controls. Deployed to Vercel (`@vercel/analytics` is wired into the root layout).

## Commands

Package manager is pnpm (`pnpm-lock.yaml`).

```
pnpm dev     # dev server on port 1112, not 3000
pnpm build
pnpm start
pnpm lint    # next lint
```

There is no test suite and no test runner installed. There is also no `format` script, and prettier is not a
dependency, so `.prettierrc` (printWidth 120) only applies if your editor picks it up.

`.codesandbox/tasks.json` claims the dev preview is on port 3000. It is wrong; `pnpm dev` hardcodes `PORT=1112`.

## Architecture

`src/utils/colors.js` is the single source of truth: a `COLORS` object keyed by color name, each entry
`{ name, hex, group }`. It is the only `.js` file in the source tree (`allowJs` is on); everything else is `.tsx`.

`src/app/page.tsx` is the only page and is a client component. It holds two pieces of state, `sortByType` and
`groupByType`, and derives a `groups` record from them. Everything below it is presentational.

`src/components/Color.tsx` paints a swatch by setting `backgroundColor` to the color's **name**, not its hex. The
hex in `COLORS` is used only for the hover labels and to pick black or white text via `color(...).contrast(black) < 5.5`.
If a hex in `colors.js` disagrees with the real CSS named color, the swatch and the label it displays will silently
disagree too.

`src/components/ColorHeader.tsx` maps a group name to a Tailwind gradient pair via `GRADIENT_MAP`. **Adding a new
group to `colors.js` requires adding the matching entry here**, otherwise the heading renders as transparent text
with no gradient behind it.

Sorting by "lightness" (`LD` / `DL`) sums the raw R+G+B channels. It is not perceptual luminance, so
saturated blues sort as very dark.

## Tailwind v4

Tailwind is v4, configured entirely from `src/styles/globals.css` (`@import "tailwindcss"`) through
`@tailwindcss/postcss`. `tailwind.config.ts` is a leftover from v3: nothing references it with `@config`, so its
`content` globs are dead and editing them changes nothing. v4 auto-discovers sources instead.

Class names must appear as complete literal strings for the scanner to find them. `GRADIENT_MAP` stores full
classes like `"from-[LightBlue]"` for exactly this reason. Do not build class names by concatenation.

## Control pattern

The sort and group modes are `as const` string arrays, each with its type derived from the array:

```ts
export const SORT_BY_TYPES = ["AZ", "ZA", "LD", "DL"] as const;
export type SortByType = (typeof SORT_BY_TYPES)[number];
```

The array is the single source of truth. Declaration order is click order, and `nextInCycle` in
`src/utils/cycle.ts` advances one step per click and wraps.

`page.tsx` keys behavior off these modes through `Record`-typed lookups (`SORTS`, `GROUPERS`) rather than
`switch`. Adding a mode to the array is therefore a compile error until you supply its sort key and grouper.
Keep it that way: a `switch` over the modes would silently fall through on a new one and blank the grid.

Do not convert these to TypeScript `enum`s. Numeric enums carry a runtime reverse mapping, which makes
`Object.keys`/`Object.values` return twice the member count and breaks any modulo-based cycling built on them.

## Conventions

- Path alias `@/*` maps to `./src/*` in `tsconfig.json`, but all current imports are relative. Match the file
  you are editing.
- Components are arrow functions with a typed props interface and a default export.
