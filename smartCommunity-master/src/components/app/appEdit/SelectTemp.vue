<template>
  <div class="select-temp-box">
    <div class="select-temp-tabs">
      <i-tabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="handleActiveChange">
      </i-tabs>
    </div>
    <div class="select-temp-content" v-if="temps.length>0">
      <div class="template-box" v-for="temp in temps" :key="temp.moduleName">
        <h3 class="template-title">{{temp.moduleName}}</h3>
        <div class="template-poster" :class="temp.id === tempSlected ? 'selected' : ''">
          <img :src="'http://' + temp.thumbNailImageUrl" @click="changeSelect(temp)">
          <div v-if="previewNode" class="template-preview" @click="preview(temp)"><i class="ipanel-icon1 ipanel-icon-preview1"></i>预览</div>
          <div class="selected-cover" @click="changeSelect(temp)"><i class="ipanel-icon-bigok"></i></div>
        </div>
      </div>
    </div>
    <div class="select-temp-content no-content" v-else>
      该标签下暂无模板!
    </div>
    <div class="select-temp-btn">
      <el-button type="primary" :disabled="!tempSlected" @click="confirmSubmit">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <iframe-preview
      :show.sync="view.iframePreviewShow"
      :url="previewUrl"
      :title="curPreview">
    </iframe-preview>
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import ITabs from './../../common/ITabs.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'selectTemp',
    props: {
      curNode: Object,
      appInfo: Object,
      previewNode: Boolean,
      rootAreaId: [String, Number],
      userRightList: Array
    },
    data () {
      return {
        temps: [],
        tempImages: [],
        curPreview: '',
        previewUrl: '',
        tempSlected: '',
        activeTab: '',
        view: {
          iframePreviewShow: false
        }
      }
    },
    components: {
      IframePreview,
      ITabs
    },
    computed: {
      tabs () {
        let tabs = []
        let tabs1 = [{
          id: '2',
          label: '独立页模板'
        },
        {
          id: '1',
          label: '嵌套页模板'
        },
        {
          id: '4',
          label: '父模板'
        }]
        let tabs2 = [{
          id: '2',
          label: '独立页模板'
        }]
        let tabs3 = [{
          id: '5',
          label: '子模板'
        }]
        if (this.curNode.pModuleType && '' + this.curNode.pModuleType === '4') {
          tabs = tabs3
          this.activeTab = '5'
        } else {
          tabs = this.curNode.level === 2 ? tabs1 : tabs2
          this.activeTab = '2'
        }
        return tabs
      }
    },
    watch: {
      activeTab: {
        handler (newVal) {
          newVal && this.getAppTemps()
        }
      }
    },
    methods: {
      changeSelect (temp) {
        if (this.tempSlected) {
          const curTemp = this.tempSlected
          this.tempSlected = curTemp === temp.id ? '' : temp.id
        } else {
          this.tempSlected = temp.id
        }
      },
      getAppTemps () {
        // TODO 如果moduleType为子模板,需要指定关联的父模板的id
        var params
        var url
        if ('' + this.activeTab === '5') {
          params = {
            parentId: this.curNode.pModule
          }
          url = API.get_sub_temp_list
        } else {
          params = {
            page: 1,
            size: 999,
            areaId: this.rootAreaId,
            moduleType: this.activeTab
          }
          url = API.get_temp_list
        }
        
        this.axios.get(url, { params }).then((data) => {
          this.temps = data.rows
          this.initSelect()
        })
      },
      initSelect () {
        this.temps.forEach(function (temp) {
          if (temp.id === this.curNode.moduleId) {
            this.curPreview = temp.moduleName
            this.tempSlected = temp.id
          }
        }, this)
      },
      getPreviewUrl (temp) {
        let params = {
          id: temp.id
        }
        return this.axios.get(API.get_temp_preview_url, { params }).then((data) => {
          this.previewUrl = data.url
        })
      },
      preview (temp) {
        if (this.userRightList.includes('previewModule')) {
          this.curPreview = temp.moduleName
          this.getPreviewUrl(temp).then(() => {
            this.view.iframePreviewShow = true
          })
        }
      },
      confirmSubmit () {
        this.$confirm('是否确认选择该主题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let { id } = this.curNode
          var data = new URLSearchParams()
          data.append('id', id)
          data.append('moduleId', this.tempSlected)
          this.axios.patch(API.change_node_module, data).then(() => {
            this.$emit('finishSelectTemp', id, this.tempSlected, this.activeTab)
            this.$message({
              type: 'success',
              message: '模板选择成功!'
            })
          }).catch((error) => {
            this.$message({
              type: 'info',
              message: error.msg
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '请重新选择!'
          })
        })
      },
      handleActiveChange (tab) {
        this.activeTab = tab.id
        this.curPreview = ''
        this.tempSlected = ''
      },
      cancel () {
        this.$emit('cancelSelectTemp', this.curNode.id)
      }
    }
  }
</script>
<style scoped>
  .select-temp-box{
    border: thin solid #d3dce6;
    padding: 5px 30px;
    box-sizing: border-box;
  }
  .image-box{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    margin: 10px 10px;
    width: 280px;
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
    width: 280px;
    height: 160px;
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
    justify-content: center;
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
  .ipanel-icon-preview{
    background-position:  -140px -20px;
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
  .no-content{
    padding-top: 20px;
    font-size: 14px;
    color: #1f2d3d;
    box-sizing: border-box;
  }
</style>

