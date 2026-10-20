import { defineConfig } from 'oxlint';

import { eslintRules } from '../rules/eslint.js';
import { importRules } from '../rules/import.js';
import { oxcRules } from '../rules/oxc.js';
import { promiseRules } from '../rules/promise.js';

const jsTsFiles = ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'];

/** ESLint core + import + oxc + promise for all JS/TS. */
export const ecma = defineConfig({
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
