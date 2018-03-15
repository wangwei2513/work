<template>
  <div class="portal-edit-box">
    <div class="portal-info">
      <label for="">Portal名称:</label>
      <span>{{portalInfo && portalInfo.portalName}}</span>
      <label for="">终端类型:</label>
      <span>{{portalInfo && terminalMap[portalInfo.terminaType]}}</span>
      <label for="">所属区域:</label>
      <span>{{portalInfo && portalInfo.areaName}}</span>
      <label for="">Portal属性:</label>
      <span>{{portalInfo && portalPro[portalInfo.portalProperty]}}</span>
    </div>
    <div class="portal-edit-content">
      <div class="portal-edit-construction">
        <div class="portal-edit-construction-title">Portal栏目结构</div>
        <div class="portal-edit-construction-content">
          <div class="portal-edit-construction-btns">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="12"><el-button plain @click="addChild" :disabled="!editable.add">新建</el-button></el-col>
              <el-col :span="12"><el-button plain @click="beforeRename" :disabled="!editable.edit">编辑</el-button></el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <!-- TODO 复制栏目第一期不做 -->
              <el-col :span="12"><el-button plain @click="changeToWin8Edit" :disabled="!editable.layout">布局</el-button></el-col>
              <el-col :span="12"><el-button plain @click="confirmDel" :disabled="!editable.del" type="danger">删除</el-button></el-col>
            </el-row>
          </div>
          <el-tree
            ref="menuTree"
            node-key="id"
            class="i-scollbar"
            v-loading="loading"
            :data="portalData"
            :props="menuProps"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedCst"
            :render-content="renderTreeNode"
            :auto-expand-parent= "false"
            @node-expand="handleNodeExpand"
            @node-collapse="handleNodeCollapse"
            @current-change="changeCurCst"
            :highlight-current="true"></el-tree>
        </div>
      </div>
      <!--选择模板 与 常规编辑 动态组件begin  -->
      <component
        :isRoot="isRoot"
        :iCustomFields="customFields"
        :curCts="currentCst"
        :col="gridCol"
        :row="gridRow"
        :img-src-root="imgSrcRoot"
        :cts-data="currentCtsData"
        :relatedAppsData="relatedApps"
        v-loading="loading"
        @modify="hasModified"
        @noModify="noModify"
        @preview-portal="previewPortal"
        @update-portal-menu="getPortalConstruction"
        class="portal-edit-main" 
        v-bind:is="currentView"></component>
      <!--选择模板 与 常规编辑 动态组件end  -->
    </div>
    <!-- portal预览begin -->
    <iframe-preview
      :show.sync="iframePreviewShow"
      :url="previewUrl"
      :title="curPreview">
    </iframe-preview>
    <!-- portal预览end -->
  </div>
</template>
<script>
  import API from '../../../assets/js/api.js'
  import bus from './../../../assets/js/bus.js'
  import util from '../../../assets/js/util.js'
  import PortalEdit from './PortalEdit.vue'
  import MenuLayout from './MenuLayout.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'edit',
    props: {
      editData: Object
    },
    data () {
      return {
        portalInfo: null,
        portalData: [],
        imgSrcRoot: '',
        currentCst: '',
        currentCtsData: null,
        currentCtsNode: null,
        inRename: false,
        curVal: '',
        customFields: [],
        // 是否使用栅格布局,0:不是,1:是;栅格布局的行列
        useGrid: 0,
        gridCol: 0,
        gridRow: 0,
        relatedApps: [],
        currentView: 'PortalEdit',
        // 栏目结构数据
        portalConstruction: [],
        expandedCst: [],
        isRoot: true,
        isLeaf: false,
        previewUrl: '',
        curPreview: '',
        iframePreviewShow: false,
        terminalMap: util.terminalMap,
        portalPro: util.portalProMap,
        menuProps: {
          label (data) {
            return data.attributes.menu.name
          },
          children: 'children'
        },
        loading: false
      }
    },
    computed: {
      portalId () {
        return this.$route.params.id
      },
      groupId () {
        return this.$route.params.groupId
      },
      editable () {
        let editable = {
          add: true,
          edit: true,
          layout: true,
          del: true
        }
        // let curCst = this.currentCtsData
        if (this.isRoot) {
          editable.edit = false
          editable.del = false
        }
        if (!this.isLeaf || !this.useGrid) {
          editable.layout = false
        }
        if (this.currentCst === '') {
          editable = {
            add: false,
            edit: false,
            layout: false,
            del: false
          }
        }
        return editable
      }
    },
    watch: {
      portalData: {
        immediate: true,
        handler (portalData) {
          if (portalData.length > 0) {
            portalData.forEach(function (portal) {
              !this.expandedCst.includes(portal.id) && this.expandedCst.push(portal.id)
            }, this)
          }
        }
      },
      currentCst (newVal) {
        this.$nextTick(() => {
          this.$refs.menuTree.setCurrentKey(newVal)
        })
      }
    },
    components: {
      PortalEdit,
      MenuLayout,
      IframePreview
    },
    methods: {
      getPortalConstruction () {
        let params = {
          id: this.portalId,
          groupId: this.groupId
        }
        this.loading = true
        this.axios.get(API.get_portal_menu, { params }).then((data) => {
          this.loading = false
          if (Array.isArray(data.portalMenuData)) {
            this.portalData = data.portalMenuData
            if (data.portalMenuData.length > 0) {
              this.currentCtsData = data.portalMenuData[0].attributes.menu
              this.currentCst = data.portalMenuData[0].id
              this.$nextTick(() => {
                this.$refs.menuTree.setCurrentKey(this.currentCst)
              })
            }
          } else {
            this.portalData = []
          }
          this.imgSrcRoot = data.picAccessUrl
          this.useGrid = data.useGrid
          this.gridCol = data.gridCols
          this.gridRow = data.gridRows
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '获取菜单列表失败!',
            type: 'error'
          })
        })
      },
      getPortalInfo () {
        let params = {
          id: this.portalId,
          groupId: this.groupId
        }
        this.axios.get(API.get_portal_info, { params }).then((data) => {
          this.portalInfo = data
        }).catch(() => {
          this.$message({
            message: '获取portal信息失败!',
            type: 'error'
          })
        })
      },
      previewPortal () {
        let params = {
          id: this.portalId,
          groupId: this.groupId
        }
        this.axios.get(API.get_portal_preview, { params }).then((data) => {
          this.iframePreviewShow = true
          this.curPreview = this.portalInfo.portalName
          this.previewUrl = data.msg
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      },
      // TODO 修改显示逻辑,遵循数据驱动原则
      renderTreeNode (h, { node, data, store }) {
        const self = this
        // var wrapperClass = data.isNew ? 'tree-node-conent in-rename' : 'tree-node-conent'
        var ctrs = [
          h('span', {
            'class': 'ipanel-icon1 tree-node-renameok',
            on: {
              click: function (e) {
                e.stopPropagation()
                self.rename(e, node, data, store)
              }
            }
          }),
          h('span', {
            'class': 'ipanel-icon1 tree-node-renameno',
            on: {
              click: function (e) {
                e.stopPropagation()
                self.cancelRename(e, node, data, store)
              }
            }
          })
        ]
        return h('span', {
          'class': {
            'tree-node-conent': true,
            'in-rename': data.isNew || (self.inRename && data.id === self.currentCst)
          }
        }, [
          h('span', {
            'class': 'tree-node-label'}, node.label),
          h('input', {
            'class': 'tree-node-input',
            on: {
              click: function (e) { e.stopPropagation() },
              input: function (e) {
                let val = e.target.value
                let result = val.match(/([\u4e00-\u9fa5]|\w)+/g)
                result = result ? result.join('') : ''
                e.target.value = result
                self.curVal = result
              },
              keyup (e) {
                if (e.keyCode === 13 && self.curVal !== '') {
                  self.rename(e, node, data)
                }
              }
            },
            domProps: {
              value: self.curVal
            },
            attrs: {
              placeholder: '请设置栏目名称',
              maxlength: 15
            }
          }),
          h('span', {'class': 'tree-node-ctr'}, ctrs)
        ])
      },
      beforeRename () {
        if (this.inRename) {
          this.$message({
            message: '请执行完当前操作!',
            type: 'warning'
          })
        } else {
          this.curVal = this.currentCtsData.name
          this.inRename = true
        }
      },
      rename (e, node, data, store) {
        let id = data.id
        let newName = this.curVal
        if (newName) {
          let params = new URLSearchParams()
          if (data.isNew) {
            // 新增子节点的重命名
            params.append('name', newName)
            params.append('id', data.pid)
            params.append('groupId', this.groupId)
            this.axios.post(API.add_portal_menu, params).then((data) => {
              data.attributes.menu.name = newName
              data.attributes.menu.id = data.obj
              data.isNew = false
              this.expandedCst.push(data.obj)
              this.getPortalConstruction()
              this.inRename = false
              this.$message({
                type: 'success',
                message: '新增节点成功!'
              })
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '新增节点失败!'
              })
            })
          } else {
            // 已存在的节点的重命名
            params.append('id', id)
            params.append('menuName', newName)
            this.axios.post(API.change_portal_menu_name, params).then(() => {
              data.attributes.menu.name = newName
              this.inRename = false
              this.$message({
                type: 'success',
                message: '编辑名称成功!'
              })
            }).catch(() => {
              this.$message({
                type: 'error',
                message: '编辑名称失败!'
              })
            })
          }
        } else {
          this.cancelRename(e, node, data, store)
        }
      },
      cancelRename (e, node, data, store) {
        this.inRename = false
        if (data.isNew) {
          this.currentCtsNode.store.remove(data)
        }
      },
      addChild () {
        if (this.inRename) {
          this.$message({
            message: '请执行完当前操作!',
            type: 'warning'
          })
        } else {
          this.curVal = ''
          let data = this.currentCtsData
          let node = this.currentCtsNode
          let id = data.id
          let newMenu = {
            id: id + '-1',
            attributes: {
              menu: {
                name: ''
              }
            },
            children: [],
            pid: data.id,
            isNew: true
          }
          node.store.append(newMenu, data)
          node.expanded = true
        }
      },
      confirmDel () {
        let data = this.currentCtsData
        this.$confirm('删除后该节点以及该节点的所有子节点都将删除，确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            id: data.id
          }
          this.axios.get(API.del_portal_menu, { params }).then(() => {
            this.removeMenu(data.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {})
      },
      removeMenu (id) {
        this.recursiveOperate(this.portalData, function (n, arr, i) {
          if (n.id === id) {
            arr.splice(i, 1)
            return true
          } else {
            return false
          }
        })
      },
      recursiveOperate (arr, callback) {
        for (var i = 0; i < arr.length; i++) {
          var node = arr[i]
          const flag = callback(node, arr, i)
          if (flag) {
            return
          } else {
            if (Array.isArray(node.children)) {
              this.recursiveOperate(node.children, callback)
            }
          }
        }
      },
      changeCurCst (data, node) {
        let cstData = data.attributes.menu
        console.log(node)
        this.currentCst = data.id
        this.isRoot = node.level === 1
        this.isLeaf = node.childNodes.length === 0
        this.currentCtsData = cstData
        this.currentCtsNode = node
        this.currentView = 'PortalEdit'
      },
      handleNodeExpand (data) {
        !this.expandedCst.includes(data.id) && this.expandedCst.push(data.id)
      },
      handleNodeCollapse (data) {
        let idx = -1
        for (let i = 0; i < this.expandedCst.length; i++) {
          var element = this.expandedCst[i]
          if ('' + element === '' + data.id) {
            idx = i
          }
        }
        this.expandedCst.splice(idx, 1)
      },
      changeToWin8Edit () {
        this.currentView = 'MenuLayout'
      },
      hasModified () {
        this.modified = true
      },
      noModify () {
        this.modified = false
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(function (vm) {
        if (from.path === '/') {
          bus.$emit('newEdit', {id: vm.portalId, groupId: vm.groupId})
        }
      })
    },
    activated () {
      this.getPortalConstruction()
      this.getPortalInfo()
    }
  }
</script>
<style scoped>
  .portal-edit-box{
    height: 600px;
  }
  .el-tree{
    border: none;
  }
  .portal-edit-content{
    height: 100%;
  }
  .portal-info{
    position: absolute;
    top: 30px;
    right: 30px;
    height: 30px;
    line-height: 30px;
  }
  .portal-info label{
    color: #7b828c;
    font-size: 14px;
  }
  .portal-info span{
    color: #1f2d3d;
    font-size: 14px;
    margin-right: 46px;
  }
  .portal-edit-construction{
    width: 198px;
    height: 100%;
    float: left;
    border: 1px solid #d3dce6;
    position: relative;
  }
  .portal-edit-construction-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    color: #1f2d3d;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
  }
  .portal-edit-construction-content{
    height: 551px;
    overflow: hidden;
  }
  .el-tree{
    height: 458px;
    overflow: auto;
  }
  .portal-edit-main{
    width: calc(100% - 220px);
    height: 100%;
    float: left;
    margin-left: 18px;
    border: 1px solid #d3dce6;
  }
  .portal-edit-construction-cover{
    position: absolute;
    top: 49px;
    left: 0;
    width: 100%;
    height: calc(100% - 49px);
    background-color: rgba(255,255,255,.7);
  }
  .portal-edit-construction-btns .el-row{
    margin: 10px 0;
  }
  .portal-edit-construction-btns .el-col{
    text-align: center;
  }
</style>
<style>
  .portal-edit-box .el-tree-node.is-current>.el-tree-node__content{
    background-color: #d3dce6 !important;
  }
  .portal-edit-box .tree-node-label{
    font-size: 14px;
    color: #475669;
    display: inline-block;
    vertical-align: middle;
  }
  .portal-edit-box .tree-node-ctr{
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    height: 26px;
    display: none;
    align-items: center;
    justify-content: space-around;
  }
  .portal-edit-box .el-tree-node__content{
    position: relative;
    cursor: default;
  }
  .portal-edit-box .el-tree-node__content:hover .tree-node-conent:not(.in-rename) .tree-node-ctr{
    display: flex;
  }
  .portal-edit-box .tree-node-conent.in-rename .tree-node-ctr{
    width: 60px;
    display: flex;
    background-color: rgba(255,255,255,.7);
  }
  .portal-edit-box .in-rename .tree-node-renameok,.portal-edit-box .in-rename .tree-node-renameno{
    display: block;
  }
  .portal-edit-box .in-rename .tree-node-del,.in-rename .tree-node-rename,.in-rename .tree-node-layout,.in-rename .tree-node-addChild{
    display: none;
  }
  .portal-edit-box .in-rename .tree-node-input{
    display: block;
  }
  .portal-edit-box .tree-node-input:hover {
    border-color: #8391a5;
  }
  .portal-edit-box .tree-node-input:focus {
    outline: 0;
    border-color: #20a0ff;
  }
  .portal-edit-box .in-rename .tree-node-label{
    display: none;
  }
  .portal-edit-box .tree-node-input{
    display: none;
    position: absolute;
    left: 25px;
    top: 3px;
    width: 100px;
    height: 20px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    font-size: 14px;
    line-height: 1;
    outline: 0;
    padding: 3px 5px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .portal-edit-box .tree-node-input::-webkit-input-placeholder{
    font-size: 12px;
    line-height: 30px;
  }
  .portal-edit-box .ipanel-icon1{
    margin: 0;
    cursor: pointer;
  }
  .portal-edit-box .tree-node-renameok{
    display: none;
    background-position-x: -150px;
    background-position-y: -72px;
  }
  .portal-edit-box .tree-node-renameno{
    display: none;
    background-position-x: -185px;
    background-position-y: -72px;
  }
</style>
