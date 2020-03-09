module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:react/recommended', 'airbnb'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-native',
  ],
  env: {
    'react-native/react-native': true,
    node: true,
    mocha: true,
  },
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    'linebreak-style': ['error', 'windows'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'max-len': ['error', { code: 150 }],
    'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
    'react/forbid-prop-types': 0,
    'no-underscore-dangle': 0,
    'react/sort-comp': 0,
  },
};
