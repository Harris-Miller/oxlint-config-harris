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
- Entry: `index.ts` (TypeScript source exported directly; no build step)
- Rules live in `rules/*.ts`; do not hand-edit generated maps unless the generator cannot express the change
- Source of truth for rule intent: sibling `eslint-config-harris`
- Unmapped ESLint rules are listed in `GAPS.md` (regenerated)

## Consumer config pattern

Named configs: `ecma`, `node`, `typescript`, `react`, `vitest` (from `configs/`). Compose in the consumer root — `index.ts` only re-exports; it does not ship a mono `defineConfig`.

Oxlint `extends` merges only `rules` / `plugins` / `overrides`. It does **not** merge `categories` or `options`. Set `categories` / `options.typeAware` in the root config. Setting `plugins` overwrites defaults (`unicorn` / `oxc`) — list every plugin you want (or `plugins: []` plus override plugins).

```ts
import { defineConfig } from 'oxlint';
import { ecma, react, typescript, vitest, vitestRules } from 'oxlint-config-harris';

export default defineConfig({
  extends: [ecma, typescript, react, vitest],
  plugins: ['eslint', 'import', 'oxc', 'promise', 'typescript', 'react', 'jsx-a11y', 'vitest'],
  categories: ecma.categories, // extends does not merge categories
  options: { typeAware: true },
  overrides: [
    {
      files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
      rules: vitestRules, // vitest config ships rules with files: []
    },
  ],
});
```

`vitest` enables the plugin and rules but matches no files until the consumer sets globs. Type-aware needs `oxlint-tsgolint` and `options.typeAware: true` (or `--type-aware`).

## Regenerating from ESLint

```bash
pnpm generate   # scripts/generate-from-eslint.mjs
pnpm lint
pnpm typecheck
```

Generator reads `../eslint-config-harris/rules/*`, maps names onto oxlint’s `--rules` list, writes `rules/*.ts` + `GAPS.md`. Prefer fixing mapping in the script over one-off edits in generated files.

## Scope discipline

- Keep this package oxlint-only (no ESLint runtime dependency).
- Do not reintroduce unicorn/perfectionist/prettier plugins unless intentionally changing the shared defaults.
- `oxlint.config.ts` in this repo is a thin re-export for local lint; it is ignored via `ignorePatterns` so `no-restricted-exports` does not apply to the package entry.
