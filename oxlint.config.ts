import { defineConfig } from 'oxlint';

import { ecma } from './index.js';

export default defineConfig({
  extends: [ecma],
  ignorePatterns: ['node_modules'],
});
