const Path = require('path');
const ROOT_PATH = Path.join(__dirname,'../../');

module.exports = {
  ROOT_PATH           : ROOT_PATH,
  APP_ROOT_PATH       : `${ROOT_PATH}app`,
  STATIC_COUTPUT_PATH : `${ROOT_PATH}public`,
  STATIC_LIBS_PATH    : `${ROOT_PATH}components/static`,
  TEMPLATE_ROOT_PATH  : `${ROOT_PATH}components/templates`
};