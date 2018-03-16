const Render = require('koa-views-render');
const Path = require('path');

exports.sourceinfo = ctx => {
  return 'sourceinfo';
};
exports.pack = ctx => {
  return 'pack';
};
exports.release = ctx => {
  return 'release';
};
exports.homepage = ctx => {
  return ctx.renderView('index');
  // return Pug.renderFile(Path.resolve(__dirname,'../view/index.pug'));
};