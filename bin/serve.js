require('module-alias/register');
const _ = require('lodash');

const Apps = process.argv[2] && _.uniq(process.argv[2].split(',')) || [];

require('@libs/serve')(Apps, require('./_config'));