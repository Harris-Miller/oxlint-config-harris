import { defineConfig } from 'oxlint';

import { typescriptRules } from '../rules/typescript.ts';

const tsFiles = ['**/*.{ts,mts,cts,tsx}'];

/** TypeScript plugin + rules for TS/TSX only. */
export const typescript = defineConfig({
  options: {
    typeAware: true,
  },
  overrides: [
    {
      files: tsFiles,
      plugins: ['typescript'],
      rules: typescriptRules,
    },
  ],
});
