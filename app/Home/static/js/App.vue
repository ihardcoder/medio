<template>
<div>
  <medio-header :currentRoute="'/home'" :disableNav="false"></medio-header>
  首页
</div>
</template>
<script>
import MedioHeader from '@components/header.vue';
export default {
  components: {
    MedioHeader
  }
}
</script>