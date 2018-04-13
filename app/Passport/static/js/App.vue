<template>
<div>
  <medio-header :currentRoute="'/'" :disableNav="true"></medio-header>
  <div class="sec-login">
    <el-form :model="submitData" :rules="validRules" label-position="right" label-width="70px">
      <el-form-item label="名称" prop="uname">
        <el-input v-model="submitData.uname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="submitData.password"></el-input>
      </el-form-item>
      <el-form-item class="login-form-item login-form-item_submit">
        <el-button type="primary" @click="submit" :disabled="!submitData.uname||!submitData.password">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import MedioHeader from '@components/header.vue';
export default {
  data(){
    return {
      submitData: {
        uname: '',
        password: ''
      },
      validRules: {
        uname: [{
          required: true,
          message: '请输入用户名称',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted(){
    if(document.cookie.indexOf('go2map_fe_ci_u')!==-1){
      window.location.href = Utils.getParameter('redirect')||'/home';
    }
  },
  methods: {
    submit(){
      const RedirectUrl = Utils.getParameter('redirect')||'/home';
      axios.post('/passport/login',{
        name: this.submitData.uname,
        password: this.submitData.password
      }).then(res => {
        const Info = res.data;
        if(Info.code === 0){
          window.location.href = RedirectUrl;
        }else{
          throw Info.msg || '登录失败';
        }
      }).catch(err=>{
        ELEMENT.Message.error(err);
      });
    }
  },
  components: {
    MedioHeader
  }
};
</script>
<style lang="scss">
@import '~@style/index.scss';
.sec-login{
  width: 500px;
  position: fixed;
  left: 50%;
  top: 50%;
  @include transform(translate(-50%,-50%));
  .login-form-item{
    &_submit{
      text-align: center;
      .el-button{
        width: 200px;
      }
    }
  }
}
</style>