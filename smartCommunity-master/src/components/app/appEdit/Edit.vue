<template>
  <div class="app-edit-box">
    <div class="app-info">
      <label for="">应用名称:</label>
      <span>{{appInfo.appName}}</span>
      <label for="">终端类型:</label>
      <span>{{deviceMap[appInfo.deviceIds]}}</span>
      <label for="">所属区域:</label>
      <span class="app-info-area" :title="appInfo.areaName">{{appInfo.areaName}}</span>
    </div>
    <div class="app-edit-content">
      <div class="app-edit-construction">
        <div class="app-edit-construction-title">应用栏目结构</div>
        <div>
          <div class="app-edit-construction-btns">
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="12" v-if="userRightList.includes('addNode')"><el-button @click="addChild" :disabled="!editable.add" plain>新建</el-button></el-col>
              <el-col :span="12" v-if="userRightList.includes('editNode')"><el-button @click="beforeRename" :disabled="!editable.edit" plain>编辑</el-button></el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="12" v-if="userRightList.includes('selectNodeModule')"><el-button @click="currentView = 'SelectTemp'" :disabled="!editable.module" plain>模板</el-button></el-col>
              <el-col :span="12" v-if="userRightList.includes('updateNodeStatus')"><el-button @click="confirmOnline" :disabled="!currentCstData || currentCstData.isNew" plain>{{currentCstData && currentCstData.isOnline === 1 ? '下线' : '上线'}}</el-button></el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle">
              <!-- TODO 复制栏目第一期不做 -->
              <el-col :span="12" v-if="userRightList.includes('copyNode')"><el-button @click="copyCurrent" :disabled="true" plain>复制</el-button></el-col>
              <el-col :span="12" v-if="userRightList.includes('deleteNode')"><el-button @click="confirmDel" :disabled="!currentCstData || currentCstData.isNew || currentCstData.pId === 0" plain type="danger">删除</el-button></el-col>
            </el-row>
          </div>
          <!-- 应用栏目树begin -->
          <my-tree
            lazy
            ref="nodeTree"
            class="i-scollbar"
            node-key="id"
            :data="appNodes"
            :expand-on-click-node="false"
            :default-expanded-keys="expandedCst"
            :render-content="renderTreeNode"
            :auto-expand-parent="false"
            :props="{label: 'title', chlidren: 'children', isLeaf: (data) => {return data.isLeaf === 1}}"
            @current-change="changeCurCst"
            @node-expand="expandHandler"
            @node-collapse="collapseHandler"
            :highlight-current="true">
          </my-tree>
          <!-- 应用栏目树end -->
        </div>
        <div class="app-edit-construction-cover" v-if="currentView === 'SelectTemp'"></div>
      </div>
      <!--选择模板 与 常规编辑 动态组件begin  -->
      <component
        class="app-edit-main"
        :rootAreaId="rootAreaId"
        :curNodeTempUrl="curNodeTempUrl"
        :curNode="curNodeInfo"
        :appInfo="appInfo"
        :user-right-list="userRightList"
        :select-node-module="selectNodeModule"
        :preview-node="userRightList.includes('previewNode')"
        :reload.sync="reloadPreviewIframe"
        @update-node-info="getAppConstruction"
        @finishSelectTemp="finishSelectTemp"
        @cancelSelectTemp="cancelSelectTemp"
        @show-select-temp="currentView = 'SelectTemp'"
        @showMateDetail="showMateDetail"
        @change-out-link="changeOutLink"
        v-bind:is="currentView">
      </component>
      <div v-show="currentCst === ''" class="app-edit-cover"><span class="app-edit-cover-text">请选择栏目!</span></div>
      <!--选择模板 与 常规编辑 动态组件end  -->

      <!-- 汉字转拼音组件begin -->
      <transition name="el-zoom-in-top">
        <div v-show="editingColumn" class="confirm-pinyin">
          <i class="to-left-tra"></i>
          <div class="pinyin-wp">
            <pinyin
              :value="confirmColumn.name"
              :traVal.sync="confirmColumn.enName"
              spliter=""
              :initVal="initEnName">
            </pinyin>
          </div>
        </div>
      </transition>
      <!-- 汉字转拼音组件end -->
    </div>
  </div>
</template>
<script>
  import API from '../../../assets/js/api.js'
  import util from '../../../assets/js/util.js'
  import SelectTemp from './SelectTemp.vue'
  import AppEdit from './AppEdit.vue'
  import MyTree from './../../tree/src/tree'
  import Pinyin from './../../common/CC2P.vue'
  export default {
    name: 'edit',
    props: {
      appData: {
        type: Object
      },
      areas: {
        type: Array
      },
      userRightList: {
        type: Array
      },
      appId: [Number, String]
    },
    data () {
      return {
        currentView: 'AppEdit',
        modified: false,
        // 栏目结构数据
        appNodes: [],
        oldCts: '',
        oldCtsData: null,
        newNodeId: '',
        currentCst: '',
        currentCstData: null,
        currentCstNode: null,
        curNodeInfo: null,
        curVal: '',
        curNodeTempUrl: '',
        currentCstObj: {
          pId: '',
          name: ''
        },
        initEnName: '',
        confirmColumn: {
          name: '',
          enName: ''
        },
        deviceMap: util.deviceMap,
        expandedCst: [],
        newNodeData: null,
        reloadPreviewIframe: false,
        editingColumn: false
      }
    },
    computed: {
      // appId () {
      //   return this.$route.params.id
      // },
      // 不能直接修改props,只有copy一个
      appDataCopy: {
        set () {},
        get () {
          return this.appData
        }
      },
      // 将应用的区域列表处理为相连的文字,处理页面刷新时的数据更新
      appInfo () {
        var result = []
        var appInfo = $.extend(true, {}, this.appDataCopy)
        if (appInfo.id && !appInfo.appName) {
          // After F5
          var appStorage = JSON.parse(localStorage.appInfo)
          '' + appInfo.id === '' + appStorage.id && (appInfo = appStorage)
        } else if (appInfo.id && appInfo.appName) {
          // Route from app list
          localStorage.appInfo = JSON.stringify(appInfo)
        }
        if (appInfo.areas && appInfo.areas.length > 0) {
          if (appInfo.areas.length > 1) {
            var areaCopy = $.extend(true, [], appInfo.areas)
            result = util.list2tree(areaCopy, 0, 'name')
            result = util.tree2list(result[0].children)
          } else {
            result = [appInfo.areas[0].name]
          }
          appInfo.areaText = result.length === 0 ? '' : result.join('，')
        } else {
          appInfo.areaText = ''
        }
        return appInfo
      },
      rootAreaId () {
        let id = ''
        if (this.areas && this.areas.length > 0) {
          id = this.areas[0].id
        }
        return id
      },
      selectNodeModule () {
        return !!(this.userRightList.includes('selectNodeModule') && this.editable.module)
      },
      editable () {
        let curData = this.currentCstData
        let items = {
          module: true,
          add: true,
          edit: true
        }
        /* 当前节点在:新建状态|父节点没有模板下|父节点模板类型为嵌套模板(1),'选择模板'功能禁用 */
        if (!curData || curData.isNew || !curData.pModule || (curData.pModuleType && '' + curData.pModuleType === '1')) {
          items.module = false
        } else {
          /* 当以上条件都不成立时,判断栏目是否为外跳栏目 */
          if (typeof curData.hasOutLink !== 'undefined') {
            /* 手动切换为外跳 */
            items.module = !curData.hasOutLink
          } else {
            /* 根据返回的linkUrl字段判断是否为外跳 */
            items.module = !(curData.linkUrl)
          }
        }

        /* 当前节点在:新建状态|父节点模板类型为嵌套模板(1)和父模板类型(4),'新建模板'功能禁用 */
        if (!curData || curData.isNew || (curData.pModuleType && ('' + curData.pModuleType === '1' || '' + curData.pModuleType === '4')) || curData.hasOutLink) {
          items.add = false
        }

        /* 当前节点在:新建状态|所选栏目为根栏目时,'重命名模板'功能禁用 */
        if (!curData || curData.isNew || this.currentCstData.pId === 0) {
          items.edit = false
        }

        return items
      }
    },
    watch: {
      currentCst: {
        handler (newVal) {
          this.$nextTick(() => {
            this.$refs.nodeTree.setCurrentKey(newVal)
            this.currentCstData = this.$refs.nodeTree.getCurrentNode()
          })
        }
      },
      appId: {
        immediate: true,
        handler (newApp) {
          if (newApp) {
            this.currentCst = ''
            this.getAppConstruction()
          }
        }
      }
    },
    components: {
      SelectTemp,
      AppEdit,
      MyTree,
      Pinyin
    },
    methods: {
      getAppConstruction () {
        let params = {
          appId: this.appId,
          page: 1,
          size: 999
        }
        this.axios.get(API.get_node_list, { params }).then((data) => {
          let rootId = 0
          data.rows.forEach(function (node) {
            node.hasOutLink = !!node.linkUrl
            if (node.pId === 0) {
              rootId = node.id
            }
          }, this)

          /* 将获取的列表数据结构转换为树型结构 */

          let nodeTree = util.list2tree(data.rows, rootId, 'title')
          this.appNodes = nodeTree

          if (this.appNodes.length > 0) {
            /* 有数据时,初始化记录器 */
            /* 根节点为初始展开状态 */
            this.addExpandedCst(this.appNodes[0].id)
            /* 初始化当前选中节点,由currentCst记录id,currentCstData记录节点数据 */
            this.initCurrentCst()
            /* 如果当前有初始化选中节点,则获取该节点的详情信息 */
            this.currentCst && this.getNodeDetail(this.currentCst)
          } else {
            /* 无数据,清空记录器 */
            this.currentCst = ''
            this.curNodeInfo = null
            this.currentCstData = null
          }

          /* 当currentCst没有变化,但是重新获取栏目列表时,会出现没有选中的节点取消选择的现象 */
          this.$nextTick(() => {
            this.expandCst(this.expandedCst)
            this.$refs.nodeTree.setCurrentKey(this.currentCst)
          })
        }).catch(() => {
          this.$message({
            message: '获取应用栏目失败!',
            type: 'error'
          })
        })
      },
      getNodeDetail (id) {
        let params = {
          id
        }
        this.axios.get(API.get_node_info, { params }).then((data) => {
          let {logoImage, backgroundImage, focusPoster, blurPoster} = data

          /**
           * 将返回的图片数据转为[{name: '', url: ''}]格式,
           * 并设置其原始url(例:如果logoImage不为空,则要设置oriIogoImage,
           * 在提交修改的时候服务器才知道logoImage是已经上传而且要保留的,
           * 如果设置oriIogoImage为空,则服务器认为应该删掉旧图片)
          */
          let images = {logoImage, backgroundImage, focusPoster, blurPoster}
          for (var key in images) {
            var filrstLetter = key[0].toUpperCase()
            var oriKey = 'ori' + filrstLetter + key.substring(1)
            if (images[key]) {

              this.$set(data, key, [{
                name: images[key].imageName,
                url: images[key].imageUrl
              }])

              data[oriKey] = images[key].imageUrl

            } else {
              this.$set(data, key, [])
              data[oriKey] = ''
            }
          }
          
          this.currentCstData.hasOutLink = !!(data.linkUrl)

          /* 将get_node_list接口和get_node_info接口返回的栏目的信息整合 */
          this.curNodeInfo = Object.assign({}, this.currentCstData, data)

          /* 如果该栏目有模板,并且不是外跳,并且父模板不是嵌套模板,则获取模板预览地址 */
          if (this.curNodeInfo.moduleId && !this.curNodeInfo.linkUrl && this.curNodeInfo.pModuleType !== 1) {
            this.getNodePreview(data.id)
          } else {
            this.curNodeTempUrl = ''
          }
        }).catch(() => {
          this.$message({
            message: '获取栏目详情失败!',
            type: 'error'
          })
        })
      },
      getNodePreview (id) {
        this.axios.get(API.get_node_prview_url, { params: { id } }).then((data) => {
          if (this.curNodeTempUrl === data.url) {
            this.reloadPreviewIframe = true
          } else {
            this.curNodeTempUrl = data.url
          }
        }).catch(() => {
          this.curNodeTempUrl = util.SITEROOT + 'static/errorTemp.html'
          this.$message({
            message: '获取模板预览地址失败!',
            type: 'error'
          })
        })
      },
      getChildNodes (pId, resolve) {
        let params = {
          pId,
          page: 1,
          size: 999
        }
        this.axios.get(API.get_node_list, { params }).then((res) => {
          if (this.newNodeData) {
            res.rows.push(this.newNodeData)
          }
          resolve(res.rows, () => {
            if (this.newNodeData) {
              this.$nextTick(() => {
                this.currentCst = this.newNodeData.id
                this.currentCstData = this.newNodeData
                this.showPinying($('.in-rename').eq(0))
              })
            }
          })
        }).catch((error) => {
          console.log(error)
          resolve([])
          this.$message({
            message: '获取子栏目失败!',
            type: 'error'
          })
        })
      },
      renderTreeNode (h, { node, data, store, $vue }) {
        /* 如果当前节点父节点没有模板,则该节点不能选择模板,所以要记录父节点的模板信息 */
        if (typeof node.parent.data === 'object' && !Array.isArray(node.parent.data)) {
          this.$set(data, 'pModule', node.parent.data.moduleId)
          this.$set(data, 'pModuleType', node.parent.data.moduleType)
        }
        /* 根节点是可以直接选模板的 */
        if (node.level === 1) {
          this.$set(data, 'pModule', true)
        }

        var self = this
        var wrapperClass = data.isNew ? 'tree-node-conent in-rename' : 'tree-node-conent'

        var ctrs = [
          h('span', {
            'class': ['ipanel-icon1 tree-node-renameok', self.curVal === '' ? 'disabled' : ''],
            on: {
              click: function (e) {
                e.stopPropagation()
                self.curVal !== '' && self.rename(e, node, data, store)
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
        return h('span', {'class': wrapperClass}, [
          h('i', {
            attrs: {
              title: data.isOnline ? '已上线' : '未上线'
            },
            'class': 'iconfont icon-xianshang' + (data.isOnline ? ' is-online' : '')}),
          h('i', {
            attrs: {
              title: data.moduleId ? '已导入页面' : '未导入页面'
            },
            'class': 'iconfont icon-zhizuomoban' + ('' + data.hasPage === '1' ? ' has-temp' : '')}),
          h('span', {
            attrs: {
              title: data.title
            },
            'class': 'tree-node-label'}, data.title),
          h('span', {
            'class': 'tree-node-move-handler',
            attrs: {
              title: '移动排序'
            },
            on: {
              mousedown (e) {
                self.handleMouseDown(e, node, data, $vue)
              }
            }
          }),
          h('input', {
            'class': 'tree-node-input',
            on: {
              click: function (e) { e.stopPropagation() },
              input: function (e) {
                let val = e.target.value
                let result = val.match(/([\u4e00-\u9fa5]|\w)+/g)
                result = result ? result.join('') : ''
                e.target.value = result
                self.confirmColumn.name = result
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
        if ($('.in-rename').length === 0) {
          let data = this.currentCstData
          this.curVal = data.title
          this.confirmColumn.name = data.title
          this.initEnName = data.enName
          let $treeNode = $('.app-edit-construction .is-current>.el-tree-node__content').find('.tree-node-conent')
          $treeNode.addClass('in-rename')
          this.$nextTick(function () {
            this.showPinying($treeNode)
          })
        } else {
          this.$message({
            message: '请执行完当前操作!',
            type: 'warning'
          })
        }
      },
      rename () {
        var data = this.currentCstData
        var id = data.id
        var self = this
        var $treeNode = $('.in-rename').eq(0)
        var newName = $treeNode.find('.tree-node-input').val().trim()
        var enName = self.confirmColumn.enName
        if (newName) {
          var params = {
            title: self.confirmColumn.name,
            enName,
            pId: data.pId
          }
          !data.isNew && (params.id = id)
          self.axios.get(API.check_node_exist, { params }).then(function () {
            if (data.isNew) {
              self.requestNewNode(newName, enName, data.pId, function (resData) {
                // self.currentCstObj.pId = data.pId
                // self.currentCstObj.name = newName
                self.newNodeId = resData.id
                self.editingColumn = false
                self.confirmColumn.name = ''
                self.newNodeData = null
                data.isNew = false
                data.title = newName
                data.enName = enName
                self.curVal = ''
                $treeNode.removeClass('in-rename')
              })
            } else {
              self.requestEditNode(newName, enName, data.id, data.pId, function () {
                // self.currentCstObj.pId = data.pId
                // self.currentCstObj.name = newName
                self.editingColumn = false
                self.confirmColumn.name = ''
                // self.currentCst = data.id
                data.title = newName
                data.enName = enName
                $treeNode.removeClass('in-rename')
              })
            }
          }).catch(function () {
            self.$message({
              message: '栏目名称验重失败!',
              type: 'error'
            })
          })
        } else {
          this.cancelRename()
        }
      },
      cancelRename () {
        $('.in-rename').eq(0).removeClass('in-rename')
        var data = this.currentCstData
        this.curVal = ''
        this.editingColumn = false
        this.confirmColumn.name = ''
        this.initEnName = ''
        if (data.isNew) {
          this.$refs.nodeTree.store.remove(data)
          this.currentCst = this.oldCts
          this.currentCstData = this.oldCtsData
          this.newNodeData = null
        }
      },
      addChild () {
        if ($('.in-rename').length === 0) {
          var data = this.currentCstData
          var id = data.id
          var randomId = '' + Math.random()
          var newData = {
            id: randomId,
            title: '',
            isNew: true,
            pId: data.id,
            isLeaf: 1,
            isOnline: 1
          }
          const node = this.$refs.nodeTree.store.getCurrentNode()
          const level = node.level
          if (level > 2 && !node.isLeaf && node.childNodes.length === 0) {
            this.newNodeData = newData
            this.expandHandler(data, node)
          } else {
            this.expandHandler(data, node)
            this.$nextTick(() => {
              this.$refs.nodeTree.store.append(newData, data)
              this.currentCst = randomId
              this.currentCstData = newData
              this.$nextTick(() => {
                this.showPinying($('.in-rename').eq(0))
              })
            })
          }
          this.oldCts = id
          this.oldCtsData = data
        } else {
          this.$message({
            message: '请执行完当前操作!',
            type: 'warning'
          })
        }
      },
      confirmDel () {
        const self = this
        this.$confirm('删除后该节点以及该节点的所有子节点都将删除，确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.removeChildren()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      removeChildren () {
        var data = this.currentCstData
        const id = data.id
        this.requestDelNode(data, () => {
          this.removeExpandedCst(id)
          // this.currentCstData = null
          // this.currentCstNode = null
          // this.currentCst = ''
          this.getAppConstruction()
        })
      },
      confirmOnline () {
        var self = this
        var msg = this.currentCstData.isOnline ? '应用发布后，终端无法查看到所有下线栏目。是否下线此栏目？' : '应用发布后，终端可查看所有上线栏目。是否上线此栏目？'
        this.$msgbox({
          title: '提示',
          message: msg,
          showCancelButton: true,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(action => {
          self.requestChangeStatus()
        })
      },
      expandCst (expandedCst) {
        let nodesMap = this.$refs.nodeTree.store.nodesMap
        expandedCst.forEach(function (key) {
          let expandNode = nodesMap[key]
          if (expandNode && !expandNode.isLeaf && expandNode.childNodes.length === 0) {
            this.expandHandler(expandNode.data, expandNode)
          }
        }, this)
      },
      /** 
       * 记录节点的展开状态,以便保持状态
      */
      expandHandler (data, node, instance) {
        this.addExpandedCst(node.key)
        if (!node.isLeaf && node.childNodes.length === 0) {
          node.loading = true
          this.getChildNodes(node.key, (children, callback) => {
            node.loaded = true
            node.loading = false
            node.doCreateChildren(children, {})
            node.updateLeafState()

            let expandedCst = this.expandedCst
            let curKey = this.currentCst
            let childExpendKey = []

            children.forEach(function (child) {
              let childKey = child.id
              if (childKey === curKey) {
                this.$nextTick(() => {
                  this.$refs.nodeTree.setCurrentKey(curKey)
                })
                return true
              }
              if (expandedCst.includes(childKey)) {
                childExpendKey.push(childKey)
              }
            }, this)

            if (childExpendKey.length > 0) {
              this.expandCst(childExpendKey)
            }

            if (callback) callback()
          })
        }
      },
      /** 
       * 记录节点的展开状态,以便保持状态
      */
      collapseHandler (data, node, store) {
        this.removeExpandedCst(data.id)
      },
      changeCurCst (data, node) {
        this.currentCst = data.id
        this.currentCstData = data
        this.currentCstNode = node
        !data.isNew && this.getNodeDetail(data.id)
      },
      removeExpandedCst (cstIdx) {
        var expandedCst = this.expandedCst
        const idx = expandedCst.indexOf(cstIdx)
        if (idx !== -1) {
          this.expandedCst.splice(idx, 1)
        }
      },
      addExpandedCst (cstIdx) {
        var expandedCst = this.expandedCst
        const idx = expandedCst.indexOf(cstIdx)
        if (idx === -1) {
          this.expandedCst.push(cstIdx)
        }
      },
      initCurrentCst () {
        /* 动态加载的不能初始化 */
        if (this.newNodeId) {
          this.currentCst = this.newNodeId
          this.newNodeId = ''
        } else if (this.currentCst === '') {
          this.currentCst = this.appNodes[0].id
          this.currentCstData = this.appNodes[0]
        }
      },
      finishSelectTemp (id, moduleId, moduleType) {
        this.getAppConstruction()
        this.getNodeDetail(id)
        // this.currentCstData.moduleId = moduleId
        // this.currentCstData.moduleType = moduleType
        // this.currentCstData.hasPage = 1
        this.currentView = 'AppEdit'
      },
      cancelSelectTemp () {
        this.currentView = 'AppEdit'
      },
      changeOutLink (val) {
        this.curNodeInfo.hasOutLink = val
        let curData = this.currentCstData
        curData.hasOutLink = val
        if (val === true) {
          /* 设置为外跳,模板预览地址设为空 */
          this.curNodeTempUrl = ''
        } else if (curData.moduleId) {
          /* 设置回非外跳时,本来是外跳栏目或者没有选择模板的,不能进行栏目预览 */
          this.getNodePreview(curData.id)
        }
      },
      showMateDetail (mate) {
        this.$emit('showMateDetail', mate)
      },
      requestNewNode (title, enName, pId, callback) {
        var data = new FormData()
        data.append('appId', this.appId)
        data.append('title', title)
        data.append('pId', pId)
        data.append('enName', enName)
        this.axios.post(API.add_node, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resData) => {
          callback(resData)
          this.getAppConstruction()
          this.$message({
            message: '添加栏目成功!',
            type: 'success'
          })
        }).catch(() => {
          this.curVal = ''
          this.$message({
            message: '添加栏目失败!',
            type: 'error'
          })
        })
      },
      requestEditNode (title, enName, id, pId, callback) {
        var self = this
        var data = new FormData()
        let {oriBackgroundImage, oriBlurPoster, oriFocusPoster, oriLogoImage} = this.curNodeInfo
        data.append('appId', this.appId)
        data.append('title', title)
        data.append('id', id)
        data.append('pId', pId)
        data.append('oriBackgroundImage', oriBackgroundImage)
        data.append('oriBlurPoster', oriBlurPoster)
        data.append('oriFocusPoster', oriFocusPoster)
        data.append('oriLogoImage', oriLogoImage)
        data.append('enName', enName)
        this.axios.put(API.edit_node, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(function (resData) {
          callback()
          self.$message({
            message: '编辑栏目成功!',
            type: 'success'
          })
        }).catch(function () {
          self.$message({
            message: '编辑栏目失败!',
            type: 'error'
          })
        })
      },
      requestDelNode (nodeData, callback) {
        var params = {
          ids: nodeData.id
        }
        this.axios.delete(API.del_node, { params }).then(() => {
          callback()
          this.$message({
            message: '删除栏目成功!',
            type: 'success'
          })
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '删除栏目失败!',
            type: 'error'
          })
        })
      },
      requestChangeStatus () {
        let nodeData = this.currentCstData
        let isOnline = nodeData.isOnline
        let data = new URLSearchParams()
        data.append('id', nodeData.id)
        data.append('isOnline', isOnline === 1 ? 0 : 1)
        this.axios.patch(API.change_node_status, data).then(() => {
          this.getAppConstruction()
          this.$message({
            message: '操作成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '操作失败!',
            type: 'error'
          })
        })
      },
      handleMouseDown (e, node, data, $vue) {
        var self = this
        var targetIndex = -1
        var oriIndex = -1
        var handler = e.target
        var curEle = $vue.$el.parentElement.parentElement
        var parent = curEle.parentElement
        var children = Array.from(curEle.parentElement.children)
        var offsetTop = parseInt(curEle.offsetTop)
        var oriOriHeight = parseInt(curEle.clientHeight)
        var pHeight = parseInt(parent.clientHeight)
        var pTop = parseInt(parent.offsetTop)
        var oriPosition = {
          x: e.clientX,
          y: e.clientY
        }
        var limitY = {
          min: pTop,
          max: pTop + pHeight - oriOriHeight + 13
        }
        oriIndex = getIndex(offsetTop, pTop, 26)
        handler.setAttribute('class', handler.getAttribute('class') + ' is-moving')
        curEle.style.position = 'absolute'
        curEle.style.zIndex = '9999'
        curEle.style.width = '100%'
        curEle.style.top = offsetTop + 'px'
        curEle.style.outline = 'thin solid #20a0ff'
        var placeHolder = this.createPlaceHolder(curEle, parent)
        document.body.addEventListener('mousemove', handleMouseMove)
        document.body.addEventListener('mouseup', initNode)

        function handleMouseMove (e) {
          let curPosition = {
            x: e.clientX,
            y: e.clientY
          }
          let lastTop = offsetTop + curPosition.y - oriPosition.y
          if (lastTop > limitY.max) {
            curEle.style.top = limitY.max + 'px'
          } else if (lastTop < limitY.min) {
            curEle.style.top = limitY.min + 'px'
          } else {
            curEle.style.top = lastTop + 'px'
          }
          if (parseInt(curEle.style.top) === limitY.min) {
            parent.insertBefore(placeHolder, children[0])
            targetIndex = 0
          } else if (parseInt(curEle.style.top) === limitY.max) {
            parent.insertBefore(placeHolder, children[children.length - 1])
            parent.insertBefore(children[children.length - 1], placeHolder)
            targetIndex = children.length - 1
          } else {
            let diff = parseInt(curEle.style.top) - offsetTop
            let offsetY = (diff - ((diff) % 13)) / 13
            if (offsetY % 2 !== 0) {
              let step = 0
              if (offsetY > 0) {
                step = offsetY + 1
              } else {
                step = offsetY - 1
              }
              let targetTop = step * 13 + offsetTop
              let index = getIndex(targetTop, pTop, 26)
              parent.insertBefore(placeHolder, children[index])
              let placeHolderIndex = getIndex(placeHolder.offsetTop, pTop, 26)
              targetIndex = placeHolderIndex
            }
          }
        }

        function initNode () {
          document.body.removeEventListener('mousemove', handleMouseMove)
          handler.setAttribute('class', 'tree-node-move-handler')
          parent.insertBefore(curEle, placeHolder)
          parent.removeChild(placeHolder)
          curEle.style.position = 'relative'
          curEle.style.top = '0'
          curEle.style.zIndex = 'unset'
          curEle.style.outline = 'none'
          document.body.removeEventListener('mouseup', initNode)
          if (oriIndex !== targetIndex) {
            let isLast = targetIndex === node.parent.childNodes.length - 1
            self.sortNode(data.id, node.parent.childNodes[targetIndex].data.id, isLast)
            console.log(oriIndex, targetIndex)
            let oriNode = node.parent.childNodes.splice(oriIndex, 1)
            if (targetIndex === 0) {
              node.parent.childNodes.unshift(oriNode[0])
            } else {
              node.parent.childNodes.splice(targetIndex, 0, oriNode[0])
            }
            console.log(node.parent.childNodes)
          }
        }

        function getIndex (childTop, parentTop, step) {
          let childOffsetP = childTop - parentTop
          return (childOffsetP - (childOffsetP % step)) / step
        }
      },
      createPlaceHolder (curEle, parent) {
        var eles = document.getElementsByClassName('my-sort-placeholder')
        if (eles.length > 0) {
          return eles[0]
        }
        var placeHolder = document.createElement('div')
        placeHolder.setAttribute('class', 'my-sort-placeholder')
        placeHolder.style.height = '24px'
        placeHolder.style.width = '100%'
        placeHolder.style.backgroundColor = '#e8eaec'
        placeHolder.style.border = 'thin dashed #ccc'
        parent.insertBefore(placeHolder, curEle)
        return placeHolder
      },
      sortNode (curDataId, targetDateId, isLast) {
        let params = new URLSearchParams()
        params.append('id', curDataId)
        params.append('destNodeId', targetDateId)
        params.append('moveType', isLast ? 2 : 1)
        this.axios.patch(API.sort_node, params).then(() => {
        }).catch(() => {
          this.getAppConstruction()
          this.$message({
            message: '排序失败!',
            type: 'error'
          })
        })
      },
      showPinying ($treeNode) {
        if ($treeNode) {
          this.editingColumn = true
          var $node = $treeNode.offsetParent()
          var offset = $node.offset()
          if (!offset.left || !offset.top || (offset.left === 0 && offset.top === 0)) {
            setTimeout(() => {
              this.showPinying($('.in-rename').eq(0))
            }, 100)
          } else {
            $('.confirm-pinyin').css({
              left: offset.left + 208,
              top: offset.top
            })
          }
        }
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next(function (vm) {
        if (from.path === '/') {
          vm.$emit('new-edit', {id: vm.$route.params.id})
        }
      })
    },
    activated () {
      this.currentView = 'AppEdit'
    }
  }
</script>
<style scoped>
  .app-edit-box{
    height: 600px;
    width: 100%;
  }
  .el-tree{
    border: none;
    height: 401px;
    user-select: none;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .app-edit-content{
    height: 100%;
  }
  .app-info{
    position: absolute;
    top: 30px;
    right: 30px;
    height: 30px;
    line-height: 30px;
  }
  .app-info label{
    color: #7b828c;
    font-size: 14px;
    vertical-align: middle;
  }
  .app-info span{
    color: #1f2d3d;
    font-size: 14px;
    margin-right: 46px;
    vertical-align: middle;
  }
  .app-info-area{
    max-width: 200px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    word-spacing: nowrap;
    white-space: nowrap;
    vertical-align: middle;
  }
  .app-edit-construction{
    width: 198px;
    height: 100%;
    float: left;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
    position: relative;
  }
  .app-edit-construction-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #1f2d3d;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
  }
  .app-edit-main{
    width: calc(100% - 220px);
    height: 100%;
    float: left;
    margin-left: 18px;
  }
  .app-edit-cover{
    position: relative;
    width: calc(100% - 220px);
    height: 100%;
    background-color: #fff;
    left: 216px;
    z-index: 1;
    border: 1px solid #d3dce6;
    box-sizing: border-box;
  }
  .app-edit-cover-text{
    position: absolute;
    top: calc(50% - 10px);
    left: calc(50% - 60px);
    width: 120px;
    color: #475669;
    text-align: center;
    line-height: 20px;
  }
  .app-edit-construction-cover{
    position: absolute;
    top: 49px;
    left: 0;
    width: 100%;
    height: calc(100% - 49px);
    background-color: rgba(255,255,255,.7);
  }
  .app-edit-construction-btns .el-row{
    margin: 10px 0;
  }
  .app-edit-construction-btns .el-col{
    text-align: center;
  }
  .confirm-pinyin{
    position: fixed;
    top: 0;
    left: 0;
    min-height: 40px;
    max-width: 200px;
    background-color: #fff;
    z-index: 99;
    border: 1px solid #d1dbe5;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  .pinyin-wp::-webkit-scrollbar-track{
    background-color: #fff;
  }
  .pinyin-wp::-webkit-scrollbar{
    width: 5px;
    background-color: #b4b9bd;
  }
  .pinyin-wp::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: #b4b9bd;
  }
  .to-left-tra{
    display: block;
    width: 0;
    height: 0;
    border: 6px solid #d1dbe5;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(-45deg);
    position: relative;
    top: 9px;
    left: -6px;
  }
  .to-left-tra::after{
    content: '';
    display: block;
    width: 0;
    height: 0;
    border: 6px solid #fff;
    border-right-color: transparent;
    border-bottom-color: transparent;
    position: absolute;
    top: -5px;
    left: -5px;
  }
</style>
<style>
  .app-edit-box .app-edit-construction .iconfont{
    font-size: 14px;
  }
  .app-edit-construction .has-temp.icon-zhizuomoban,.app-edit-construction .is-online.icon-xianshang{
    color: #13CE66;
  }
  .app-edit-construction .icon-zhizuomoban, .app-edit-construction .icon-xianshang{
    color: #797878;
  }
  .app-edit-content .ipanel-cc2p span{
    margin-bottom: 5px;
  }
  .app-edit-construction .ipanel-icon1{
    cursor: pointer;
    margin: 0;
  }
  .app-edit-box .el-tree-node.is-current>.el-tree-node__content{
    background-color: #d3dce6 !important;
  }
  .app-edit-box .tree-node-label{
    margin-right: 5px;
    font-size: 14px;
    color: #475669;
    display: inline-block;
    vertical-align: middle;
  }
  .app-edit-box .tree-node-ctr{
    position: absolute;
    right: 0;
    top: 0;
    width: 80px;
    background-color: rgba(255,255,255,.7);
    height: 26px;
    display: none;
    align-items: center;
    justify-content: space-around;
  }
  .app-edit-box .el-tree-node__content{
    position: relative;
    cursor: default;
  }
  .app-edit-box .tree-node-conent.in-rename .tree-node-ctr{
    width: 60px;
    display: flex;
  }
  .app-edit-box .in-rename .tree-node-renameok,.app-edit-box .in-rename .tree-node-renameno{
    display: block;
  }
  .app-edit-box .in-rename .tree-node-del,.app-edit-box .in-rename .tree-node-rename,.app-edit-box .in-rename .tree-node-addChild{
    display: none;
  }
  .app-edit-box .in-rename .tree-node-input{
    display: block;
  }
  .app-edit-box .tree-node-input:hover {
    border-color: #8391a5;
  }
  .app-edit-box .tree-node-input:focus {
    outline: 0;
    border-color: #20a0ff;
  }
  .app-edit-box .in-rename .tree-node-label{
    display: none;
  }
  .app-edit-box .tree-node-input{
    display: none;
    position: absolute;
    left: 20px;
    top: 1px;
    width: 100px;
    height: 24px;
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
  .app-edit-box .tree-node-input::-webkit-input-placeholder{
    font-size: 12px;
    line-height: 30px;
  }
  .app-edit-box .tree-node-renameok{
    display: none;
    background-position-x: -150px;
    background-position-y: -71px;
  }
  .app-edit-box .tree-node-renameno{
    display: none;
    background-position-x: -185px;
    background-position-y: -71px;
  }
  .app-edit-box .tree-node-renameok.disabled{
    cursor: no-drop;
  }
  .app-edit-box .in-rename .icon-xianshang,.app-edit-box .in-rename .icon-zhizuomoban{
    display: none;
  }
  .app-edit-box .pinyin-wp .pinyin{
    max-width: 190px;
    box-sizing: border-box;
    overflow-wrap: break-word;
  }
  .app-edit-box .el-tree-node{
    background-color: #fff;
  }
  .app-edit-box .tree-node-move-handler.is-moving{
    background-color: #20a0ff;
    display: block;
  }
  .app-edit-box .el-tree-node__content{
    position: relative;
  }
  .app-edit-box .el-tree-node__content:hover .tree-node-move-handler{
    display: block;
  }
  .app-edit-box .tree-node-move-handler{
    height: 100%;
    width: 20px;
    display: none;
    background-image: url(./../../../../static/imgs/icon/movedot.png);
    background-repeat: no-repeat;
    background-position-y: 5px;
    background-position-x: 2px;
    background-color: rgba(58, 142, 230, 0.45);
    position: absolute;
    right: 0;
    top: 0;
    cursor: move;
    /* visibility: hidden; */
  }
</style>
