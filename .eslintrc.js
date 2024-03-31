export const env = {
  es2021: true,
  node: true,
};
export const parser = '@typescript-eslint/parser';
export const parserOptions = {
  ecmaVersion: 13,
  sourceType: 'module',
};
export const plugins = ['@typescript-eslint'];
export const rules = {
  'require-jsdoc': 0,
  'linebreak-style': 0,
  'no-shadow': 0,
  '@typescript-eslint/no-unused-vars': 2,
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      mjs: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
};
export const settings = {
  'import/resolver': {
    typescript: {},
  },
};
