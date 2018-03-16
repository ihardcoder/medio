const _ = require('lodash');
const Path = require('path');

module.exports = (name, routes) => {
  const Router = require('koa-router')();

  routes.forEach(route => {
    const Controller = require(`@app/${_.capitalize(name)}/controller/${route.controller}`);
    switch(route.type){
      case 'api':
        Router[route.method || 'all'](`/${route.name}`, async (ctx,next) => {
          ctx.body = await Controller[route.action](ctx);
          next();
        });
        break;
      case "page":
        Router.get(Path.join('/',route.path), async (ctx,next) => {
          ctx.body = await Controller[route.action](ctx);
          next();
        });
        break;
    }
  });
  return Router;
};