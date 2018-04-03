const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function (webpackConfig){
  const WebpackCompiler = Webpack(webpackConfig);

  const DevMiddleware = WebpackDevMiddleware(WebpackCompiler, {
    logLevel: 'info',
    hot: false,
    contentBase: false,
    open: false,
    publicPath: '/',
    compress: false,
    lazy: false,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 1000
    },
    serverSideRender: true,
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
  });

  const HotMiddleware = WebpackHotMiddleware(WebpackCompiler, {
    log: false,
    heartbeat: 2000
  });
  
  return {
    dev: DevMiddleware,
    hot: HotMiddleware
  };
};