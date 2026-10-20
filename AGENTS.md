# AGENTS.md

Guidance for AI agents working in or consuming `oxlint-config-harris`.

## Oxlint / Oxc documentation

Before changing oxlint config, rules, CLI flags, or plugins, fetch current docs from:

**https://oxc.rs/llms.txt**

That index links config, CLI, plugins, type-aware linting, coding-agent setup, and per-rule pages. Prefer it over training memory — oxlint APIs move.

Useful entry points (via the index above):

- Configuration (`oxlint.config.ts` / `defineConfig`)
- Config file reference
- Built-in plugins
- Type-aware linting (`oxlint-tsgolint`)
- Coding agents (how agents should run oxlint)

## Package facts

- Package name: `oxlint-config-harris`
- Entry: `index.js` (JS; no build step); typings in `index.d.ts` (`DummyRuleMap` + glob `string[]`s)
- Named exports only — **rule maps** + **file globs**, not `defineConfig` configs. No mono default config.
- Rule maps: `ecmaRules`, `nodeRules`, `reactRules`, `typescriptRules`, `vitestRules`
  - `rules/ecma.js` merges eslint + import + oxc + promise into `ecmaRules`
  - `rules/react.js` merges react + jsx-a11y into `reactRules`
  - Typed with `/** @type {import('oxlint').DummyRuleMap} */` on the maps
- File globs live in `extensionHelpers.js`: `jsTsFilesAll`, `jsTsFilesNode`, `tsFiles`, `jsxFiles`, `testFiles`
- Published `files`: `index.js`, `index.d.ts`, `extensionHelpers.js`, `rules/` (not `GAPS.md`)
- This package does **not** set `categories`, `options` (including `typeAware`), or wire plugins for consumers — consumers own `defineConfig` / plugins / overrides
- Source of truth for rule intent: sibling `eslint-config-harris`
- Unmapped ESLint rules are listed in `GAPS.md` (manual; local only; the old generate script was removed)
- License: MIT (`LICENSE`)

## Consumer config pattern

Compose rule maps + globs in the consumer root; enable the matching plugins on each override:

```ts
import { defineConfig } from 'oxlint';
import {
  ecmaRules,
  jsTsFilesAll,
  jsxFiles,
  reactRules,
  testFiles,
  tsFiles,
  typescriptRules,
  vitestRules,
} from 'oxlint-config-harris';

export default defineConfig({
  options: { typeAware: true }, // not shipped by this package; set here or use --type-aware
  overrides: [
    {
      files: jsTsFilesAll,
      plugins: ['eslint', 'import', 'oxc', 'promise'],
      rules: ecmaRules,
    },
    {
      files: tsFiles,
      plugins: ['typescript'],
      rules: typescriptRules,
    },
    {
      files: jsxFiles,
      plugins: ['react', 'jsx-a11y'],
      rules: reactRules,
    },
    {
      files: testFiles,
      plugins: ['vitest'],
      rules: vitestRules,
    },
  ],
});
```

Setting root `plugins` overwrites defaults (`unicorn` / `oxc`) — list every plugin you want, or set plugins per override as above.

Default file globs:

- `jsTsFilesAll` — `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`
- `jsTsFilesNode` — `**/*.{js,mjs,cjs,ts,mts,cts}`
- `tsFiles` — `**/*.{ts,mts,cts,tsx}`
- `jsxFiles` — `**/*.{jsx,tsx}`
- `testFiles` — `**/*.test.{js,mjs,cjs,ts,mts,cts}`, `**/*.spec.{jsx,tsx}`

Suggested pairing: `ecmaRules` ↔ `jsTsFilesAll`, `nodeRules` ↔ `jsTsFilesNode` + `['node']`, `typescriptRules` ↔ `tsFiles`, `reactRules` ↔ `jsxFiles`, `vitestRules` ↔ `testFiles`.

Type-aware needs `oxlint-tsgolint` plus `options.typeAware: true` or `--type-aware`.

## Local scripts

```bash
pnpm lint        # oxlint --deny-warnings
pnpm format      # oxfmt
pnpm typecheck   # tsc --noEmit (oxlint.config.ts only)
```

`tsconfig.json` includes only `oxlint.config.ts`. Package ships JS + `index.d.ts` (no build).

## Scope discipline

- Keep this package oxlint-only (no ESLint runtime dependency).
- Do not reintroduce unicorn/perfectionist/prettier plugins unless intentionally changing the shared defaults. Formatting is `oxfmt`, not Prettier.
- `oxlint.config.ts` in this repo is the local lint entry (ecma + typescript overrides); keep it out of published surface concerns.
