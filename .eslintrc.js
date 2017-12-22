module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  extends: 'airbnb',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'generator-star-spacing': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'indent': 'off',
    'arrow-parens': 'off',
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'space-before-function-paren': 'off',
    'react/jsx-indent': 'off'
  },
};
