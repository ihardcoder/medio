// debug
require('module-alias/register');

const _ = require('lodash');
const Koa = require('koa');
const CORS = require('@koa/cors');
const BodyParser = require('koa-bodyparser');
const Utils = require('@libs/utils');
const Glob = require('glob');
const Path = require('path');
const Routes = require('./routes');
const Router = require('koa-router')();

const Server = new Koa();

const AppRootPath = Path.resolve(__dirname,'../../app');

function loadAppConfig(apps = undefined) {
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

function lift(){
  Server.use(CORS({
    credentials: true,
    allowMethods: 'GET,POST'
  }))
  .use(BodyParser())
  .use(Router.routes())
  .use(Router.allowedMethods());

  Server.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
}

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
// debug
launch(['subway'])
module.exports = apps => {
  launch(apps);
};