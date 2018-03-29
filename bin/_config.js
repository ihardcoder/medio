const _ = require('lodash');
const Glob = require('glob');
const Merge = require('webpack-merge');
const Paths = require('@config/common/path');

const Env = process.env.NODE_ENV || 'testing';

const BasicWebpackConfig = require(`@config/build/app/${Env}.js`);

const Apps = process.argv[2] && _.uniq(process.argv[2].split(',')) || [];

const Pattern = Apps && Apps.length > 0 ? `${Paths.APP_ROOT_PATH}/[${apps.join('|')}]/conf.build.js` : `${Paths.APP_ROOT_PATH}/**/conf.build.js`;

module.exports = Glob.sync(Pattern).map(file => Merge(BasicWebpackConfig,require(file)));
