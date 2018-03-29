import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@subway/js/components/Home.vue';
import CiHeader from '@subway/js/components/_header.vue';
import Store from '@subway/js/store';

Vue.use(VueRouter);

const Router = new VueRouter({
  routes: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: { 
      requiresAuth: true 
    }
  },{
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "s-login" */'@subway/js/components/Login.vue')
  },{
    path: '/subway/data',
    name: 'subway-data',
    component: () => import(/* webpackChunkName: "s-data" */'@subway/js/components/SubwayData.vue'),
    meta: {
      requiresAuth: true 
    }
  },{
    path: '/subway/admin',
    name: 'subway-admin',
    component: () => import(/* webpackChunkName: "s-admin" */'@subway/js/components/SubwayAdmin.vue'),
    meta: { 
      requiresAuth: true 
    }
  }]
});

// 进入路由页面前判断是否需要登录
Router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)&&!Store.getters.IsLogin){
    Store.dispatch('getLocalUserInfo');
    if(!Store.getters.IsLogin){
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }else{
      next();
    }
  }else{
    next();
  }
});

// 监听登录状态变化
Store.watch(() => Store.getters.IsLogin, status => {
  // 登出后跳转登录页
  if(!status){
    Router.replace({
      path: '/login',
      query: {
        redirect: Router.currentRoute.fullPath
      }
    });
  }
});

new Vue({
  el: '#window',
  store: Store,
  router: Router,
  components: {
    CiHeader
  }
});

