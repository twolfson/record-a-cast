module.exports = {
  // Inherit from our package
  extends: 'eslint-config-twolfson',

  rules: {
    'no-console': 0,
  },

  // Configure our environment
  // http://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    node: true,
    mocha: true
  }
};
