const Path = require('path');
const Paths = require('@config/common/path');
const StaticMapPulgin = require('../../../../webpack-staticmap-plugin');
const Env = process.env.NODE_ENV || 'testing';

module.exports = {
  context: Paths.APP_ROOT_PATH,
  output: {
    path: Paths.STATIC_COUTPUT_PATH,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/modules/[name].[chunkhash:8].js',
    publicPath: '/static/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/img/[hash:8].[ext]'
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/media/[hash:8].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/fonts/[hash:7].[ext]'
      }
    }]
  },
  plugins: [
    new StaticMapPulgin()
  ]
};