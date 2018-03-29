<template>
  <section class="subway__list">
    <div class="head">
      <el-button type="warning" class="head__action head__action__update"
        icon="el-icon-upload"
        :disabled="selectedCity.length===0"
        @click="onBulkUpdate">批量更新</el-button>
    </div>
    <el-table
      border
      style="width: 100%"
      :data="dataList"
      @selection-change="onSelectionChange">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="city"
        label="城市"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        prop="version"
        label="版本"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="体积"
        :formatter="formatSize">
      </el-table-column>
      <el-table-column
        align="center"
        header-align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-upload"
            @click="updateCity(scope.row.pinyin,scope.row.city)">更新</el-button>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="downloadCity(scope.row.subwayUrl)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script>
export default {
  props: {
    dataList: {
      type: Array,
      required: true
    },
    env: {
      type: String
    }
  },
  data(){
    return {
      selectedCity: []
    };
  },
  methods: {
    formatSize(row){
      return `${(new Number(row.size/1024)).toFixed(0)}KB`;
    },
    downloadCity(url){
      const Filename = /(\w+\.zip)/.exec(url) || 'subway.zip';
      const DOMLink = document.createElement('a');
      DOMLink.download = Filename;
      DOMLink.href = url;
      DOMLink.click();
    },
    updateCity(city_en,city_zh){
      this.$emit('preUpdateCity',this.env, [{
        en: city_en,
        zh: city_zh
      }]);
    },
    onSelectionChange(val){
      this.selectedCity = val;
    },
    onBulkUpdate(){
      if(this.selectedCity.length === 0){
        return;
      }
      this.$emit('preUpdateCity',this.env, this.selectedCity.map(item => {
        return {
          zh: item.city,
          en: item.pinyin
        }
      }));
    }
  }
};
</script>
<style lang="scss">
.subway__list{
  .head{
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>