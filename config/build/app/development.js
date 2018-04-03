const Webpack = require('webpack');
const Merge = require('webpack-merge');
const StaticMapPulgin = require('../../../../webpack-staticmap-plugin');
const BasicWebpackConfig = require('./basic.js');

module.exports = Merge(BasicWebpackConfig, {
  devtool: '#source-map',
  devServer: {
    clientLogLevel: 'info',
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    open: false,
    overlay: true,
    publicPath: '/',
    lazy: false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
    overlay: {
      warnings: false,
      error: true
    },
    stats: {
      assets: true,
      colors: true,
      errors: true,
      timings: true,
      warning: true,
      children: true,
      performance: true,
      hash: false,
      chunks: false,
      version: false,
      builtAt: false,
      modules: false,
      entrypoints: false,
      moduleTrace: false,
      chunkModules: false
    }
  },
  plugins: [
    new StaticMapPulgin({
      dev: true
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new Webpack.HotModuleReplacementPlugin(),
    new Webpack.NamedModulesPlugin(),
    new Webpack.NoEmitOnErrorsPlugin()
  ]
});