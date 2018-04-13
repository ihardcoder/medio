<template>
<section class="subway-admin">
  <el-breadcrumb separator-class="el-icon-arrow-right" class="navlist">
    <el-breadcrumb-item :to="{ path: '/' }">地铁图</el-breadcrumb-item>
    <el-breadcrumb-item>离线包管理</el-breadcrumb-item>
  </el-breadcrumb>
  <el-tabs type="border-card" v-loading="loading" @tab-click="showList">
    <el-tab-pane label="测试环境" env="test">
      <subway-list :dataList="cityListTest" env="testing" @preUpdateCity="preUpdateCity"></subway-list>
    </el-tab-pane>
    <el-tab-pane label="生产环境" env="prod">
      <subway-list :dataList="cityListProd" env="prod" @preUpdateCity="preUpdateCity"></subway-list>
    </el-tab-pane>
  </el-tabs>
  <subway-dialog-update 
    :show="showUpdateDialog"
    :city="targetCity"
    :status="updateStatus"
    :branchesOfBase="branchesOfBase"
    :branchesOfData="branchesOfData"
    @update="onUpdate"
    @close="showUpdateDialog=false">
  </subway-dialog-update>
</section>
</template>
<script>
import * as Constants from '@subway/js/constants';
import { getJsonp, Axios } from '@subway/js/utils';
import SubwayList from './_subway-list.vue';
import SubwayDialogUpdate from './_subway-dialog-update.vue';
export default {
  data(){
    return {
      loading: false,
      cityListProd: [],
      cityListTest: [],
      branchesOfBase: [],
      branchesOfData: [],
      targetEnv: 'testing',
      targetCity: [],
      showUpdateDialog: false,
      updateStatus: Constants.UPDATE_STATUS.EDIT
    };
  },
  watch: {
    showUpdateDialog(now,prev){
      if(now&&!prev){
        this.updateStatus = Constants.UPDATE_STATUS.EDIT;
      }
    }
  },
  mounted(){
    this.getList('test');
  },
  methods: {
    getList(env){
      if((env==='prod'&&this.cityListProd.length>0)||(env==='test'&&this.cityListTest.length>0)){
        return;
      }
      this.loading = true;
      const Url = env === 'prod' ? Constants.APIS.getSubwayListProd : Constants.APIS.getSubwayListTest;
      getJsonp({
        url: env === 'prod' ? Constants.APIS.getSubwayListProd : Constants.APIS.getSubwayListTest,
        jsonpCallback: 'cb'
      }, res => {
        if(env==='prod'){
          this.cityListProd = res.response && res.response.cities || [];
        }else{
          this.cityListTest = res.response && res.response.cities || [];
        }
        this.loading = false;
      });
    },
    showList(tab){
      this.getList(tab.$attrs.env);
    },
    preUpdateCity(env,city){
      this.targetEnv = env;
      this.targetCity = city;
      Axios.get(Constants.APIS.getSubwaySourceInfo,{
        auth: {
          username: this.$store.getters.UserName,
          password: this.$store.getters.UserType
        }
      }).then(res=>{
        if(res.data.code === 0){
          this.branchesOfBase = res.data.base || [];
          this.branchesOfData = res.data.data || [];
          this.showUpdateDialog = true;
        }else{
          throw res.data.msg || '请求失败';
        }
      }).catch(err => {
        this.$message.error(err);
        this.showUpdateDialog = false;
      });
    },
    onUpdate(br_base,br_data){
      if(!br_base||!br_data){
        this.$message.error('请选择更新内容');
        return;
      }
      this.updateStatus = Constants.UPDATE_STATUS.PACKING;
      Axios.post(Constants.APIS.subwayPack,{
        city: this.targetCity.map(city => {
          return city.en;
        }),
        branches: {
          base: br_base,
          data: br_data
        }
      },{
        auth: {
          username: this.$store.getters.UserName,
          password: this.$store.getters.UserType
        }
      }).then(res => {
        if(res.data.code === 0){
          this.updateStatus = Constants.UPDATE_STATUS.UPLOADING;
          return Axios.post(Constants.APIS.subwayRelease,{
            env: this.targetEnv
          },{
            auth: {
              username: this.$store.getters.UserName,
              password: this.$store.getters.UserType
            }
          });
        }else{
          throw res.data.msg || '打包失败';
        }
      }).then(res => {
        if(res.data.code === 0){
          this.updateStatus = Constants.UPDATE_STATUS.UPLOADED;
        }else{
          throw res.data.msg || '发布失败';
        }
      }).catch(err => {
        this.$message.error(err);
        this.updateStatus = Constants.UPDATE_STATUS.ERROR;
      });
    }
  },
  components: {
    SubwayList,
    SubwayDialogUpdate
  }
};
</script>
<style lang="scss">
.subway-admin{
  padding: 20px;
  .navlist{
    margin-bottom: 20px;
  }
}
</style>