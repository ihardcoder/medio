const Path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ExtractCSS = new ExtractTextPlugin({
  filename: 'css/[name].[contenthash:8].css',
  allChunks: true
});

module.exports = {
  entry: {
    subway: Path.resolve(__dirname, './static/js/index.js')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractCSS.extract({
        use: [{
          loader: 'css-loader',
          options: {
            url: true,
            minimize: true
          }
        }],
        fallback: 'style-loader'
      })
    }]
  },
  plugins: [
    ExtractCSS
  ],
  resolve: {
    alias: {
      '@subway': Path.resolve(__dirname,'./static')
    }
  }
};