import type { DummyRuleMap } from 'oxlint';

import { jsxA11yRules } from './jsx-a11y.ts';
import { reactPluginRules } from './react-plugin.ts';

export const reactRules: DummyRuleMap = {
  ...reactPluginRules,
  ...jsxA11yRules,
};
