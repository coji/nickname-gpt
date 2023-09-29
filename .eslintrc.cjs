/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    semi: ['error', 'never'],
  },
  ignorePatterns: ['node_modules', 'build', 'public/build'],
}