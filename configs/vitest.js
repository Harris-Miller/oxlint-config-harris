import { defineConfig } from 'oxlint';

import { vitestRules } from '../rules/vitest.js';

const testFiles = ['**/*.test.{js,mjs,cjs,jsx,ts,mts,cts,tsx}', '**/*.spec.{jsx,tsx}'];

/** Vitest plugin + rules for `*.test.*` (all JS/TS) and `*.spec.{jsx,tsx}`. */
export const vitest = defineConfig({
  plugins: ['vitest'],
  overrides: [
    {
      files: testFiles,
      rules: vitestRules,
    },
  ],
});
