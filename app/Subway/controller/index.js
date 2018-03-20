const Path = require('path');
const Paths = require('@config/common/path');
const StaticFiles = require(`${Paths.STATIC_COUTPUT_PATH}/static-map.json`);

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
  return ctx.renderView('index',StaticFiles.subway);
};