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
- Entry: `index.js` (JS + JSDoc; no build step); typings in `index.d.ts` (`OxlintConfig`)
- Named exports only: `ecma`, `node`, `typescript`, `react`, `vitest` — no mono default config, no `vitestRules` export
- Rule maps live in `rules/*.js` (per plugin: `eslint`, `import`, `oxc`, `promise`, `node`, `react`, `jsx-a11y`, `typescript`, `vitest`); typed with `/** @type {import('oxlint').DummyRuleMap} */`
- Composable configs live in `configs/*.js` and wire plugins + file globs around the rule maps only — they do **not** set `categories` or `options` (including `typeAware`)
- Source of truth for rule intent: sibling `eslint-config-harris`
- Unmapped ESLint rules are listed in `GAPS.md` (manual; the old generate script was removed)
- License: MIT (`LICENSE`)

## Consumer config pattern

Compose named configs in the consumer root:

```ts
import { defineConfig } from 'oxlint';
import { ecma, react, typescript, vitest } from 'oxlint-config-harris';

export default defineConfig({
  extends: [ecma, typescript, react, vitest],
  options: { typeAware: true }, // not shipped by typescript; set here or use --type-aware
});
```

Oxlint `extends` merges only `rules` / `plugins` / `overrides`. It does **not** merge `categories` or `options` — set those in the consumer if needed. Setting root `plugins` overwrites defaults (`unicorn` / `oxc`) — list every plugin you want, or leave root unset and use plugins from each config's overrides.

Default file globs:

- `ecma` — `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`
- `node` — `**/*.{js,mjs,cjs,ts,mts,cts}`
- `typescript` — `**/*.{ts,mts,cts,tsx}`
- `react` — `**/*.{jsx,tsx}`
- `vitest` — `**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`, `**/*.spec.{jsx,tsx}`

Type-aware needs `oxlint-tsgolint` plus `options.typeAware: true` or `--type-aware` (the `typescript` config does not enable it).

## Local scripts

```bash
pnpm lint        # oxlint --deny-warnings
pnpm format      # oxfmt
```

No `typecheck` script / `tsconfig.json` — package ships JS + `index.d.ts` only.

## Scope discipline

- Keep this package oxlint-only (no ESLint runtime dependency).
- Do not reintroduce unicorn/perfectionist/prettier plugins unless intentionally changing the shared defaults. Formatting is `oxfmt`, not Prettier.
- `oxlint.config.ts` in this repo is the local lint entry (`extends: [ecma]`); keep it out of published surface concerns.
