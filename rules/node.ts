/** Oxlint node plugin rules — all off; options filled with schema defaults where present. */
export const nodeRules = {
  'node/callback-return': ['off', ['callback', 'cb', 'next']],
  'node/exports-style': ['off', 'module.exports', { allowBatchAssign: false }],
  'node/global-require': 'off',
  'node/handle-callback-err': ['off', 'err'],
  'node/no-exports-assign': 'off',
  'node/no-mixed-requires': ['off', { grouping: false, allowCall: false }],
  'node/no-new-require': 'off',
  'node/no-path-concat': 'off',
  'node/no-process-env': ['off', { allowedVariables: [] }],
  'node/no-sync': ['off', { allowAtRootLevel: false, ignores: [] }],
  'node/no-top-level-await': ['off', { ignoreBin: false }],
} as Record<string, unknown>;
