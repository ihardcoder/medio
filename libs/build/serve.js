const Shell = require('shelljs');
const FS = require('fs-extra');
const Path = require('path');
const Glob = require('glob');
const Utils = require('@libs/utils');
const Paths = require('@config/common/path');
const BuildFileList = require('@config/build/serve').filelist;

const OUTPUTDIR = Paths.BUILD_ROOT_PATH;

module.exports = function(){
  Shell.rm('-rf',OUTPUTDIR);
  Shell.mkdir(OUTPUTDIR);
  Utils.Log.Loading(new Promise(resolve => {
    let fileList = [];
    BuildFileList.forEach(file => {
      fileList = fileList.concat(Glob.sync(file,{
        root: Paths.ROOT_PATH
      }));
    });
    resolve({
      msg: 'Building service files -> done\n',
      data: fileList,
    });
  }),'Building service files',files => {
    files.forEach(file => {
      FS.copySync(file,Path.join(OUTPUTDIR,file.replace(Paths.ROOT_PATH,'')),{
        overwrite: true,
        errorOnExist: false
      });
    });
  });
};