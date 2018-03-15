<template>
    <div class="link-servers" v-show="show">
      <div class="popup-box">
        <h2 class="popup-header">关联服务器</h2>
        <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
        <div class="link-servers-content">
          <el-form ref="newApp" label-position="right" label-width="80px">
            <el-form-item label="区域">
              <el-col :span="16">
                {{app && app.areaName || ''}}
              </el-col>
            </el-form-item>
            <el-form-item label="服务器">
              <el-col :span="16">
                <el-select v-model="serverIds" multiple  placeholder="请选择">
                  <el-option
                    v-for="server in validServers"
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
            <el-button type="primary" :loading="submiting" @click="linkServers">确认关联</el-button>
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
      name: 'linkServers',
      props: {
        app: {
          type: Object
        },
        show: Boolean,
        servers: Array
      },
      data () {
        return {
          serverIds: [],
          submiting: false
        }
      },
      watch: {
        show: {
          handler (show) {
            if (show) {
              if (this.app && Array.isArray(this.app.servers)) {
                let serverIds = []
                this.app.servers.forEach(function (server) {
                  serverIds.push(server.id)
                }, this)
                this.serverIds = serverIds
              }
            }
          }
        }
      },
      computed: {
        /* 只显示关联区域的服务器 */
        validServers () {
          let servers = []
          let areaId = this.app && this.app.areaId
          servers = this.servers.filter((server) => {
            return server.areaId === areaId
          })
          return servers
        }
      },
      methods: {
        close () {
          this.serverIds = []
          this.$emit('update:show', false)
        },
        linkServers () {
          let params = new URLSearchParams()
          params.append('id', this.app.id)
          params.append('serverIds', this.serverIds.join(','))

          this.submiting = true

          this.axios.patch(API.app_link_servers, params).then(() => {
            this.submiting = false
            this.close()
            this.$emit('update-app-list')
            this.$message({
              message: '关联服务器成功!',
              type: 'success'
            })
          }).catch(() => {
            this.submiting = false
            this.$message({
              message: '关联服务器失败!',
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
      height: 400px;
      left: calc(50% - 250px);
      top: calc(50% - 200px);
    }
    .link-servers-content{
      height: 240px;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>
  