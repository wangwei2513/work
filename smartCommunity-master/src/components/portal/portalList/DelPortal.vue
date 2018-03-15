<template>
    <div class="del-portal" v-show="show">
      <div class="popup-box">
        <h2>删除Portal</h2>
        <i class="iconfont icon-arrows_remove" @click="$emit('update:show', false)" title="关闭"></i>
        <div class="del-portal-content">
          <el-form ref="newPortal" label-position="left" :model="portal" label-width="120px">
            <el-form-item label="终端类型">
              <el-col :span="11">
                {{portal && terminalMap[portal.terminaType]}}
              </el-col>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-col :span="11">
                {{portal && portal.fullAreaName}}
              </el-col>
            </el-form-item>
            <el-form-item label="Portal名称">
              <el-col :span="11">
                {{portal && portal.portalName}}
              </el-col>
            </el-form-item>
            <el-form-item label="Portal类型">
              <el-col :span="11">
                {{portal && portalPro[portal.portalProperty]}}
              </el-col>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-col :span="11">
                {{portal && portalStaMap[portal.status]}}
              </el-col>
            </el-form-item>
          </el-form>
        </div>
        <div class="del-portal-tip">
          <el-alert
            title="注：确认删除后，被删除的portal不可恢复，请谨慎操作！"
            show-icon
            type="warning"
            :closable="false">
          </el-alert>
        </div>
        <div class="popup-btns">
          <el-col :span="4" :offset="7">
            <el-button type="danger" :loading="submiting" :disabled="portal && portal.status == 4" @click="delPortalConfirm">确认删除</el-button>
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
    import API from '../../../assets/js/api.js'
    import util from '../../../assets/js/util.js'
    export default {
      name: 'delPortal',
      props: {
        portal: Object,
        show: Boolean
      },
      data () {
        return {
          terminalMap: util.terminalMap,
          portalPro: util.portalProMap,
          portalStaMap: util.portalStatusMap,
          submiting: false
        }
      },
      methods: {
        delPortalConfirm () {
          this.$confirm('如果当前Portal已下发，删除后子区域的Portal也将被删除，是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                this.delPortal().then(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
              } else {
                done()
              }
            }
          }).catch(() => {})
        },
        delPortal () {
          var params = {
            groupId: this.portal.groupId,
            ids: this.portal.id
          }
          return this.axios.get(API.del_portal, { params }).then((data) => {
            this.$emit('upload-portal-list')
            this.$emit('update:show', false)
            this.$message({
              message: '删除Portal成功!',
              type: 'success'
            })
          }).catch((error) => {
            console.log(error)
            this.$message({
              message: '删除Portal失败',
              type: 'error'
            })
          })
        }
      }
    }
  </script>
  <style scoped>
    .popup-box{
      width: 640px;
      height: 520px;
      left: calc(50% - 320px);
      top: calc(50% - 260px);
    }
    .del-portal-content{
      height: 360px;
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
  