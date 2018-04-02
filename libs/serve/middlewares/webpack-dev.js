const Webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function (webpackConfig){
  const WebpackCompiler = Webpack(webpackConfig);

  const DevMiddleware = WebpackDevMiddleware(WebpackCompiler, {
    clientLogLevel: 'error',
    // 不启用压缩
    compress: false,
    // no lazy mode
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