const _         = require('lodash');
const Utils     = require('@libs/utils');
const Serve     = require('@libs/serve');
const Build     = require('@libs/build');
const Generator = require('@libs/generator');

/**
 * 启动服务器
 * @exports libs/serve
 * @param {Array} apps 启动的app列表，默认为全部启动
 */
exports.serve = function(apps=[]){
  if(!_.isArray(apps)){
    Utils.Log.Error('<Serve>Invalid appname');
  }
  Serve(apps);
};
/**
 * 脚手架
 * @exports libs/generate
 * @param {string} appname app名称
 */
exports.generate = function(appname){
  if(!_.isString(appname)){
    Utils.Log.Error('<Generator>Invalid appname');
  }
  Generator(appname);
}
/**
 * 构建
 * @exports libs/build
 * @param {string} env 环境变量
 */
exports.build = function(env='testing'){
  try{
    Build(require(`@config/env/${env}`));
  }catch(e){
    Utils.Log.Error('<Build>Invalid environment variable');
  }
}