<template>
  <div class="app-version" v-show="show">
    <div class="popup-box">
      <h2 class="popup-header">版本管理</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="app-version-content">
          <div class="app-version-info">
            <label class="">应用名称：</label>
            <span>{{app && app.appName}}</span>
            <label>所属区域：</label>
            <span>{{app && app.areaName}}</span>
          </div>
          <el-table
            @current-change="currentChange"
            :data="appHistorys"
            :height="320"
            empty-text="应用没有历史版本"
            highlight-current-row
            v-loading="loading"
            border
            style="width: 100%">
            <el-table-column
              prop="versionNo"
              label="版本号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="publishTime"
              label="发布时间"
              width="180">
            </el-table-column>
            <el-table-column
              label="发布状态">
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="popup-btns">
        <el-col :span="2" :offset="6">
          <el-button :disabled="!curVersion" type="primary">发布</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button :loading="submiting" :disabled="!curVersion" @click="preview" type="primary">预览</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button :disabled="!curVersion" type="primary">删除</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button @click="download" :disabled="!curVersion" type="primary">下载</el-button>
        </el-col>
      </div>
    </div>
    <div class="popup-cover"></div>

    <!-- 模板预览begin -->
    <iframe-preview
      :show.sync="iframePreviewShow"
      :url="previewUrl"
      :title="curPreview">
    </iframe-preview>
    <!-- 模板预览end -->
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import IframePreview from './../../common/IframePreview.vue'
  // import util from './../../../assets/js/util'
  export default {
    name: 'appVersion',
    props: {
      app: Object,
      show: Boolean
    },
    data () {
      return {
        appHistorys: [],
        previewUrl: '',
        curPreview: '',
        curVersion: null,
        submiting: false,
        loading: true,
        iframePreviewShow: false
      }
    },
    watch: {
      show: {
        handler (show) {
          if (show) {
            this.getAppVersions()
          }
        }
      }
    },
    components: {
      IframePreview
    },
    methods: {
      close () {
        this.newApp = {
          deviceIds: '1',
          areaIds: '',
          appName: '',
          appEnName: '',
          serverIds: []
        }
        this.inputMode = 'auto'
        this.$emit('update:show', false)
      },
      getAppVersions () {
        let params = {
          appId: this.app.id,
          page: 1,
          size: 999
        }
        this.loading = true
        this.axios.get(API.get_app_versions, { params }).then((data) => {
          this.loading = false
          this.appHistorys = data.rows
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '获取应用历史版本失败!',
            type: 'error'
          })
        })
      },
      currentChange (cur) {
        this.curVersion = cur
      },
      download () {
        var form = $('<form>')
        var input = $('<input>')
        form.attr('style', 'display:none')
        form.attr('target', 'framFile')
        form.attr('method', 'get')
        form.attr('action', API.download_his_app)
        input.attr('name', 'id')
        input.attr('value', this.curVersion.id)
        form.append(input)
        $(this.$el).append(form)
        form.submit()
      },
      preview () {
        let params = {
          id: this.curVersion.id
        }
        this.submiting = true
        this.axios.get(API.get_app_his_preview_url, { params }).then((data) => {
          this.curPreview = this.curVersion.appName + ' - V' + this.curVersion.versionNo
          this.previewUrl = data.url
          this.iframePreviewShow = true
          this.submiting = false
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 600px;
    height: 480px;
    left: calc(50% - 300px);
    top: calc(50% - 240px);
  }
  .app-version-content{
    height: 370px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-form-item{
    margin-bottom: 0px !important;
  }
  .app-version-info{
    margin-bottom: 10px;
  }
  .app-version-info label{
    color: #5a5e66;
    margin-right: 5px;
  }
  .app-version-info span{
    margin-right: 40px;
  }
</style>
