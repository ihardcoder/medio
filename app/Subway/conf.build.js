const Path = require('path');
const Webpack = require('webpack');
const Merge = require('webpack-merge');
const ConfOfVue = require('./conf.build.vue');

module.exports = Merge({
  entry: {
    index: Path.resolve(__dirname, './static/js/index.js'),
    test: Path.resolve(__dirname, './static/js/test.js'),
    common: ['vue']
  },
  output: {
    filename: 'subway/js/[name].[chunkhash:8].js',
    chunkFilename: 'subway/js/modules/[name].[chunkhash:8].js',
  },
  profile: true,
  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader','css-loader','sass-loader']
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'subway/assets/img/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'subway/assets/fonts/[name].[hash:7].[ext]'
      }
    }]
  },
  plugins: [
    new Webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'subway/js/common.[chunkhash:8].js'
    })
  ],
  resolve: {
    alias: {
      '@subway': Path.resolve(__dirname,'./static')
    }
  }
},ConfOfVue());