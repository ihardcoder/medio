const _ = require('lodash');
const Fs = require('fs');
const Ejs = require('ejs');
const Path = require('path');
const Utils = require('@libs/utils');

const Shell = require('shelljs');
const Glob = require('glob');
const Paths = require('@config/common/path');

function renderTpl(path,appname){
  return new Promise(resolve => {
    Ejs.renderFile(path,{
      appname
    },(err,content) => {
      if(err){
        Utils.Log.Error(err);
      }
      resolve(content);
    });
  }).then(content => {
    const TargetFile = path.split('.ejs')[0];
    return Fs.writeFileSync(TargetFile,content);
  }).then(() => {
    Shell.rm('-f',path);
  }).catch(err => {
    Utils.Log.Error(err);
  });
}

module.exports = appname => {
  if(!appname||/[^\w]/.test(appname)){
    Utils.Log.Error('请输入app名称');
  }
  const OUTPUT_PATH = `${Paths.APP_ROOT_PATH}/${_.capitalize(appname)}`;

  if(Fs.existsSync(OUTPUT_PATH)){
    Utils.Log.Error(`App:${appname} 已存在`);
  }

  Shell.mkdir('-p',OUTPUT_PATH);

  Shell.cp('-r',Path.resolve(__dirname,'./template/*'),OUTPUT_PATH);

  new Promise(resolve => {
    resolve(Glob.sync(`${OUTPUT_PATH}/**/*.ejs`));
  }).then(tpls => {
    tpls.forEach(async tpl => {
      await renderTpl(tpl,appname);
    });
  }).then(() => {
    Utils.Log.Success(`App:${appname}创建成功`);
  }).catch(err => {
    Utils.Log.Error(err);
  });
};