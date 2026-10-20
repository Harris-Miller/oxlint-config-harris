import { defineConfig } from 'oxlint';

import { eslintRules } from '../rules/eslint.ts';
import { importRules } from '../rules/import.ts';
import { oxcRules } from '../rules/oxc.ts';
import { promiseRules } from '../rules/promise.ts';

const jsTsFiles = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

/** ESLint core + import + oxc + promise for all JS/TS. */
export const ecma = defineConfig({
  categories: {
    correctness: 'off',
    suspicious: 'off',
    pedantic: 'off',
    perf: 'off',
    style: 'off',
    restriction: 'off',
    nursery: 'off',
  },
  overrides: [
    {
      files: jsTsFiles,
      plugins: ['eslint', 'import', 'oxc', 'promise'],
      rules: {
        ...eslintRules,
        ...importRules,
        ...oxcRules,
        ...promiseRules,
      },
    },
  ],
});
