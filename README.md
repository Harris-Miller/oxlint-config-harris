# oxlint-config-harris

Harris' shared [Oxlint](https://oxc.rs/) config, ported from [`eslint-config-harris`](../eslint-config-harris).

Requires `oxlint`, `oxlint-tsgolint`, and `typescript` (see `peerDependencies`).

## Usage

Prefer re-exporting or spreading this config as your root `oxlint.config.ts`. Oxlint `extends` only merges `rules` / `plugins` / `overrides` — not `categories` or `options` — so `extends: [harris]` alone drops `typeAware` and re-enables default plugins unless you also set `plugins: []`.

```ts
export { default } from 'oxlint-config-harris';
```

Or merge with local options:

```ts
import harris from 'oxlint-config-harris';
import { defineConfig } from 'oxlint';

export default defineConfig({
  ...harris,
  env: { browser: true },
});
```

Run with type-aware linting:

```bash
oxlint --type-aware
```

## Layout

| Path                               | Role                                                              |
| ---------------------------------- | ----------------------------------------------------------------- |
| `index.ts`                         | Shared config (`plugins`, categories off, `typeAware`, overrides) |
| `rules/`                           | Rule maps: `ecma`, `typescript`, `react`, `vitest`                |
| `GAPS.md`                          | ESLint rules with no oxlint equivalent yet                        |
| `scripts/generate-from-eslint.mjs` | Regenerates rule files + `GAPS.md` from `eslint-config-harris`    |

```bash
pnpm generate
pnpm lint
pnpm typecheck
```

## Docs

- Oxlint / Oxc docs index for LLMs: https://oxc.rs/llms.txt
- Human docs: https://oxc.rs/docs/guide/usage/linter.html
