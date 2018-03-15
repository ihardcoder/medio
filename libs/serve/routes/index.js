const _ = require('lodash');

module.exports = (name, routes) => {
  const Router = require('koa-router')();
  routes.forEach(route => {
    const Method = route.method || 'all';
    const Controller = require(`@app/${_.capitalize(name)}/controller/${route.controller}`);
    Router[Method](`/${route.name}`, async (ctx,next) => {
      ctx.body = await Controller[route.action](ctx);
      next();
    });
  });
  return Router;
};