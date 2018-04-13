const Path = require('path');
const Paths = require('@config/common/path');
const IsDev = process.env.NODE_ENV === 'development';
const StaticFiles = !IsDev ? require(`${Paths.STATIC_COUTPUT_PATH}/home/static.json`) : null;

exports.homepage = (req, res) => {
  if(IsDev){
    res.view('index',global.home);
  }else{
    res.view('index',StaticFiles);
  }
};