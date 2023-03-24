const organizeImports = require('prettier-plugin-organize-imports')

module.exports = {
  "semi": false,
  "trailingComma": "all",
  "singleQuote": true,
  plugins: [organizeImports],
}
