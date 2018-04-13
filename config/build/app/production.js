const Webpack = require('webpack');
const Merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StaticMapPulgin = require('webpack-staticmap-plugin');
const BasicWebpackConfig = require('./basic.js');
const Paths = require('@config/common/path');

module.exports = Merge(BasicWebpackConfig,{
  devtool: false,
  plugins: [
    new StaticMapPulgin({
      publicPath: `${Paths.DEPLOY_PATH}`
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
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