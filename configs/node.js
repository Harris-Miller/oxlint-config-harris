import { defineConfig } from 'oxlint';

import { nodeRules } from '../rules/node.js';

const jsTsFiles = ['**/*.{js,mjs,cjs,ts,mts,cts}'];

/** Node plugin + rules (no file filter). */
export const node = defineConfig({
  files: jsTsFiles,
  plugins: ['node'],
  rules: nodeRules,
});
