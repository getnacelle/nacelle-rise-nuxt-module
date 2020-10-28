const path = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options.nacelle,
    ...moduleOptions
  }

  const domain =
    typeof options.shopifyDomain === 'string' &&
    options.shopifyDomain.split('.').shift()

  // Add plugin to Nuxt
  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: { domain },
    ssr: false
  })
}

module.exports.meta = require('../package.json')
