<template>
  <div class="select-temp-box">
    <div class="select-temp-title">选择模板</div>
    <div class="select-temp-content">
      <div class="template-box" v-for="temp in temps" :key="temp.label">
        <h3 class="template-title">{{temp.label}}</h3>
        <div class="template-poster" :class="temp.label === tempSlected ? 'selected' : ''">
          <img :src="temp.poster" :alt="temp.label" @click="changeSelect(temp.label)">
          <div class="template-preview" @click="showPreview(temp.label)"><i class="ipanel-icon1 ipanel-icon-preview"></i>预览</div>
          <div class="selected-cover" @click="changeSelect(temp.label)"><i class="ipanel-icon-bigok"></i></div>
        </div> 
      </div>
    </div>
    <div class="select-temp-btn">
      <el-button type="primary" :disabled="!tempSlected" @click="confirmSubmit">提交</el-button>
    </div>
    <img-preview :title="curPreTmp" :show.sync="view.imgPreviewShow" :imgs="tempImages">
      <el-button @click="tempSlected = curPreTmp" class="temp-select" :type="curPreTmp === tempSlected?'primary':''">{{curPreTmp === tempSlected?'已选择':'未选择'}}</el-button>
    </img-preview>
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import ImgPreview from './../../common/ImgPreview.vue'
  export default {
    name: 'selectTemp',
    data () {
      return {
        tempSlected: '',
        temps: [],
        tempImages: [],
        curPreTmp: '',
        view: {
          imgPreviewShow: false
        }
      }
    },
    components: {
      ImgPreview
    },
    methods: {
      changeSelect (label) {
        if (this.tempSlected) {
          const curTemp = this.tempSlected
          this.tempSlected = curTemp === label ? '' : label
        } else {
          this.tempSlected = label
        }
      },
      getTemps () {
        const self = this
        this.$http.get(API.get_temp_list).then(function (res) {
          const resBody = res.body
          if (resBody.ret === 0) {
            self.temps = resBody.temps
          }
        })
      },
      getPreviewImgs () {
        const self = this
        this.$http.get(API.get_preview_imgs).then(function (res) {
          const resBody = res.body
          if (resBody.ret === 0) {
            self.tempImages = resBody.imgs
          }
        })
      },
      confirmSubmit () {
        this.$confirm('主题选择后不可修改，是否确认选择该主题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // TODO执行模板导入
          this.$emit('finishSelectTemp')
          this.$message({
            type: 'success',
            message: '模板选择成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '请重新选择'
          })
        })
      },
      showPreview (title) {
        this.curPreTmp = title
        this.view.imgPreviewShow = true
      }
    },
    created () {
      this.getTemps()
      this.getPreviewImgs()
    }
  }
</script>
<style scoped>
  .image-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .select-temp-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    color: #1f2d3d;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
  }
  .select-temp-content{
    height: 500px;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .template-box{
    width: 30%;
    margin: 10px 10px;
  }
  .template-title{
    text-align: center;
    color: #1f2d3d;
    font-size: 14px;
    padding: 10px 0;
  }
  .template-poster{
    width: 100%;
    position: relative;
  }
  .template-poster img{
    width: 100%;
  }
  .template-preview{
    position: absolute;
    bottom: 3px;
    left: 0;
    width: 100%;
    height: 30px;
    z-index: 9;
    color: #fff;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .selected-cover{
    display: none;
  }
  .selected .selected-cover{
    position: absolute;
    width: 100%;
    height: calc(100% - 3px);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(32,160,255,0.80);
  }
  .select-temp-btn{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .template-preview:hover{
    cursor: pointer;
  }
  .ipanel-icon-bigok{
    height: 48px;
    width: 48px;
    display: block;
    background: url(../../../assets/imgs/icon/bigok.png) no-repeat;
  }
  .temp-select{
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>

