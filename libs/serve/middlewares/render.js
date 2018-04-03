const _ = require('lodash');
const Pug = require('pug');
const Path = require('path');
const Paths = require('@config/common/path');
const IsDev = process.env.NODE_ENV === 'development' || false;

const DevLocals = {};

function getAssetsOfSingleCompilation(stats){
  const Info = stats.toJson({
    hash: true,
    publicPath: true,
    assets: true,
    chunks: false,
    modules: false,
    source: false,
    errorDetails: false,
    timings: false
  });

  const AppName = /^(\w+)\/.+/.exec(Info.assets[0].name)[1];
  const PublicPath = Info.publicPath;
  const Assets = Info.assetsByChunkName;
  const AssetsMap = {};

  for (let key in Assets) {
    AssetsMap[key] = AssetsMap[key] || {};
    if (_.isArray(Assets[key])) {
      Assets[key].forEach(file => {
        AssetsMap[key][Path.extname(file).split('.')[1]] = Path.join(PublicPath, file);
      });
    } else {
      AssetsMap[key][Path.extname(Assets[key]).split('.')[1]] = Path.join(PublicPath, Assets[key]);
    }
  }
  return {
    [AppName]: AssetsMap
  };
}

function getAssets(stats=[]) {
  if(!stats||stats.length === 0){
    return null;
  }
  const Result = {};
  stats.map(stat => {
    Object.assign(Result,getAssetsOfSingleCompilation(stat));
  });
  return Result;
}

/**
 * @middleware
 */
module.exports = function() {
  return function(req, res, next) {
    if(IsDev&&_.isEmpty(DevLocals)&&res.locals&&res.locals.webpackStats){
      Object.assign(DevLocals,getAssets(res.locals.webpackStats.stats)||{});
    }
    res.view = function(name, locals) {
      const AppName = /\/(\w+)\/?$/.exec(req.originalUrl.split('?')[0])[1];
      const ViewFileName = /\.pug?/.test(name) && name || `${name}.pug`;
      const ViewFilePath = `${Paths.APP_ROOT_PATH}/${AppName}/view/${ViewFileName}`;
      const ViewRuntime = Pug.compileFile(ViewFilePath, {
        basedir: Paths.TEMPLATE_ROOT_PATH
      });

      res.send(ViewRuntime(locals || DevLocals[AppName] || {}));
    };
    next();
  };
};