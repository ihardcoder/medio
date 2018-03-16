const _          = require('lodash');
const Koa        = require('koa');
const Glob       = require('glob');
const Path       = require('path');
const CORS       = require('@koa/cors');
const Views      = require('koa-views');
const Router     = require('koa-router')();
const BodyParser = require('koa-bodyparser');
const RenderView = require('./middlewares/renderView');

const Utils      = require('@libs/utils');
const Constans   = require('@libs/contants');
const Routes     = require('./routes');

const Env        = _.includes(Constans.ENV,process.ENV) && process.NODE_ENV || 'testing';
const ConfigEnv  = require(`@config/env/${Env}`);

const PORT = ConfigEnv.port || 3000;
const Server = new Koa();

const AppRootPath = Path.resolve(__dirname,'../../app');

/**
 * @private
 * @function lift 启动服务器
 */
function lift(){
  Server
  .use(RenderView())
  .use(CORS({
    credentials: true,
    allowMethods: 'GET,POST'
  }))
  .use(BodyParser())
  .use(Router.routes())
  .use(Router.allowedMethods());

  Server.listen(PORT, () => {
    console.log('Server is listening on port 3000');
  });
}

/**
 * @private
 * @function execute 解析应用程序的配置
 * @param {Object} conf 应用程序配置
 * @return {Promise}
 */
function execute(conf){
  if(_.isEmpty(conf) || !conf.name || !conf.routes || !_.isArray(conf.routes)){
    Utils.Log.Error('<Serve>Invalid configuration for application(s)');
    return;
  }
  return new Promise(resolve => {
    const SubRouter = Routes(conf.name, conf.routes);
    Router.use(`/${conf.name}`,SubRouter.routes(),SubRouter.allowedMethods());
    resolve();
  }).catch(err=>{
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
  let configFiles = null;
  if (_.isEmpty(apps)) {
    configFiles = Glob.sync(`${AppRootPath}/**/conf.yml`);
  } else {
    configFiles = apps.map(name => {
      return `${AppRootPath}/${_.capitalize(name)}/conf.yml`
    });
  }
  return new Promise(resolve => {
    resolve(configFiles);
  }).catch(err=>{
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
  const ConfigFiles = await loadAppConfig(apps);
  if(_.isEmpty(ConfigFiles)){
    Utils.Log.Error('<Serve>Not found application(s)');
  }
  ConfigFiles.forEach(async conf => {
    await execute(Utils.Parser.ymlToJson(conf));
  });
  lift();
}

/**
 * @module libs/serve
 * @param {Array} apps 启动的应用程序列表
 */
module.exports = apps => {
  launch(apps);
};