<template>
<header class="ci-header">
  <el-menu
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :router="true"
    :default-active="current">
    <el-menu-item index="/" :disabled="disableNav">首页</el-menu-item>
    <el-submenu index="subway" :disabled="disableNav">
      <template slot="title">地铁图</template>
      <el-menu-item index="/subway/data">数据制备</el-menu-item>
      <el-menu-item index="/subway/admin">离线包管理</el-menu-item>
    </el-submenu>
    <el-submenu index="offline" :disabled="disableNav">
      <template slot="title">离线模板</template>
      <el-menu-item index="/offline/admin">管理</el-menu-item>
      <el-menu-item index="/offline/update">更新</el-menu-item>
    </el-submenu>
  </el-menu>
  <div class="header_userinfo" v-show="isLogin">
    <span class="userinfo_name">{{ username }}</span>
    <el-button type="danger" size="small" @click="logout">退出</el-button>
  </div>
</header>
</template>

<script>
export default {
  data(){
    return {
      current: '/'
    }
  },
  computed: {
    disableNav(){
      return this.$route.name === 'login';
    },
    isLogin(){
      return this.$store.getters.IsLogin;
    },
    username(){
      return this.$store.getters.UserName || '';
    }
  },
  methods: {
    logout(){
      this.$store.dispatch('logout');
    }
  }
};
</script>

<style lang="scss">
@import '../../style/part/_expend.scss';
.ci-header{
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