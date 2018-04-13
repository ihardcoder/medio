const COOKIE_NAME_AUTH = 'go2map_fe_ci_u';

module.exports = function(list){
  const IsEmptyList = !list || list.length===0;
  return function(req,res,next){
    if(IsEmptyList){
      next();
    }else{
      const AppName = /\/(\w+)\/?$/.test(req.originalUrl.split('?')[0])&&/\/(\w+)\/?$/.exec(req.originalUrl.split('?')[0])[1]||undefined;
      if(AppName&&list.indexOf(AppName)!==-1&&!req.cookies[COOKIE_NAME_AUTH]){
        return res.redirect(`/passport?redirect=${encodeURIComponent(req.originalUrl)}`);
      }else{
        next();
      }
    }
  };
};