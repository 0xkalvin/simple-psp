module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'new-cap': 'off',
    'require-jsdoc': 'off',
    'no-shadow': 'off',
    'global-require': 'off',
    'no-param-reassign': 'off',
  },
};
