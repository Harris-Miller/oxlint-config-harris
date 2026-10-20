# oxlint-config-harris

Harris' shared [Oxlint](https://oxc.rs/) config, ported from [`eslint-config-harris`](../eslint-config-harris).

Requires `oxlint`, `oxlint-tsgolint`, and `typescript` (see `peerDependencies`). MIT licensed.

## Usage

Named configs — compose what you need. `index.ts` only re-exports; there is no mono default config.

Oxlint `extends` merges `rules` / `plugins` / `overrides`. It does **not** merge `categories` or `options` — set those in the consumer root if you need them. These shareable configs only ship overrides (plugins + rules + file globs). Root `plugins` overwrites defaults (`unicorn` / `oxc`) — list every plugin you want, or rely on plugins set inside each config's overrides.

```ts
import { defineConfig } from 'oxlint';
import { ecma, react, typescript, vitest, vitestRules } from 'oxlint-config-harris';

export default defineConfig({
  extends: [ecma, typescript, react, vitest],
  options: { typeAware: true }, // not set by the typescript config; set here or use --type-aware
  overrides: [
    {
      files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
      rules: vitestRules, // vitest ships rules with files: []
    },
  ],
});
```

| Export       | Covers                                      |
| ------------ | ------------------------------------------- |
| `ecma`       | eslint + import + oxc + promise (JS/TS)     |
| `node`       | node plugin                                 |
| `typescript` | typescript plugin + rules (TS/TSX)          |
| `react`      | react + jsx-a11y (JSX/TSX)                  |
| `vitest`     | vitest plugin; no file globs until you set them |
| `vitestRules`| Rule map to attach under your own test globs |

Run with type-aware linting (`oxlint-tsgolint` required):

```bash
oxlint --type-aware
```

## Layout

| Path              | Role                                                              |
| ----------------- | ----------------------------------------------------------------- |
| `index.ts`        | Named re-exports of `configs/*`                                   |
| `configs/`        | Composable `defineConfig` slices (`ecma`, `node`, `typescript`, …) |
| `rules/`          | Per-plugin rule maps (`eslint`, `import`, `oxc`, `promise`, …)    |
| `GAPS.md`         | ESLint rules with no oxlint equivalent yet                        |
| `oxlint.config.ts`| Local lint entry (`extends: [ecma, typescript]`)                  |

```bash
pnpm lint
pnpm typecheck
pnpm format
```

## Docs

- Oxlint / Oxc docs index for LLMs: https://oxc.rs/llms.txt
- Human docs: https://oxc.rs/docs/guide/usage/linter.html
