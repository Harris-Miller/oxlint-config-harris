/**
 * One-shot generator: merge eslint-config-harris effective rules → oxlint .ts configs + GAPS.md
 * Run from oxc-config-harris: node scripts/generate-from-eslint.mjs
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import eslintConfig from '../../eslint-config-harris/rules/eslint.js';
import importConfig from '../../eslint-config-harris/rules/import.js';
import reactConfig from '../../eslint-config-harris/rules/react.js';
import typescriptConfig from '../../eslint-config-harris/rules/typescript.js';
import vitestConfig from '../../eslint-config-harris/rules/vitest.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const oxlintBin = join(root, 'node_modules/.bin/oxlint');

const oxlintRules = JSON.parse(execFileSync(oxlintBin, ['--rules', '--format=json'], { encoding: 'utf8' }));
const oxlintSet = new Set(oxlintRules.map(r => `${r.scope.replaceAll('_', '-')}/${r.value}`));

function configRules(config) {
  const block = Array.isArray(config) ? config[0] : config;
  return { ...(block.rules ?? {}) };
}

function candidateNames(name) {
  if (name.startsWith('prettier/')) return [];
  if (name.startsWith('perfectionist/')) return [];
  if (name.startsWith('unicorn/')) return [];
  if (name.startsWith('react-redux/')) return [];

  if (name.startsWith('@typescript-eslint/')) {
    const base = name.slice('@typescript-eslint/'.length);
    // oxlint often ships extension rules under eslint/*, not typescript/*
    return [`typescript/${base}`, `eslint/${base}`];
  }
  if (name.startsWith('import-x/')) return [`import/${name.slice('import-x/'.length)}`];
  if (name.startsWith('react-hooks/')) return [`react/${name.slice('react-hooks/'.length)}`];
  if (name.startsWith('react-refresh/')) return [`react/${name.slice('react-refresh/'.length)}`];
  if (name.startsWith('jsx-a11y/')) return [name];
  if (name.startsWith('vitest/')) return [name];
  if (name.startsWith('react/')) return [name];
  if (name.startsWith('import/')) return [name];
  if (name.startsWith('typescript/')) return [name, `eslint/${name.slice('typescript/'.length)}`];
  if (name.startsWith('eslint/')) return [name, `typescript/${name.slice('eslint/'.length)}`];
  if (name.includes('/')) return [name];
  // core eslint rule — some only exist as typescript/* in oxlint (e.g. dot-notation)
  return [`eslint/${name}`, `typescript/${name}`];
}

function resolveOxlintName(name) {
  const candidates = candidateNames(name);
  if (candidates.length === 0) return { skip: true };
  for (const candidate of candidates) {
    if (oxlintSet.has(candidate)) return { name: candidate };
  }
  return { missing: candidates[0] };
}

function severityOf(value) {
  const s = Array.isArray(value) ? value[0] : value;
  if (s === 0 || s === 'off') return 'off';
  if (s === 1 || s === 'warn') return 'warn';
  if (s === 2 || s === 'error') return 'error';
  return null;
}

function normalizeValue(value) {
  if (!Array.isArray(value)) {
    const s = severityOf(value);
    return s ?? value;
  }
  const s = severityOf(value[0]);
  if (value.length === 1) return s;
  return [s, ...value.slice(1)];
}

function mapRules(eslintRules) {
  const mapped = {};
  const gaps = [];
  for (const [name, value] of Object.entries(eslintRules)) {
    const resolved = resolveOxlintName(name);
    if (resolved.skip) continue;
    const sev = severityOf(value);
    if (resolved.missing) {
      if (sev === 'warn' || sev === 'error') {
        gaps.push({ eslint: name, oxlint: resolved.missing, severity: sev });
      }
      continue;
    }
    mapped[resolved.name] = normalizeValue(value);
  }
  return { mapped, gaps };
}

function serializeRules(rules) {
  const entries = Object.entries(rules).sort(([a], [b]) => a.localeCompare(b));
  const lines = entries.map(([key, value]) => {
    return `  ${JSON.stringify(key)}: ${JSON.stringify(value)},`;
  });
  return `{\n${lines.join('\n')}\n}`;
}

function writeRulesModule(filePath, exportName, rules) {
  // Cast: JSON emission widens tuples to string[]; oxlint's RuleMap wants literal tuples.
  const body = `/** Ported from eslint-config-harris — regenerate via scripts/generate-from-eslint.mjs */
export const ${exportName} = ${serializeRules(rules)} as Record<string, unknown>;
`;
  writeFileSync(filePath, body);
}

function pluginDefaults(scope) {
  const out = {};
  for (const r of oxlintRules) {
    if (r.scope !== scope) continue;
    out[`${scope.replaceAll('_', '-')}/${r.value}`] = r.default ? 'error' : 'off';
  }
  return out;
}

function writeEcmaModule(filePath, groups) {
  const parts = Object.entries(groups).map(
    ([name, rules]) => `const ${name} = ${serializeRules(rules)} as Record<string, unknown>;`,
  );
  const body = `/** Ported from eslint-config-harris — regenerate via scripts/generate-from-eslint.mjs */
${parts.join('\n\n')}

export const ecmaRules = {
  ...eslintRules,
  ...importRules,
  ...oxcRules,
  ...promiseRules,
} as Record<string, unknown>;
`;
  writeFileSync(filePath, body);
}

const eslint = mapRules(configRules(eslintConfig));
const importX = mapRules(configRules(importConfig));
const typescript = mapRules(configRules(typescriptConfig));
const reactAll = mapRules(configRules(reactConfig));
const vitest = mapRules(configRules(vitestConfig));

// typescript/* resolved from eslint core → typescript.ts; rest stay in eslint group
const eslintMapped = {};
const tsFromEslint = {};
for (const [k, v] of Object.entries(eslint.mapped)) {
  if (k.startsWith('typescript/')) tsFromEslint[k] = v;
  else eslintMapped[k] = v;
}
const importMapped = importX.mapped;
const oxcMapped = pluginDefaults('oxc');
const promiseMapped = pluginDefaults('promise');
const ecmaMapped = { ...eslintMapped, ...importMapped, ...oxcMapped, ...promiseMapped };
const typescriptMapped = { ...tsFromEslint, ...typescript.mapped };

const rulesDir = join(root, 'rules');
mkdirSync(rulesDir, { recursive: true });

writeEcmaModule(join(rulesDir, 'ecma.ts'), {
  eslintRules: eslintMapped,
  importRules: importMapped,
  oxcRules: oxcMapped,
  promiseRules: promiseMapped,
});
writeRulesModule(join(rulesDir, 'typescript.ts'), 'typescriptRules', typescriptMapped);
writeRulesModule(join(rulesDir, 'react.ts'), 'reactRules', reactAll.mapped);
writeRulesModule(join(rulesDir, 'vitest.ts'), 'vitestRules', vitest.mapped);

const allGaps = [
  ...eslint.gaps.map(g => ({ ...g, source: 'eslint' })),
  ...importX.gaps.map(g => ({ ...g, source: 'import' })),
  ...typescript.gaps.map(g => ({ ...g, source: 'typescript' })),
  ...reactAll.gaps.map(g => ({ ...g, source: 'react' })),
  ...vitest.gaps.map(g => ({ ...g, source: 'vitest' })),
].sort((a, b) => a.oxlint.localeCompare(b.oxlint));

const gapsMd = `# Rules not migrated to oxlint

These rules are enabled (\`warn\`/\`error\`) in \`eslint-config-harris\` but have no built-in oxlint equivalent (or a different name that was not mapped). Regenerated by \`scripts/generate-from-eslint.mjs\`.

| Source | ESLint rule | Expected oxlint name | Severity |
|--------|-------------|----------------------|----------|
${allGaps.map(g => `| ${g.source} | \`${g.eslint}\` | \`${g.oxlint}\` | ${g.severity} |`).join('\n')}
`;

writeFileSync(join(root, 'GAPS.md'), gapsMd);

writeFileSync(
  join(root, 'index.ts'),
  `import { defineConfig } from 'oxlint';

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
  plugins: ['eslint', 'import', 'oxc', 'promise', 'typescript', 'react', 'jsx-a11y', 'vitest'],
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
`,
);

// Drop rule options oxlint rejects (keep severity).
const ruleModules = [
  [join(rulesDir, 'typescript.ts'), 'typescriptRules', typescriptMapped],
  [join(rulesDir, 'react.ts'), 'reactRules', reactAll.mapped],
  [join(rulesDir, 'vitest.ts'), 'vitestRules', vitest.mapped],
];
const ecmaGroups = {
  eslintRules: eslintMapped,
  importRules: importMapped,
  oxcRules: oxcMapped,
  promiseRules: promiseMapped,
};
const strippedOptions = [];
for (let i = 0; i < 200; i++) {
  let err = '';
  try {
    execFileSync(oxlintBin, ['--type-aware', '--deny-warnings'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    break;
  } catch (e) {
    err = `${e.stderr || ''}${e.stdout || ''}`;
  }
  if (!err.includes('Failed to build configuration')) break;
  const m = err.match(/Invalid configuration for rule `([^`]+)`:/);
  if (!m) break;
  const rule = m[1];
  let fixed = false;
  for (const [groupName, rules] of Object.entries(ecmaGroups)) {
    if (!(rule in rules) || !Array.isArray(rules[rule])) continue;
    strippedOptions.push({ rule, previous: rules[rule] });
    rules[rule] = rules[rule][0];
    writeEcmaModule(join(rulesDir, 'ecma.ts'), ecmaGroups);
    fixed = true;
    break;
  }
  if (!fixed) {
    for (const [filePath, exportName, rules] of ruleModules) {
      if (!(rule in rules) || !Array.isArray(rules[rule])) continue;
      strippedOptions.push({ rule, previous: rules[rule] });
      rules[rule] = rules[rule][0];
      writeRulesModule(filePath, exportName, rules);
      fixed = true;
      break;
    }
  }
  if (!fixed) break;
}

console.log(
  JSON.stringify(
    {
      counts: {
        ecma: Object.keys(ecmaMapped).length,
        typescript: Object.keys(typescriptMapped).length,
        react: Object.keys(reactAll.mapped).length,
        vitest: Object.keys(vitest.mapped).length,
        gaps: allGaps.length,
        strippedOptions: strippedOptions.length,
      },
      strippedOptions: strippedOptions.map(s => s.rule),
    },
    null,
    2,
  ),
);
