import { defineConfig } from 'oxlint';

import { vitestRules } from '../rules/vitest.ts';

export { vitestRules };

/**
 * Vitest plugin + rules. No file globs by default — set `overrides[].files`
 * in the consumer config to match the project's test naming.
 */
export const vitest = defineConfig({
  plugins: ['vitest'],
  overrides: [
    {
      files: [],
      rules: vitestRules,
    },
  ],
});
