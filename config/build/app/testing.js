const Path = require('path');
const Webpack = require('webpack');
const Merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BasicWebpackConfig = require('./basic.js');

module.exports = Merge(BasicWebpackConfig,{
  devtool: false,
  plugins: [
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: false,
      parallel: true
    }),
    new Webpack.HashedModuleIdsPlugin(),
    new Webpack.optimize.ModuleConcatenationPlugin()
  ]
});