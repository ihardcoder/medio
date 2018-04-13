require('module-alias/register');
const _ = require('lodash');

const Env = process.env.NODE_ENV || 'production';
const Apps = process.argv[2] && _.uniq(process.argv[2].split(',')) || [];

require('@libs/serve')(Apps, Env==='production'?null:require('./_config'));