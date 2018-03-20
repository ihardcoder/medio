const Webpack = require('webpack');
const Utils = require('@libs/utils');
const Paths = require('@config/common/path');
const Shell = require('shelljs');

module.exports = function(webpackConfig){
  new Promise(resolve => {
    // clear output directory
    Shell.rm('-rf',Paths.STATIC_COUTPUT_PATH);
    Shell.mkdir('-p',Paths.STATIC_COUTPUT_PATH);
    Webpack(webpackConfig).run((err, stats) => {
      if (err) {
        throw err;
      }
      resolve(stats);
    });
  }).then(stats => {
    if (!stats||stats.hasErrors()) {
      throw stats&&stats.toJson().errors||'Build failed';
    }
    process.stdout.write(stats.toString({
      assets: true,
      colors: true,
      modules: false,
      performance: true,
      timings: true,
      warning: true,
      moduleTrace: true,
      children: false,
      chunks: false,
      errors: true,
      hash: false,
      chunkModules: false,
      version: false
    }) + '\n');
  }).catch(err=>{
    Utils.Log.Error(err);
  });
}