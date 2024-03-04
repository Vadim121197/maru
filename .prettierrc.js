module.exports = {
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: 'always',
  semi: false,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  importOrder: ['^react(.*)', '<THIRD_PARTY_MODULES>', '~/(.*)', '^[./]'],
  importOrderSeparation: true,
}
