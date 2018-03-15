<template>
    <div class="del-app" v-show="show">
      <div class="popup-box">
        <h2 class="popup-header">删除App</h2>
        <i class="iconfont icon-arrows_remove" title="关闭" @click="$emit('update:show', false)"></i>
        <div class="del-app-content">
          <el-form ref="newApp" label-position="left" label-width="120px">
            <el-form-item label="应用名称">
              <el-col :span="20">
                {{app && app.appName}}
              </el-col>
            </el-form-item>
            <el-form-item label="站点目录">
              <el-col :span="11">
                {{app && app.appEnName}}
              </el-col>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-col :span="11">
                {{app && app.areaName}}
              </el-col>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-col :span="11">
                {{app && appStatusMap[app.publishStatus + '']}}
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div class="del-app-tip">
          <el-alert
            title="注：确认删除后，被删除的应用不可恢复，所有的版本记录将清除，请谨慎操作！"
            show-icon
            type="warning"
            :closable="false">
          </el-alert>
        </div>
        <div class="popup-btns">
          <el-col :span="4" :offset="7">
            <el-button type="danger" :loading="submiting" :disabled="app && app.publishStatus == 1" @click="delApp">确认删除</el-button>
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
    import util from './../../../assets/js/util.js'
    export default {
      name: 'delApp',
      props: {
        app: {
          type: Object
        },
        show: Boolean
      },
      data () {
        return {
          submiting: false,
          appStatusMap: util.appStatusMap
        }
      },
      methods: {
        delApp () {
          var self = this
          var params = {
            ids: '' + this.app.id
          }
          this.submiting = true
          this.axios.delete(API.del_app, { params }).then(function () {
            self.submiting = false
            self.$emit('update:show', false)
            self.$emit('update-app-list')
            self.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(function () {
            self.submiting = false
            self.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
        }
      }
    }
  </script>
  <style scoped>
    .popup-box{
      width: 500px;
      height: 440px;
      left: calc(50% - 250px);
      top: calc(50% - 220px);
    }
    .del-app-content{
      height: 240px;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  </style>
  