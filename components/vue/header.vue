<template>
<header class="medio_header">
  <el-menu
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="currentRoute">
    <template v-for="route in routes">
      <el-menu-item v-if="!route.subRoutes||route.subRoutes.length===0"
        :index="route.path" 
        :disabled="disableNav" 
        @click="gotoPage(route.path)">{{route.label}}</el-menu-item>
      <el-submenu v-else :index="route.path" :disabled="disableNav">
        <template slot="title">{{route.label}}</template>
        <el-menu-item v-for="(sub,index) in route.subRoutes"
          :key="index"
          :index="sub.path" 
          @click="gotoPage(sub.path)">{{sub.label}}</el-menu-item>
      </el-submenu>
    </template>
  </el-menu>
  <div class="header_userinfo" v-show="isLogin">
    <span class="userinfo_name">{{ username }}</span>
    <el-button type="danger" size="small" @click="logout">退出</el-button>
  </div>
</header>
</template>

<script>
import Routes from '../../config/common/routes';
export default {
  props: {
    currentRoute: {
      type: String,
      default: '/'
    },
    disableNav: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      isLogin: false,
      username: '',
      routes: Routes
    };
  },
  mounted(){
    const LocalUserInfo = Utils.getCookie('go2map_fe_ci_u');
    const [name,type] = LocalUserInfo && LocalUserInfo.split('_') || [undefined,undefined];
    if(name&&type){
      this.isLogin = true;
      this.username = name;
    }
  },
  methods: {
    logout(){
      console.log('logout')
    },
    gotoPage(page){
      window.location.href = page;
    }
  }
};
</script>

<style lang="scss">
@import '../styles/index.scss';
.medio_header{
  position: relative;
}
.header_userinfo{
  position: absolute;
  top: 50%;
  right: 20px;
  color: $color-golden;
  font-size: 16px;
  @include transform(translateY(-50%));
  .userinfo_name{
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>