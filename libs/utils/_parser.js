const _ = require('lodash');
const Fs = require('fs');
const Path = require('path');
const Yaml = require('js-yaml');
const Utils = require('@libs/utils');

/**
 * @exports
 * @function ymlToJson 将YML格式文本转化为JSON
 * @param {string} path YML文件路径
 * @return 解析后的JSON数据
 */
exports.ymlToJson = path => {
  if(!path){
    throw new Error('<YamlToJson>: Invalid path');
  }

  try{
    return Yaml.safeLoad(Fs.readFileSync(Path.resolve(__dirname, path)));
  }catch(e){
    throw Utils.Log.Error(e);
  }
};

/**
 * @exports
 * @function formatLocals 格式化渲染View的locals数据
 * @param {Object} obj 原始locals数据
 * @return 格式化之后的locals数据
 */
exports.formatLocals = obj => {
  if(!_.isPlainObject(obj)||_.isEmpty(obj)){
    return {};
  }
  const Result = {};
  for(let key in obj){
    const Info = Path.parse(key);
    if(!Info.ext){
      continue;
    }
    Result[Info.name] = Result[Info.name] || {};
    Result[Info.name][/\.(\w+)/.exec(Info.ext)[1]] = obj[key];
  }

  return Result;
};