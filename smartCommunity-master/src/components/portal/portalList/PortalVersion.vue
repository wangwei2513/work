<template>
  <div class="portal-version" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">版本管理</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="portal-version-content">
          <div class="portal-version-info">
            <label class="">Portal名称：</label>
            <span>{{portal && portal.portalName}}</span>
            <label>所属区域：</label>
            <span>{{portal && portal.areaName}}</span>
          </div>
          <el-table
            @current-change="currentChange"
            :data="portalHistorys"
            :height="320"
            v-loading="loading"
            border
            highlight-current-row
            :empty-text="tableTip"
            style="width: 100%">
            <el-table-column
              prop="version"
              label="版本号"
              width="80">
            </el-table-column>
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                {{scope.row.pub_date || '--'}}
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="300">
              <template slot-scope="scope">
                {{scope.row.current ? '已发布' : '未发布'}}
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="popup-btns">
        <el-col :span="2" :offset="8">
          <el-button @click="publishShow = true" :disabled="!curVersion || curVersion.current" type="primary">发布</el-button>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button @click="preview" type="primary" :disabled="!curVersion">预览</el-button>
        </el-col>
        <!-- <el-col :span="2" :offset="1">
          <el-button type="primary" :disabled="!curVersion">删除</el-button>
        </el-col> -->
        <el-col :span="2" :offset="1">
          <el-button :loading="submiting" @click="downloadVersion" type="primary" :disabled="!curVersion">下载</el-button>
        </el-col>
        <a :href="downloadSrc" id="downloadPortalVersion" style="position:fixed;margin-left: 9999px;">下载</a>
      </div>
    </div>
    <div class="popup-cover"></div>

     <!-- 发布Portal版本begin -->
    <publish-portal
      :show.sync="publishShow"
      :servers="servers"
      :portal="portal"
      :version="curVersion"
      @upload-portal-list="handlerUpdate">
    </publish-portal>
    <!-- 发布Portal版本end -->

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
  import PublishPortal from './PublishPortal.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'portalVersion',
    props: {
      portal: Object,
      show: Boolean,
      servers: Array
    },
    data () {
      return {
        portalHistorys: [],
        curVersion: null,
        curPreview: '',
        previewUrl: '',
        downloadSrc: '',
        submiting: false,
        loading: false,
        publishShow: false,
        iframePreviewShow: false,
        tableTip: '暂无数据'
      }
    },
    watch: {
      show: {
        handler (show) {
          if (show) {
            this.getPortalVersions()
          } else {
            this.portalHistorys = []
          }
        }
      }
    },
    computed: {
      isRelease () {
        return this.portal.status === 4
      }
    },
    components: {
      PublishPortal,
      IframePreview
    },
    methods: {
      close () {
        this.$emit('update:show', false)
      },
      getPortalVersions () {
        let params = {
          groupId: this.portal.groupId,
          searchVersionName: this.portal.portalName,
          page: 1,
          rows: 99
        }
        this.axios.get(API.get_portal_version, { params }).then((data) => {
          if (data.rows.length > 0) {
            let lastTime = 0
            let lastPortal = null
            data.rows.forEach(function (portal) {
              let pubTime = parseInt(portal.pub_date ? new Date(portal.pub_date).getTime() : 0)
              if (pubTime > lastTime) {
                lastTime = pubTime
                lastPortal = portal
              }
            }, this)
            lastPortal.current = true
            this.portalHistorys = data.rows
          } else {
            this.tableTip = '没有版本记录，请通过审核后再进行发布操作！'
          }
          this.loading = false
        }).catch((error) => {
          console.log(error)
          this.loading = false
          this.$message({
            message: '获取Portal历史版本失败!',
            type: 'error'
          })
        })
      },
      currentChange (cur) {
        this.curVersion = cur
      },
      handlerUpdate () {
        this.$emit('upload-portal-list')
        this.close()
      },
      preview () {
        let params = {
          id: this.curVersion.id
        }
        this.axios.get(API.preview_portal_version, { params }).then((data) => {
          this.curPreview = this.curVersion.name + ' - V' + this.curVersion.version
          this.previewUrl = data.msg
          this.iframePreviewShow = true
        }).catch(() => {
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      },
      downloadVersion () {
        let params = {
          versionId: this.curVersion.id
        }
        this.submiting = true
        this.axios.get(API.get_portal_version_download_url, { params }).then((data) => {
          this.downloadSrc = data.msg
          this.submiting = false
          this.$nextTick(() => {
            $('#downloadPortalVersion')[0].click()
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '获取下载地址失败!',
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
  .portal-version-content{
    height: 370px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-form-item{
    margin-bottom: 0px !important;
  }
  .portal-version-info{
    margin-bottom: 10px;
  }
  .portal-version-info label{
    color: #5a5e66;
    margin-right: 5px;
  }
  .portal-version-info span{
    margin-right: 40px;
  }
</style>
