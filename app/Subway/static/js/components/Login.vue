<template>
<section class="sec-login">
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
</section>
</template>
<script>
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
  methods: {
    submit: async function(){
      await this.$store.dispatch('login', this.submitData);
      if(this.$store.getters.IsLogin){
        this.$router.replace(this.$route.query.redirect || '/');
      }
    }
  }
};
</script>
<style lang="scss">
@import '../../style/part/_expend.scss';
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