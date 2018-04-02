<template>
<el-dialog 
  class="ci__subway__dialog"
  center
  :visible="show"
  :title="'更新城市：'+cityNames"
  @close="onClose">
  <section class="dialog__body">
    <section class="status" v-show="showStatusInfo">
      <ul class="status__list">
        <li class="status__item status__item__pack">
          <el-progress type="circle" :width="40" class="progress"
            :percentage="percentageOfPack" 
            :status="statusOfPack"></el-progress>
          <span class="label">{{ labelOfPack }}</span>
        </li>
        <li class="status__item status__item__upload">
          <el-progress type="circle" :width="40" class="progress"
            :percentage="percentageOfUpload"
            :status="statusOfUpload"></el-progress>
          <span class="label">{{ labelOfUpload }}</span>
        </li>
      </ul>
    </section>
    <section class="pool">
      <div class="pool__item pool__item__base">
        <div class="head">选择内核分支</div>
        <el-radio-group v-model="branchOfBase">
          <div class="branch__item" v-for="br in branchesOfBase">
            <el-radio :label="br"></el-radio>
            <span>{{br}}</span>
          </div>
        </el-radio-group>
      </div>
      <div class="pool__item pool__item__data">
        <div class="head">选择数据分支</div>
        <el-radio-group v-model="branchOfData">
          <div class="branch__item" v-for="br in branchesOfData">
            <el-radio :label="br"></el-radio>
            <span>{{br}}</span>
          </div>
        </el-radio-group>
      </div>
    </section>
    <div class="arrow">
      <i class="el-icon-back"></i>
    </div>
    <section class="result">
      <div class="head">更新内容</div>
      <div class="body">
        <ul class="content">
          <li class="content__item">
            <span class="content__label">内核</span>
            <span class="content__branch">{{branchOfBase}}</span>
          </li>
          <li class="content__item">
            <span class="content__label">数据</span>
            <span class="content__branch">{{branchOfData}}</span>
          </li>
        </ul>
      </div>
    </section>
  </section>  
  <div class="action">
    <el-button type="info" disabled v-show="!enableSubmit||disableAction">确定</el-button>
    <el-button type="primary" @subwayclick="onSubmit" v-show="enableSubmit&&!disableAction">确定</el-button>
  </div>
</el-dialog>
</template>

<script>
import {UPDATE_STATUS} from '@subway/js/constants';
export default {
  props: {
    status: {
      type: String,
      default: UPDATE_STATUS.EDIT
    },
    show: {
      type: Boolean,
      default: false
    },
    city: {
      type: Array,
      default: []
    },
    branchesOfBase: {
      type: Array,
      default: []
    },
    branchesOfData: {
      type: Array,
      default: []
    }
  },
  data(){
    return {
      branchOfBase: '',
      branchOfData: 'master',
      percentageOfPack: 0,
      percentageOfUpload: 0,
      timerOfPack: null,
      timerOfUpload: null,
      disableAction: false
    };
  },
  computed: {
    cityNames(){
      return this.city.map(name => {
        return name.zh
      }).join('/');
    },
    enableSubmit(){
      return this.branchOfBase&&this.branchOfData;
    },
    showStatusInfo(){
      return this.status !== UPDATE_STATUS.EDIT;
    },
    statusOfPack(){
      if(this.percentageOfPack === 100){
        return 'success';
      }else if(this.percentageOfPack === -1){
        return 'exception';
      }
      return '';
    },
    statusOfUpload(){
      if(this.percentageOfUpload === 100){
        return 'success';
      }else if(this.percentageOfUpload === -1){
        return 'exception';
      }
      return '';
    },
    labelOfPack(){
      if(this.percentageOfPack === 100){
        return '打包完成';
      }else if(this.percentageOfPack === 0){
        return '等待打包';
      }
      return '打包中...';
    },
    labelOfUpload(){
      if(this.percentageOfUpload === 100){
        return '发布成功';
      }else if(this.percentageOfUpload === 0){
        return '等待发布';
      }
      return '发布中...';
    }
  },
  watch: {
    show(now){
      if(!now){
        this.branchOfBase = '';
        this.branchOfData = 'master';
        this.disableAction = false;
        this.percentageOfPack = 0;
        this.percentageOfUpload = 0;
      }
    },
    status(now,prev){
      switch(now){
        case UPDATE_STATUS.PACKING:
          this.timerOfPack = setInterval(() => {
            if(this.percentageOfPack === 99){
              clearInterval(this.timerOfPack);
              this.timerOfPack = null;
            }else{
              this.percentageOfPack += 1;
            }
          },50);
          break;
        case UPDATE_STATUS.PACKED:
          this.percentageOfPack = 100;
          clearInterval(this.timerOfPack);
          this.timerOfPack = null;
          break;
        case UPDATE_STATUS.UPLOADING:
          this.percentageOfPack = 100;
          clearInterval(this.timerOfPack);
          this.timerOfPack = null;
          this.timerOfUpload = setInterval(() => {
            if(this.timerOfUpload === 99){
              clearInterval(this.timerOfUpload);
              this.timerOfUpload = null;
            }else{
              this.timerOfUpload += 1;
            }
          },50);
          break;
        case UPDATE_STATUS.UPLOADED:
          this.percentageOfUpload = 100;
          clearInterval(this.timerOfUpload);
          this.timerOfUpload = null;
          break;
        case UPDATE_STATUS.ERROR:
          if(prev === UPDATE_STATUS.PACKING){
            clearInterval(this.timerOfPack);
            this.timerOfPack = null;
            this.percentageOfPack = -1;
          }else if(prev === UPDATE_STATUS.UPLOADING){
            clearInterval(this.timerOfUpload);
            this.timerOfUpload = null;
            this.percentageOfUpload = -1;
          }
          break;
      }
    }
  },
  methods: {
    onSubmit(){
      this.disableAction = true;
      this.$emit('update',this.branchOfBase,this.branchOfData);
    },
    onClose(){
      this.$emit('close');
    }
  }
};
</script>
<style lang="scss">
@import '../../style/_expend.scss';
.ci__subway__dialog{
  .dialog__body{
    position: relative;
  }
  .el-dialog--center .el-dialog__body{
    text-align: center !important;
    position: relative;
  }
  .status{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    &::before{
      content: '';
      display: block;
      background-color: #fff;
      opacity: 0.8;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .status__list{
      position: absolute;
      top: 50%;
      left: 50%;
      text-align: left;
      @include transform(translate(-50%,-50%));
    }
    .status__item{
      font-size: 20px;
      text-align: left;
      @include strictHeight(50px);
      &__pack{
        margin-bottom: 15px;
      }
    }
    .progress,.label{
      display: inline-block;
      vertical-align: middle;
    }
  }
  .head{
    background-color: $color-grey;
    text-align: center;
    border-bottom: solid 1px $color-darkgrey;
    @include strictHeight(30px);
  }
  .pool{
    width: 200px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    text-align: left;
    .pool__item{
      border: solid 1px $color-darkgrey;
      overflow: hidden;
      @include border-radius(4px);
      &__base{
        margin-bottom: 20px;
      }
      .branch__item{
        padding: 0 10px;
        @include strictHeight(30px);
      }
      .el-radio{
        vertical-align: middle;
      }
    }
  }
  .arrow{
    display: inline-block;
    width: 50px;
    @include transform(rotate(180deg) scale(2));
  }
  .result{
    border: solid 1px $color-darkgrey;
    overflow: hidden;
    width: 200px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    @include border-radius(4px);
    .content__item{
      text-align: left;
      @include strictHeight(30px);
      &:nth-child(1){
        border-bottom: solid 1px $color-grey;
      }
    }
    .content__label {
      display: inline-block;
      background-color: $color-lightgrey;
      width: 50px;
      text-align: center;
    }
  }
  .action{
    margin-top: 20px;
    .el-button{
      width: 100%;
      margin: 0;
    }
  }
}
</style>