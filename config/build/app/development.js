const Webpack = require('webpack');
const Merge = require('webpack-merge');
const StaticMapPulgin = require('../../../../webpack-staticmap-plugin');
const BasicWebpackConfig = require('./basic.js');

module.exports = Merge(BasicWebpackConfig, {
  devtool: '#source-map',
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    host: 'localhost',
    port: '8888',
    open: false,
    overlay: true,
    publicPath: '/',
    lazy: false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: false
    },
    overlay: {
      warnings: false,
      error: true
    },
    stats: {
      children: false,
      errors: true,
      colors: true,
      chunks: false,
      modules: false,
      chunkModules:false
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