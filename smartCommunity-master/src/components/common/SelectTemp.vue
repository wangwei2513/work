<template>
  <div v-if="show">
    <div class="popup-box">
      <div class="popup-header">{{title}}</div>
      <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
      <div class="select-temp-content">
        <div class="template-box" v-for="temp in data" :key="temp.id">
          <div class="template-poster" :class="temp.id === tempSlected ? 'selected' : ''">
            <img :src="'http://' + temp.thumbNailImageUrl" :title="temp.moduleName" alt="" @click="changeSelect(temp)">
            <div class="template-preview" @click="showPreview(temp)">
              <span class="temp-name">{{temp.moduleName}}</span>
              <i class="ipanel-icon1 ipanel-icon-preview1"></i>
              <span>预览</span>
              </div>
            <div class="selected-cover" @click="changeSelect(temp)"><i class="ipanel-icon-bigok"></i></div>
          </div> 
        </div>
      </div>
      <div class="popup-btn">
        <el-button type="primary" :disabled="!tempSlected" @click="confirmSubmit">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <iframe-preview
      :show.sync="previewShow"
      :title="curPreTmp"
      :url="curPreTmpUrl"></iframe-preview>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import IframePreview from './IframePreview.vue'
  import API from './../../assets/js/api'
  export default {
    name: 'selectTemp',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      tempId: {
        type: [Number, String]
      },
      tempName: {
        type: [Number, String]
      },
      title: [String, Number],
      data: Array
    },
    data () {
      return {
        tempSlected: this.tempId || '',
        tempSlectedName: this.tempName || '',
        curPreTmp: '',
        curPreTmpUrl: '',
        previewShow: false
      }
    },
    watch: {
      tempId: {
        immediate: true,
        handler (val) {
          this.tempSlected = val
        }
      },
      tempName: {
        immediate: true,
        handler (val) {
          this.tempSlectedName = val
        }
      }
    },
    components: {
      IframePreview
    },
    methods: {
      changeSelect (temp) {
        let id = temp.id
        if (this.tempSlected === id) {
          this.tempSlected = ''
          this.tempSlectedName = ''
        } else {
          this.tempSlected = id
          this.tempSlectedName = temp.moduleName
        }
      },
      confirmSubmit () {
        var params = {
          id: this.tempSlected,
          name: this.tempSlectedName
        }
        this.$emit('finish-select-temp', params)
        this.close()
      },
      close () {
        this.curPreTmp = ''
        this.curPreTmpUrl = ''
        this.$emit('update:show', false)
      },
      showPreview (temp) {
        this.curPreTmp = temp.moduleName
        let params = {
          id: temp.id
        }
        this.axios.get(API.get_temp_preview_url, { params }).then((res) => {
          this.curPreTmpUrl = res.url
          this.previewShow = true
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    top: calc(50% - 274px);
    left: calc(50% - 508px);
    width: 1016px;
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
    height: 430px;
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
  .select-temp-btn{
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

