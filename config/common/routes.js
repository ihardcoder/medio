module.exports = [{
  path: '/',
  label: '首页'
},{
  path: '/subway',
  label: '地铁图',
  subRoutes: [{
    path: '/subway#/data',
    label: '数据制备'
  },{
    path: '/subway#/admin',
    label: '离线包管理'
  }]
}];