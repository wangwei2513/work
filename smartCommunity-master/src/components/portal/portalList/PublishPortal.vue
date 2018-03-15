<template>
    <div class="del-portal" v-show="show">
      <div class="popup-box">
        <h2>发布Portal</h2>
        <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
        <div class="del-portal-content">
          <el-form ref="newPortal" label-position="left" :model="portal" label-width="120px">
            <el-form-item label="Portal名称">
              <el-col :span="11">
                {{portal && portal.portalName}}
              </el-col>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-col :span="11">
                {{portal && portal.areaName}}
              </el-col>
            </el-form-item>
            <el-form-item label="选择服务器">
              <el-col :span="16">
                <el-select
                  v-model="serverIds"
                  multiple placeholder="请选择服务器"
                  no-data-text="该区域没有关联任何服务器">
                  <el-option
                    v-for="server in serversCopy"
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
            <el-button :loading="submiting" type="primary" @click="publish">确认发布</el-button>
          </el-col>
          <el-col :span="4" :offset="2">
            <el-button :loading="submiting" @click="close">取消</el-button>
          </el-col>
        </div>
      </div>
      <div class="popup-cover"></div>
    </div>
  </template>
  <script>
    import API from '../../../assets/js/api.js'
    export default {
      name: 'publishPortal',
      props: {
        portal: Object,
        version: Object,
        show: Boolean,
        servers: Array
      },
      data () {
        return {
          serversCopy: [],
          serverIds: [],
          submiting: false
        }
      },
      watch: {
        show: {
          handler (show) {
            if (show && this.portal.groupId) {
              this.serverIds = []
              this.serverByArea(this.portal.groupId)
            }
          }
        }
      },
      methods: {
        close () {
          this.$emit('update:show', false)
        },
        serverByArea (areaId) {
          this.serversCopy = this.servers.filter((server) => {
            return '' + server.areaId === '' + areaId
          })
        },
        confirmPublish () {
          this.$confirm('确认发布该Portal?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                this.publish().then(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
              } else {
                instance.confirmButtonLoading = false
                done()
              }
            }
          }).catch(() => {})
        },
        publish () {
          let params = {
            id: this.version.id,
            groupId: this.portal.groupId,
            serverList: this.serverIds.join(',')
          }
          this.submiting = true
          return this.axios.get(API.release_portal, {
            params,
            timeout: 1000000
          }).then(() => {
            this.submiting = false
            this.$emit('upload-portal-list')
            this.close()
            this.$message({
              message: '发布Portal成功!',
              type: 'success'
            })
          }).catch((error) => {
            this.submiting = false
            this.$message({
              message: error.msg,
              type: 'error'
            })
          })
        }
      }
    }
  </script>
  <style scoped>
    .popup-box{
      width: 560px;
      height: 400px;
      left: calc(50% - 280px);
      top: calc(50% - 200px);
      z-index: 1013;
    }
    .popup-cover{
      z-index: 1012;
    }
    .del-portal-content{
      height: 280px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .del-portal h2{
      font-size: 14px;
      color: #1f2d3d;
      font-weight: bold;
      margin-bottom: 25px;
    }
    .del-portal-btns{
      width: 100%;
      padding: 5px;
      height: 36px;
    }
  </style>
  