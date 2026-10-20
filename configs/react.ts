import { defineConfig } from 'oxlint';

import { reactRules } from '../rules/react.ts';
import { jsxA11yRules } from '../rules/jsx-a11y.ts';

const jsxFiles = ['**/*.{jsx,tsx}'];

/** React + jsx-a11y for JSX/TSX only. */
export const react = defineConfig({
  overrides: [
    {
      files: jsxFiles,
      plugins: ['react', 'jsx-a11y'],
      rules: {
        ...reactRules,
        ...jsxA11yRules,
      },
    },
  ],
});
