<template>
  <div v-if="show">
    <div class="popup-box">
      <div class="popup-header">{{title}}</div>
      <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
      <div class="select-temp-tabs">
        <i-tabs
          :tabs="tabs"
          :activeTab="activeTab"
          @active-change="handleActiveChange">
        </i-tabs>
      </div>
      <div class="select-temp-content" v-loading="loading">
        <div class="template-box" v-for="temp in temps" :key="temp.id">
          <div class="template-poster" :class="temp.id === tempSlectedId ? 'selected' : ''">
            <img :src="temp.tmplAbbrPath" :title="temp.tmplName" alt="" @click="changeSelect(temp)">
            <div class="template-preview" @click="showPreview(temp)">
              <span class="temp-name">{{temp.tmplName}}</span>
              <i class="ipanel-icon1 ipanel-icon-preview1"></i>
              <span>预览</span>
              </div>
            <div class="selected-cover" @click="changeSelect(temp)"><i class="ipanel-icon-bigok"></i></div>
          </div> 
        </div>
      </div>
      <div class="popup-btn">
        <el-button type="primary" :disabled="!tempSlectedId" @click="confirmSubmit">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <iframe-preview
      :show.sync="previewShow"
      :title="curPreTmp"
      :url="curPreTmpUrl">
    </iframe-preview>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import IframePreview from './../../common/IframePreview.vue'
  import ITabs from './../../common/ITabs.vue'
  import API from './../../../assets/js/api'
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
      rootAreaId: [String, Number]
    },
    data () {
      return {
        temps: [],
        tempSlected: null,
        tempSlectedId: this.tempId || '',
        tempSlectedName: this.tempName || '',
        curPreTmp: '',
        curPreTmpUrl: '',
        activeTab: '1',
        tabs: [
          {
            id: '1',
            label: '带网格布局'
          },
          {
            id: '0',
            label: '不带网格布局'
          }
        ],
        previewShow: false,
        loading: false
      }
    },
    watch: {
      tempId: {
        immediate: true,
        handler (val) {
          this.tempSlectedId = val
        }
      },
      tempName: {
        immediate: true,
        handler (val) {
          this.tempSlectedName = val
        }
      },
      show: {
        handler (show) {
          show && this.getPortalTemps()
        }
      }
    },
    components: {
      IframePreview,
      ITabs
    },
    methods: {
      changeSelect (temp) {
        let id = temp.id
        if (this.tempSlectedId === id) {
          this.tempSlectedId = ''
          this.tempSlectedName = ''
          this.tempSlected = null
        } else {
          this.tempSlectedId = id
          this.tempSlectedName = temp.tmplName
          this.tempSlected = temp
        }
      },
      getPortalTemps () {
        let params = {
          page: 1,
          rows: 999,
          groupId: this.rootAreaId,
          useGrid: this.activeTab,
          terminalType: '-1'
        }
        this.loading = true
        this.axios.get(API.get_portal_temp_list, { params }).then((data) => {
          this.loading = false
          this.temps = data.rows
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '获取模板列表失败!',
            type: 'error'
          })
        })
      },
      handleActiveChange (tab) {
        this.activeTab = tab.id
        this.getPortalTemps()
      },
      confirmSubmit () {
        this.$emit('finish-select-temp', this.tempSlected)
        this.close()
      },
      close () {
        this.curPreTmp = ''
        this.curPreTmpUrl = ''
        this.$emit('update:show', false)
      },
      showPreview (temp) {
        this.curPreTmp = temp.tmplName
        let params = {
          id: temp.id
        }
        this.axios.get(API.get_temp_preview_url, { params }).then((res) => {
          this.curPreTmpUrl = res.url
          this.previewShow = true
        }).catch(() => {
          this.curPreTmpUrl = ''
          this.$message({
            message: '获取模板预览地址失败!',
            type: 'error'
          })
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
    height: 410px;
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
    background-image: url(../../../../static/imgs/icon/default.png);
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
    background: url(../../../../static/imgs/icon/bigok.png) no-repeat;
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

