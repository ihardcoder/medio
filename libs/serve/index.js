const _ = require('lodash');
const Glob = require('glob');
const Path = require('path');
const Express = require('express');
const CORS = require('cors');
const Utils = require('@libs/utils');
const Constans = require('@libs/contants');
const Paths = require('@config/common/path');
const MW_RenderView = require('./middlewares/render');
const Routes = require('./routes');

const ENV_CURRENT = _.includes(Constans.ENV, process.env.NODE_ENV) && process.env.NODE_ENV || 'testing';

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
    /* eslint-disable */
    console.log('Server is listening on port 3000');
    /* eslint-enable */
  });
}

/**
 * @private
 * @function execute 解析应用程序的配置
 * @param {Object} conf 应用程序配置
 * @return {Promise}
 */
function execute(conf) {
  if (_.isEmpty(conf) || !conf.name || !conf.routes || !_.isArray(conf.routes)) {
    Utils.Log.Error('<Serve>Invalid configuration for application(s)');
    return;
  }
  return new Promise(resolve => {
    const SubRouter = Routes(conf.name, conf.routes);
    Server.use(`/${conf.name}`, SubRouter);
    resolve();
  }).catch(err => {
    Utils.Log.Error(err);
  });
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
  }).catch(err => {
    Utils.Log.Error(err);
  });
}

/**
 * @async 
 * @private 
 * @function launch 启动应用程序服务
 * @param {Array} apps 启动的应用程序列表
 */
async function launch(apps) {
  // 读取app配置
  const ConfigFiles = await loadAppConfig(apps);
  if (_.isEmpty(ConfigFiles)) {
    Utils.Log.Error('<Serve>Not found application(s)');
  }

  // 启用中间件
  Server
    .use('/libs', Express.static(Paths.STATIC_LIBS_PATH))
    .use('/static', Express.static(Paths.STATIC_COUTPUT_PATH))
    .use(Express.json())
    .use(MW_RenderView());

  if(GLOBAL_CONFIG.enableCors){
    Server.use(CORS({
      credentials: true
    }));
  }

  // 解析各app的配置
  ConfigFiles.forEach(async conf => {
    await execute(Utils.Parser.ymlToJson(conf));
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