const Pug = require('pug');
const Paths = require('@config/common/path');

/**
 * @middleware
 */
module.exports = function(){
  return function(req,res,next){
    res.view = function(name,locals){
      const AppName = /\/(\w+)\/?$/.exec(req.originalUrl.split('?')[0])[1];
      const ViewFileName = /\.pug?/.test(name) && name || `${name}.pug`;
      const ViewFilePath = `${Paths.APP_ROOT_PATH}/${AppName}/view/${ViewFileName}`;
      const ViewRuntime = Pug.compileFile(ViewFilePath, {
        basedir: Paths.TEMPLATE_ROOT_PATH
      });
  
      res.send(ViewRuntime(locals || {}));
    }
    next();
  }
}