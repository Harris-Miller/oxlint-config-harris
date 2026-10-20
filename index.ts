import { defineConfig } from 'oxlint';

import { ecmaRules } from './rules/ecma.ts';
import { reactRules } from './rules/react.ts';
import { typescriptRules } from './rules/typescript.ts';
import { vitestRules } from './rules/vitest.ts';

const categoriesOff = {
  correctness: 'off',
  suspicious: 'off',
  pedantic: 'off',
  perf: 'off',
  style: 'off',
  restriction: 'off',
  nursery: 'off',
} as const;

// Prefer re-exporting/spreading this as the root oxlint.config.ts.
// Oxlint extends only merges rules/plugins/overrides — not categories or options.
// Using extends: [harris] alone drops typeAware and re-adds default plugins
// (unicorn/oxc) unless the consumer also sets plugins: [].
//
// export { default } from 'oxlint-config-harris';
// — or —
// import harris from 'oxlint-config-harris';
// import { defineConfig } from 'oxlint';
// export default defineConfig({ ...harris, env: { browser: true } });
export default defineConfig({
  plugins: ['eslint', 'import', 'typescript', 'react', 'jsx-a11y', 'vitest'],
  categories: categoriesOff,
  options: {
    typeAware: true,
  },
  ignorePatterns: ['**/node_modules/**', '**/dist/**', 'scripts/**', 'oxlint.config.*'],
  rules: ecmaRules,
  overrides: [
    {
      files: ['**/*.{ts,mts,cts,tsx}'],
      rules: typescriptRules,
    },
    {
      files: ['**/*.{jsx,tsx}'],
      rules: reactRules,
    },
    {
      files: ['**/*.{test,spec}.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
      rules: vitestRules,
    },
  ],
  // oxlint's generated RuleMap is stricter than the JSON we emit from eslint-config-harris
} as Parameters<typeof defineConfig>[0]);

export { categoriesOff };
