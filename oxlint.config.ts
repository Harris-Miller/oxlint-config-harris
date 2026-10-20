import { defineConfig } from 'oxlint';

import { ecmaRules, jsTsFilesAll, tsFiles, typescriptRules } from './index.js';

export default defineConfig({
  ignorePatterns: ['node_modules'],
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
  ],
});
