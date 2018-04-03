const _ = require('lodash');
const Path = require('path');
const Paths = require('@config/common/path');
const Response = require('@config/response');
const UserList = require('./libs/users');
const IsDev = process.env.NODE_ENV === 'development';
const StaticFiles = !IsDev ? require(`${Paths.STATIC_COUTPUT_PATH}/passport/static.json`) : null;

const COOKIE_NAME_AUTH = 'go2map_fe_ci_u';

exports.homepage = (req, res) => {
  if (IsDev) {
    res.view('index');
  } else {
    res.view('index', StaticFiles);
  }
};

exports.login = (req, res) => {
  const {
    name,
    password
  } = req.body;
  if (!name || !password) {
    return res.json(Response.FAIL.PARAMS_INCOMPLETED);
  }
  const UserInfo = UserList.find(item => {
    return item.uname === name;
  });

  switch (true) {
    case !UserInfo:
      return res.json(Response.FAIL.NOT_FOUND);
    case UserInfo.password !== password:
      return res.json(Response.FAIL.PARAMS_INVALID);
    default:
      res.cookie(COOKIE_NAME_AUTH, `${name}_${UserInfo.type}`, {
        expires: new Date(Date.now + 1000 * 60 * 60 * 24 * 30)
      });
      return res.json(Response.SUCCESS.SUCCESS);
  }
};

exports.logout = (req, res) => {
  const {
    name
  } = req.query;
  if (!name) {
    return res.json(Response.FAIL.PARAMS_INCOMPLETED);
  }
  res.clearCookie(COOKIE_NAME_AUTH);
  return res.json(Response.SUCCESS.SUCCESS);
};