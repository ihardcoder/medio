const _ = require('lodash');
const Path = require('path');
const Express = require('express');

module.exports = (name, routes) => {
  const Router = Express.Router();

  routes.forEach(route => {
    const Controller = require(`@app/${_.capitalize(name)}/controller/${route.controller}`);
    switch (route.type) {
      case 'api':
        Router[route.method || 'all'](`/${route.name}`, (req, res, next) => {
          Controller[route.action](req, res);
          next();
        });
        break;
      case 'page':
        Router.get(Path.join('/', route.path), (req, res, next) => {
          Controller[route.action](req, res);
          next();
        });
        break;
    }
  });
  return Router;
};