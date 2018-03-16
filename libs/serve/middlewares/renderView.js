const Pug = require('pug');
const Path = require('path');

const AppRootPath = Path.resolve(__dirname,'../../../app');
const TemplateRootPath = Path.resolve(__dirname,'../../../template');

module.exports = function(){
  return async function(ctx,next){
    const AppName = /^\/[\w\d_]+/.exec(ctx.request.path)&&/^\/([\w\d_]+)/.exec(ctx.request.path)[1]||undefined;

    ctx.response.renderView = ctx.renderView = function(name,locals){
      const ViewFileName = /\.pug?/.test(name) && name || `${name}.pug`;
      const ViewFilePath = `${AppRootPath}/${AppName}/view/${ViewFileName}`;
      const ViewRuntime = Pug.compileFile(ViewFilePath,{
        basedir: TemplateRootPath
      });
      return ViewRuntime(locals||{});
    };
    await next();
  }
}