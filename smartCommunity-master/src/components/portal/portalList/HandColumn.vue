<template>
    <div class="hand-column" v-show="show">
      <div class="popup-box">
        <h2 class="popup-header">下发栏目</h2>
        <i class="iconfont icon-arrows_remove" @click="$emit('update:show', false)" title="关闭"></i>
        <div class="hand-column-content">
          <div class="hand-column-cts">
            <div class="hand-column-cts-title">选择栏目</div> 
            <div class="hand-column-cts-content i-scollbar">
              <el-tree
                ref="ctsTree"
                node-key="id"
                :data="portalCts"
                :auto-expand-parent= "false"
                :expand-on-click-node="false"
                :default-checked-keys="checkedNode"
                :default-expanded-keys="expandedCst"
                :props="{label: data => data.text, children: 'children'}"
                @check-change="checkChange"
                @current-change="currentChange">
              </el-tree>
            </div> 
          </div>
          <div class="hand-column-select-area" v-loading="loading">
            <el-row>
              <el-col :span="4" class="item-title">下发栏目</el-col>
              <el-col :span="14" :offset="1">{{curMenu.name||'请选择栏目进行编辑！'}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="item-title">下发区域</el-col>
              </el-col>
              <el-col :span="14" :offset="1">
                <el-select v-model="curMenu.areaIds" :disabled="!completeLoad" multiple laceholder="请选择">
                  <el-option
                    v-for="item in handAreas"
                    :key="item.id"
                    :label="item.areaName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :offset="5">
                <el-button :disabled="!(completeLoad && curMenu.areaIds.length !== 0)" @click="handColumn" :loading="submiting" type="primary">确认下发</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="popup-cover"></div>
    </div>
  </template>
  <script>
    import API from './../../../assets/js/api.js'
    import AreaCascader from './../../common/AreaCascader.vue'
    export default {
      name: 'handColumn',
      props: {
        portal: Object,
        areas: Array,
        show: Boolean,
        curAreaId: [Number, String]
      },
      data () {
        return {
          curPortal: this.portal,
          portalCts: [],
          checkedNode: [],
          handColumns: [],
          handAreas: [],
          curMenu: {
            name: '',
            areaIds: '',
            id: ''
          },
          curCts: null,
          loading: false,
          completeLoad: false,
          submiting: false
        }
      },
      components: {
        AreaCascader
      },
      watch: {
        show (show) {
          if (show) {
            if (this.portal && this.portal.id) {
              this.getCts()
            } else {
              throw Error('[handColumn] need a portal id')
            }
          }
        }
      },
      computed: {
        expandedCst () {
          return [this.portalCts.length > 0 && this.portalCts[0].id]
        }
      },
      methods: {
        getCts () {
          let params = {
            id: this.portal.id
          }
          this.axios.get(API.get_portal_menu_auth, { params }).then((data) => {
            if (Array.isArray(data)) {
              this.portalCts = data
            } else {
              this.portalCts = []
            }
          })
        },
        checkChange (data, isSelected, isChildrenSelected) {
          if (isSelected) {
            data.children.forEach(function (child) {
              child.disabled = false
            }, this)
          } else {
            data.children.forEach(function (child) {
              child.disabled = true
            }, this)
          }
        },
        currentChange (data, node) {
          let menuId = data.id
          this.curMenu.name = data.attributes.menu.name
          this.curMenu.id = menuId
          this.curMenu.areaIds = []
          this.curCts = data
          this.completeLoad = false
          this.loading = true
          Promise.all([
            this.axios.get(API.get_portal_menu_auth_area, {
              params: {
                menuId,
                page: 1,
                rows: 999
              }
            }),
            this.axios.get(API.get_portal_menu_old_area, {
              params: {
                menuId
              }
            })
          ]).then(([authArea, oldArea]) => {
            this.loading = false
            this.completeLoad = true
            this.handAreas = authArea.rows
            if (typeof oldArea.data === 'string' && oldArea.data !== '') {
              let areaArr
              if (oldArea.data.endsWith(',')) {
                areaArr = oldArea.data.split(',')
                areaArr.pop()
              } else {
                areaArr = oldArea.data.split(',')
              }
              this.curMenu.areaIds = areaArr.map((id) => {
                return parseInt(id)
              })
            }
          }).catch(() => {
            this.loading = false
            this.$message({
              message: '获取菜单分权信息失败!',
              type: 'error'
            })
          })
        },
        handColumn () {
          let params = new URLSearchParams()
          params.append('id', this.curMenu.id)
          params.append('groupId', this.curMenu.areaIds.join(','))

          this.submiting = true
          this.axios.post(API.anth_portal_menu, params).then(() => {
            this.submiting = false
            this.$message({
              message: '下发栏目成功!',
              type: 'success'
            })
          }).catch(() => {
            this.submiting = false
            this.$message({
              message: '下发栏目失败!',
              type: 'error'
            })
          })
        }
      }
    }
  </script>
  <style scoped>
    .popup-box{
      width: 700px;
      height: 520px;
      left: calc(50% - 350px);
      top: calc(50% - 270px);
    }
    .hand-column-content{
      height: 440px;
      margin-bottom: 20px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .hand-column-cts-content{
      height: calc(100% - 41px);
      overflow: auto;
    }
    .el-tree{
      border: none;
    }
    .hand-column-cts{
      float: left;
      box-sizing: border-box;
      width: 198px;
      height: 100%;
      border: thin solid #d3dce6;
    }
    .hand-column-cts-title{
      background-color: #eff2f7;
      border-bottom: thin solid #d3dce6;
      font-weight: bold;
      color: #1f2d3d;
      height: 40px;
      text-align: center;
      line-height: 40px;
    }
    .hand-column-select-area{
      float: left;
      box-sizing: border-box;
      width: calc(100% - 198px);
      height: 100%;
      margin-left: -1px;
      border: thin solid #d3dce6;
      padding: 80px 40px;
    }
    .el-row{
      margin-bottom: 20px;
      height: 36px;
    }
    .el-row .el-col{
      line-height: 36px;
    }
    .item-title{
      color: #7b828c;
    }
  </style>
  