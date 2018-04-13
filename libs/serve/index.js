const _ = require('lodash');
const Glob = require('glob');
const Path = require('path');
const Express = require('express');
const CORS = require('cors');
const CookieParser = require('cookie-parser');
const Utils = require('@libs/utils');
const Constans = require('@libs/constants');
const Paths = require('@config/common/path');
const MW_RenderView = require('./middlewares/render');
const MW_Auth = require('./middlewares/auth');
const Routes = require('./routes');

const ENV_CURRENT = _.includes(Constans.ENV, process.env.NODE_ENV) && process.env.NODE_ENV || Constans.ENV.PRODUCTION;

const GLOBAL_CONFIG = require(`@config/env/${ENV_CURRENT}`);

const PORT = GLOBAL_CONFIG.port || 3000;

const Server = new Express();

/**
 * @private
 * @function launchDevMiddlewares 加载开发中间件
 */
function launchDevMiddlewares(webpackConfig) {
  const WebpackMiddleWare = require('./middlewares/webpack-dev')(webpackConfig);
  Server.use(WebpackMiddleWare.dev).use(WebpackMiddleWare.hot);
}

/**
 * @private
 * @function lift 启动服务器
 */
function lift() {
  Server.listen(PORT, () => {
    Utils.Log.Info('Server is listening on port 3000');
  });
}

/**
 * @private
 * @function genRoutes 解析应用程序的配置
 * @param {Object} conf 应用程序配置
 * @return {Promise}
 */
function genRoutes(conf) {
  if (_.isEmpty(conf) || !conf.name || !conf.routes || !_.isArray(conf.routes)) {
    Utils.Log.Error('<Serve>Invalid configuration for application(s)');
    process.exit(1);
  }
  return {
    path: `/${conf.name}`,
    index: conf.index || false,
    routes: Routes(conf.name, conf.routes)
  };
}

/**
 * @async 
 * @private 
 * @function loadAppConfig 获取应用程序配置文件的路径
 * @param {Array} apps 应用程序列表
 * @return {Promise} 
 */
function loadAppConfig(apps = []) {
  const AppRootPath = Path.resolve(__dirname, '../../app');
  return new Promise(resolve => {
    if (_.isEmpty(apps)) {
      resolve(Glob.sync(`${AppRootPath}/**/conf.yml`));
    } else {
      resolve(apps.map(name => {
        return `${AppRootPath}/${_.capitalize(name)}/conf.yml`;
      }));
    }
  });
}

/**
 * @async 
 * @private 
 * @function launch 启动应用程序服务
 * @param {Array} apps 启动的应用程序列表
 */
async function launch(apps) {
  // 需授权的app
  const RequireAuthApps = [];
  // 所有app的路由列表
  const AppRoutes = [];
  // 读取app配置
  const ConfigFiles = await loadAppConfig(apps).catch(err => {
    Utils.Log.Error(err);
  });
  if (_.isEmpty(ConfigFiles)) {
    Utils.Log.Error('<Serve>Not found application(s)');
  }

  // 启用中间件
  Server
    .use('/libs', Express.static(Paths.STATIC_LIBS_PATH))
    .use('/static', Express.static(Paths.STATIC_COUTPUT_PATH))
    .use(Express.json())
    .use(CookieParser())
    .use(MW_RenderView());

  if(GLOBAL_CONFIG.enableCors){
    Server.use(CORS({
      credentials: true
    }));
  }

  // 解析各app配置
  ConfigFiles.forEach(conf => {
    const AppConfig = Utils.Parser.ymlToJson(conf);
    if(AppConfig.auth){
      RequireAuthApps.push(AppConfig.name);
    }
    const Result = genRoutes(AppConfig);
    AppRoutes.push(Result);
  });

  if(RequireAuthApps.length > 0){
    Server.use(MW_Auth(RequireAuthApps));
  }

  AppRoutes.forEach(app => {
    Server.use(app.path,app.routes);
    if(app.index){
      Server.get('/', (req,res) => {
        return res.redirect(app.path);
      });
    }
  });
}

/**
 * @module libs/serve
 * @param {Array} apps 启动的应用程序列表
 * @param {Object|null} webpackConfig webpack配置
 */
module.exports = async (apps, webpackConfig) => {
  if (webpackConfig && ENV_CURRENT === 'development') {
    launchDevMiddlewares(webpackConfig);
  }
  await launch(apps);
  lift();
};