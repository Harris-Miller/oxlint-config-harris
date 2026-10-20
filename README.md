# oxlint-config-harris

Harris' shared [Oxlint](https://oxc.rs/) config, ported from [`eslint-config-harris`](../eslint-config-harris).

Requires `oxlint`, `oxlint-tsgolint`, and `typescript` (see `peerDependencies`). MIT licensed.

## Usage

Named configs — compose what you need. `index.js` re-exports; `index.d.ts` types them as `OxlintConfig`. There is no mono default config.

Oxlint `extends` merges `rules` / `plugins` / `overrides`. It does **not** merge `categories` or `options` — set those in the consumer root if you need them. These shareable configs only ship plugins + rules + file globs. Root `plugins` overwrites defaults (`unicorn` / `oxc`) — list every plugin you want, or rely on plugins set inside each config's overrides.

```ts
import { defineConfig } from 'oxlint';
import { ecma, react, typescript, vitest } from 'oxlint-config-harris';

export default defineConfig({
  extends: [ecma, typescript, react, vitest],
  options: { typeAware: true }, // not set by the typescript config; set here or use --type-aware
});
```

| Export       | Covers                                                        |
| ------------ | ------------------------------------------------------------- |
| `ecma`       | eslint + import + oxc + promise (JS/TS)                       |
| `node`       | node plugin (`**/*.{js,mjs,cjs,ts,mts,cts}`)                  |
| `typescript` | typescript plugin + rules (TS/TSX)                            |
| `react`      | react + jsx-a11y (JSX/TSX)                                    |
| `vitest`     | vitest plugin + rules (`*.test.{js…tsx}`, `*.spec.{jsx,tsx}`) |

Run with type-aware linting (`oxlint-tsgolint` required):

```bash
oxlint --type-aware
```

## Layout

| Path               | Role                                                               |
| ------------------ | ------------------------------------------------------------------ |
| `index.js`         | Named re-exports of `configs/*`                                    |
| `index.d.ts`       | Public types (`OxlintConfig` for each export)                      |
| `configs/`         | Composable `defineConfig` slices (`ecma`, `node`, `typescript`, …) |
| `rules/`           | Per-plugin rule maps (`eslint`, `import`, `oxc`, `promise`, …)     |
| `GAPS.md`          | ESLint rules with no oxlint equivalent yet                         |
| `oxlint.config.ts` | Local lint entry (`extends: [ecma]`)                               |

```bash
pnpm lint
pnpm format
```

## Docs

- Oxlint / Oxc docs index for LLMs: https://oxc.rs/llms.txt
- Human docs: https://oxc.rs/docs/guide/usage/linter.html
