import { defineConfig } from 'oxlint';

import { nodeRules } from '../rules/node.ts';

/** Node plugin + rules (no file filter). */
export const node = defineConfig({
  plugins: ['node'],
  rules: nodeRules,
});
