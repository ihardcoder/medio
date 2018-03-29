const Path = require('path');
const Paths = require('@config/common/path');
const RenderView = require('@libs/utils').RenderView;
const IsDev = process.env.NODE_ENV === 'development';
const StaticFiles = !IsDev ? require(`${Paths.STATIC_COUTPUT_PATH}/subway/static.json`) : null;

exports.sourceinfo = (req, res) => {
  res.send('sourceinfo');
};
exports.pack = (req, res) => {
  res.send('pack');
};
exports.release = (req, res) => {
  res.send('release');
};
exports.homepage = (req, res) => {
  if(IsDev){
    res.send(RenderView(req.path, 'index',global.subway));  
  }else{
    res.send(RenderView(req.path, 'index',StaticFiles));
  }
};