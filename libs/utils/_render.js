const Pug = require('pug');
const Paths = require('@config/common/path');

module.exports = function(path, name, locals) {
  const ViewFileName = /\.pug?/.test(name) && name || `${name}.pug`;
  const ViewFilePath = `${Paths.APP_ROOT_PATH}/subway/view/${ViewFileName}`;
  const ViewRuntime = Pug.compileFile(ViewFilePath, {
    basedir: Paths.TEMPLATE_ROOT_PATH
  });

  return ViewRuntime(locals || {});
}