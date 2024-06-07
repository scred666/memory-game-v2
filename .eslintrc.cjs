/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['import'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-underscore-dangle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        "": 'never',
        json: 'always',
        svg: 'always',
        css: 'always',
        scss: 'always',
        vue: 'always',
        js: 'always',
        ts: 'always'
      }
    ],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue-scoped-css/enforce-style-type': 'off',
    'comma-dangle': ['error', 'never'],
    'arrow-parens': ['error', 'as-needed'],
    semi: 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        pathGroups: [
          {
            pattern: '@/**/*.{j,t}s?(x)',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@/{component,view}s/**/.vue',
            group: 'internal',
            position: 'after'
          }
        ],
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always'
      }
    ],
    'vue/no-unused-refs': 'error'
  }
}
