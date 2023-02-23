module.exports = {
  env: {
    commonjs: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    semi: [2, 'never'],
    quotes: [2, 'single'],
    'import/no-default-export': [2],
    'import/prefer-default-export': [0],
    'linebreak-style': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
}
