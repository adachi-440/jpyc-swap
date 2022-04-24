module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  settings: {},
  rules: {
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': [
      2,
      {
        html: 'enforce',
        custom: 'ignore',
        explicitSpread: 'enforce',
      },
    ],
  },
};