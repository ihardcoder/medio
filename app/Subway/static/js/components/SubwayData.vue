<template>
<section class="subway-data">
  <el-breadcrumb separator-class="el-icon-arrow-right" class="navlist">
    <el-breadcrumb-item :to="{ path: '/' }">地铁图</el-breadcrumb-item>
    <el-breadcrumb-item>数据制备</el-breadcrumb-item>
  </el-breadcrumb>
</section>
</template>
<script>
export default {
};
</script>
<style lang="scss">
.subway-data{
  padding: 20px;
  .navlist{
    margin-bottom: 20px;
  }
}
</style>