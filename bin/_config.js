const _ = require('lodash');
const Glob = require('glob');
const Merge = require('webpack-merge');
const Paths = require('@config/common/path');

const Env = process.env.NODE_ENV || 'testing';

const BasicWebpackConfig = require(`@config/build/app/${Env}.js`);

const Apps = process.argv[2] && _.uniq(process.argv[2].split(',')) || [];

module.exports = (apps => {
  if(apps && apps.length > 0){
    return apps.map(app => {
      return Merge(BasicWebpackConfig,require(`${Paths.APP_ROOT_PATH}/${app}/conf.build.js`));
    });
  }
  return Glob.sync(`${Paths.APP_ROOT_PATH}/**/conf.build.js`).map(file => {
    return Merge(BasicWebpackConfig,require(file));
  });
})(Apps);
