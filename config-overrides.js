const { useBabelRc, override, addWebpackPlugin } = require('customize-cra')
var webpack = require('webpack')

module.exports = override(
  useBabelRc(),
  addWebpackPlugin(new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery'
  }))
)
