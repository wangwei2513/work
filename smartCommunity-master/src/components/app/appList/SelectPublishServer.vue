<template>
    <div class="publish-servers" v-show="show">
      <div class="popup-box">
        <h2 class="popup-header">选择已发布的服务器</h2>
        <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
        <div class="publish-servers-content">
          <el-form ref="newApp" label-position="right" label-width="80px">
            <el-form-item label="应用名称">
              <el-col :span="16">
                {{app && app.appName || ''}}
              </el-col>
            </el-form-item>
            <el-form-item label="服务器">
              <el-col :span="16">
                <el-select v-model="serverId" :no-data-text="selectText"  placeholder="请选择">
                  <el-option
                    v-for="server in servers"
                    :key="server.id"
                    :label="server.serverName"
                    :value="server.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div class="popup-btns">
          <el-col :span="4" :offset="7">
            <el-button type="primary" :disabled="serverId === ''" @click="preview">预览</el-button>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button @click="$emit('update:show', false)">取消</el-button>
          </el-col>
        </div>
      </div>
      <div class="popup-cover"></div>
    </div>
  </template>
  <script>
    import API from './../../../assets/js/api'
    export default {
      name: 'selectPreviewServers',
      props: {
        app: {
          type: Object
        },
        show: Boolean
      },
      data () {
        return {
          serverId: '',
          servers: [],
          selectText: '正在加载中...',
          submiting: false
        }
      },
      watch: {
        show: {
          handler (show) {
            show && this.getPublishServers()
          }
        }
      },
      methods: {
        close () {
          this.serverId = ''
          this.$emit('update:show', false)
        },
        getPublishServers () {
          let params = {
            id: this.app.id
          }
          this.axios.get(API.get_app_publish_server, { params }).then((data) => {
            if (data.rows.length === 0) {
              this.selectText = '无数据'
            }
            this.servers = data.rows
          }).catch(() => {
            this.$message({
              message: '获取应用发布服务器列表失败!',
              type: 'error'
            })
          })
        },
        preview () {
          let params = {
            id: this.app.id,
            serverId: this.serverId
          }
          this.axios.get(API.get_app_preview_url, { params }).then((data) => {
            this.$emit('preview-app', this.app.appName, data.url)
          }).catch(() => {
            this.$message({
              message: '获取应用预览地址失败!',
              type: 'error'
            })
          })
        }
      }
    }
  </script>
  <style scoped>
    .popup-box{
      width: 500px;
      height: 300px;
      left: calc(50% - 250px);
      top: calc(50% - 150px);
    }
    .publish-servers-content{
      height: 140px;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>
  