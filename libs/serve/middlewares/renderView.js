const _ = require('lodash');
const Pug = require('pug');
const Path = require('path');
const Utils = require('@libs/utils');
const Paths = require('@config/common/path');

module.exports = function(){
  return async function(ctx,next){
    const AppName = /^\/[\w\d_]+/.exec(ctx.request.path)&&/^\/([\w\d_]+)/.exec(ctx.request.path)[1]||undefined;

    ctx.response.renderView = ctx.renderView = function(name,locals){
      const ViewFileName = /\.pug?/.test(name) && name || `${name}.pug`;
      const ViewFilePath = `${Paths.APP_ROOT_PATH}/${AppName}/view/${ViewFileName}`;
      const ViewRuntime = Pug.compileFile(ViewFilePath,{
        basedir: Paths.TEMPLATE_ROOT_PATH
      });
    
      return ViewRuntime(locals||{});
    };
    await next();
  }
};