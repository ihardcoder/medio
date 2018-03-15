const Fs = require('fs');
const Path = require('path');
const Yaml = require('js-yaml');

exports.ymlToJson = path => {
  if(!path){
    throw new Error('<YamlToJson>: Invalid path');
  }

  try{
    return Yaml.safeLoad(Fs.readFileSync(Path.resolve(__dirname, path)));
  }catch(e){
    throw new Error(e);
  }
};