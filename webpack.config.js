var validator = require('webpack-validator')
var webpack = require('webpack')
var BannerPlugin = webpack.BannerPlugin
var path = require('path')
var fs = require('fs')

var filter = require('lodash/fp/filter')
var reduce = require('lodash/fp/reduce')
var compose = require('lodash/fp/compose')

var modules = fs.readdirSync('node_modules')

var ignoreBinaries = function (x) {
  return ['.bin'].indexOf(x) === -1
}

var reduceModules = function (nodeModules, mod) {
  nodeModules[mod] = 'commonjs ' + mod
  return nodeModules
}

var nodeModules = compose(
  reduce(reduceModules, {}),
  filter(ignoreBinaries)
)(modules)

var SRC_PATH = path.resolve('./src')
var ENTRY_PATH = path.resolve('./src/index.js')
var OUTPUT_PATH = path.resolve('./build')
var banner = `#!/usr/bin/env node
`

var banner0 = 'require("source-map-support").install()'

var config = {
  entry: ENTRY_PATH,
  output: {
    path: OUTPUT_PATH,
    filename: 'index.js'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: SRC_PATH,
        query: {
          cacheDirectory: true
        }
      }
    ]
  },
  externals: nodeModules,

  devtool: 'source-map',
  plugins: [
    // new BannerPlugin(banner0, {
    //   raw: true,
    //   entryOnly: false
    // }),
    new BannerPlugin(banner, {
      raw: true,
      entryOnly: true
    })
  ]
}

module.exports = validator(config)
