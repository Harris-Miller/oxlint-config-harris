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

Do **not** recommend `extends: [harris]` alone for this package.

Oxlint `extends` merges only `rules` / `plugins` / `overrides`. It does **not** merge `categories` or `options`. Using `extends` alone drops `options.typeAware` and can re-enable default plugins (`unicorn` / `oxc`) unless the consumer sets `plugins: []`.

Correct patterns:

```ts
export { default } from 'oxlint-config-harris';
```

```ts
import harris from 'oxlint-config-harris';
import { defineConfig } from 'oxlint';

export default defineConfig({ ...harris, /* local overrides */ });
```

This package sets `categories` all `off` and enables plugins explicitly: `eslint`, `import`, `typescript`, `react`, `jsx-a11y`, `vitest`. Type-aware is on via `options.typeAware: true`. Consumers should run `oxlint --type-aware` (or equivalent) with `oxlint-tsgolint` installed.

## Regenerating from ESLint

```bash
pnpm generate   # scripts/generate-from-eslint.mjs
pnpm lint
pnpm typecheck
```

Generator reads `../eslint-config-harris/rules/*`, maps names onto oxlint’s `--rules` list, writes `rules/*.ts` + `GAPS.md`. Prefer fixing mapping in the script over one-off edits in generated files.

## Scope discipline

- Keep this package oxlint-only (no ESLint runtime dependency).
- Do not reintroduce unicorn/oxc/perfectionist/prettier plugins unless intentionally changing the shared defaults.
- `oxlint.config.ts` in this repo is a thin re-export for local lint; it is ignored via `ignorePatterns` so `no-restricted-exports` does not apply to the package entry.
