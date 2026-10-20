# oxlint-config-harris

Harris' shared [Oxlint](https://oxc.rs/) rule maps and file globs, ported from [`eslint-config-harris`](../eslint-config-harris).

Requires `oxlint`, `oxlint-tsgolint`, and `typescript` (see `peerDependencies`). MIT licensed.

## Usage

This package ships **rule maps** and **file globs** — not ready-made `defineConfig` slices. Wire plugins + `overrides` in the consumer.

`index.js` re-exports; `index.d.ts` types rule maps as `DummyRuleMap`. There is no mono default config.

Root `plugins` overwrites oxlint defaults (`unicorn` / `oxc`) — list every plugin you want on each override (or at root). `categories` / `options` (including `typeAware`) are never set here; set those in the consumer if needed.

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
  options: { typeAware: true }, // set here or use --type-aware
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

### Rule maps

| Export            | Covers                          |
| ----------------- | ------------------------------- |
| `ecmaRules`       | eslint + import + oxc + promise |
| `nodeRules`       | node                            |
| `typescriptRules` | typescript                      |
| `reactRules`      | react + jsx-a11y                |
| `vitestRules`     | vitest                          |

### File globs

| Export          | Patterns                                                   |
| --------------- | ---------------------------------------------------------- |
| `jsTsFilesAll`  | `**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}`                     |
| `jsTsFilesNode` | `**/*.{js,mjs,cjs,ts,mts,cts}`                             |
| `tsFiles`       | `**/*.{ts,mts,cts,tsx}`                                    |
| `jsxFiles`      | `**/*.{jsx,tsx}`                                           |
| `testFiles`     | `**/*.test.{js,mjs,cjs,ts,mts,cts}`, `**/*.spec.{jsx,tsx}` |

Suggested pairing: `ecmaRules` ↔ `jsTsFilesAll`, `nodeRules` ↔ `jsTsFilesNode`, `typescriptRules` ↔ `tsFiles`, `reactRules` ↔ `jsxFiles`, `vitestRules` ↔ `testFiles`.

Run with type-aware linting (`oxlint-tsgolint` required):

```bash
oxlint --type-aware
```

## Layout

| Path                  | Role                                                        |
| --------------------- | ----------------------------------------------------------- |
| `index.js`            | Named re-exports of rule maps + globs                       |
| `index.d.ts`          | Public types (`DummyRuleMap` + `string[]` globs)            |
| `extensionHelpers.js` | File glob constants                                         |
| `rules/`              | Rule maps (`ecma`, `node`, `react`, `typescript`, `vitest`) |
| `GAPS.md`             | ESLint rules with no oxlint equivalent yet (not published)  |
| `oxlint.config.ts`    | Local lint entry (ecma + typescript overrides)              |
| `tsconfig.json`       | Types `oxlint.config.ts` only                               |

```bash
pnpm lint
pnpm format
pnpm typecheck
```

## Docs

- Oxlint / Oxc docs index for LLMs: https://oxc.rs/llms.txt
- Human docs: https://oxc.rs/docs/guide/usage/linter.html
