require('module-alias/register');

const _    = require('lodash');
const Libs = require('@libs');

const Apps = process.argv[2]&&_.uniq(process.argv[2].split(',')) || [];

Libs.serve(Apps);