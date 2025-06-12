module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'require-jsdoc': 0,
    'linebreak-style': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-unused-vars': 2,
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
