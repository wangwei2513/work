<template>
  <div v-if="show">
    <div class="popup-box">
      <div class="popup-header">内容页模板选择</div>
      <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
      <div class="select-temp-content">
        <div class="template-box" v-for="temp in temps" :key="temp.id">
          <div class="template-poster" :class="temp.id === tempSlected ? 'selected' : ''">
            <img :src="'http://' + temp.thumbNailImageUrl" :title="temp.moduleName" alt="" @click="changeSelect(temp.id)">
            <div class="template-preview" @click="showPreview(temp)">
              <span class="temp-name">{{temp.moduleName}}</span>
              <i class="ipanel-icon1 ipanel-icon-preview1"></i>
              <span>预览</span>
              </div>
            <div class="selected-cover" @click="changeSelect(temp.id)"><i class="ipanel-icon-bigok"></i></div>
          </div> 
        </div>
      </div>
      <div class="popup-btn">
        <el-button type="primary" @click="confirmSubmit">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
      <!-- 模板预览begin -->
      <iframe-preview
        :show.sync="view.iframePreviewShow"
        :url="previewUrl"
        :title="curPreTmp">
      </iframe-preview>
      <!-- 模板预览end -->
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import API from './../../assets/js/api.js'
  import IframePreview from './../common/IframePreview.vue'
  export default {
    name: 'selectTemp',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      value: {
        type: [Number, String]
      },
      topAreaId: [Number, String]
    },
    data () {
      return {
        tempSlected: this.value || null,
        temps: [],
        curPreTmp: '',
        previewUrl: '',
        view: {
          iframePreviewShow: false
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          this.tempSlected = val
        }
      }
    },
    components: {
      IframePreview
    },
    methods: {
      changeSelect (id) {
        if (this.tempSlected) {
          const curTemp = this.tempSlected
          this.tempSlected = curTemp === id ? '' : id
        } else {
          this.tempSlected = id
        }
      },
      getTemps () {
        var params = {
          page: 1,
          size: 999,
          areaId: this.topAreaId,
          moduleType: '3'
        }
        this.axios.get(API.get_temp_list, { params }).then((data) => {
          this.temps = data.rows
        })
      },
      getPreviewUrl (temp) {
        let params = {
          id: temp.id
        }
        return this.axios.get(API.get_temp_preview_url, { params }).then((data) => {
          this.previewUrl = data.url
        }).catch(() => {
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      },
      confirmSubmit () {
        this.$emit('finish-select-temp', this.tempSlected)
        this.close()
      },
      close () {
        this.$emit('update:show', false)
      },
      showPreview (temp) {
        this.getPreviewUrl(temp).then(() => {
          this.curPreTmp = temp.moduleName
          this.view.iframePreviewShow = true
        })
      }
    },
    created () {
      this.getTemps()
    }
  }
</script>
<style scoped>
  .popup-box{
    top: calc(50% - 274px);
    left: calc(50% - 510px);
    width: 1020px;
    height: 548px;
  }
  .image-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .select-temp-content{
    height: 440px;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .template-box{
    width: 300px;
    height: 170px;
    margin: 10px 10px;
    position: relative;
  }
  .template-title{
    text-align: center;
    color: #1f2d3d;
    font-size: 14px;
    padding: 10px 0;
  }
  .template-poster{
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    background-image: url(../../../static/imgs/icon/default.png);
    background-repeat: no-repeat;
    background-position: center;
  }
  .template-poster img{
    width: 100%;
    height: 100%;
    display: block;
  }
  .template-preview{
    position: absolute;
    bottom: 0px;
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
    justify-content: flex-start;
    align-items: center;
  }
  .selected-cover{
    display: none;
  }
  .selected .selected-cover{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(32,160,255,0.80);
  }
  .popup-btn{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .template-preview:hover{
    cursor: pointer;
  }
  .ipanel-icon1{
    display: block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  .ipanel-icon-bigok{
    height: 48px;
    width: 48px;
    display: block;
    background: url(../../assets/imgs/icon/bigok.png) no-repeat;
  }
  .temp-select{
    position: absolute;
    bottom: 0;
    right: 0;
  }
  .temp-name{
    margin-left: 20px;
    display: inline-block;
    width: 140px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .popup-cover{
    z-index: 1010;
  }
  .popup-box{
    z-index: 1011;
  }
</style>

