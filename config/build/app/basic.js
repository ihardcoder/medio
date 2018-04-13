const Paths = require('@config/common/path');
const Env = process.env.NODE_ENV || 'development';

module.exports = {
  context: Paths.APP_ROOT_PATH,
  mode: Env === 'development' ? 'development' : 'production',
  output: {
    path: Paths.STATIC_COUTPUT_PATH,
    publicPath: Env === 'production' ?Paths.DEPLOY_PATH:'/static/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  }
};