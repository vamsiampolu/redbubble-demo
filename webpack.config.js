var validator = require('webpack-validator')
var webpack = require('webpack')
var path = require('path')
var NpmPlugin = require('npm-install-webpack-plugin')
var HtmlPlugin = require('html-webpack-plugin')
var template = require('html-webpack-template')

var SRC_PATH = path.resolve('./src')
var ENTRY_PATH = path.resolve('./src/index.js')
var OUTPUT_PATH = path.resolve('./build')
var ICONS_PATH = path.resolve('./src/icons')

var config = {
  entry: ENTRY_PATH,
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'standard',
        include: SRC_PATH
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: SRC_PATH,
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite',
        include: ICONS_PATH
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]']
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: OUTPUT_PATH,
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    inline: true,
    stats: 'errors-only',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 100
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      appMountId: 'root',
      inject: false,
      template: template
    }),
    new NpmPlugin({
      dev: function (module) {
        return /(^babel-?.*|.*-plugin$|.*-loader)/.test(module)
      }
    })
  ]
}

module.exports = validator(config)
