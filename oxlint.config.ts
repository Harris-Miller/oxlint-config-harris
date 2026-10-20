import { defineConfig } from 'oxlint';

import { ecma, typescript } from './index.ts';

// Root entry must default-export. Package rule no-restricted-exports bans `default`;
// this file is ignored via ignorePatterns in the shared config.
// extends skips categories/options — pull categories from ecma explicitly.
export default defineConfig({
  extends: [ecma, typescript],
  ignorePatterns: ['**/node_modules/**', '**/dist/**', 'scripts/**', 'oxlint.config.*'],
});
