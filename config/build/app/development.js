const Webpack = require('webpack');
const Merge = require('webpack-merge');
const BasicWebpackConfig = require('./basic.js');

module.exports = Merge(BasicWebpackConfig, {
  devtool: '#source-map',
  plugins: [
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