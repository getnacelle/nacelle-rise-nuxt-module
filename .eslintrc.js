module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['vue', 'ejs'],
  rules: {}
}
