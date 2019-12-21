module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/semi': [
      'error',
      'always',
      { omitLastInOneLineBlock: true }
    ],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    quotes: ['error', 'single', { avoidEscape: true }],
    'no-shadow': ['error', { builtinGlobals: true, hoist: 'all' }],
    'no-useless-catch': 'error',
    'arrow-parens': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }]
  }
};
