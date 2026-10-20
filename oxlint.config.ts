import harris from './index.ts';

// Root entry must default-export. Package rule no-restricted-exports bans `default`;
// this file is ignored via ignorePatterns in the shared config.
export default harris;
