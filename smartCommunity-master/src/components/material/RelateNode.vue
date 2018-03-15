<template>
  <div class="relate-column" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">关联栏目</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <!-- 选择栏目begin -->
      <div class="relate-column-set relate-column-content i-scollbar" v-show="view.curView === 'set'">
        <div class="relate-column-app">
          <div class="header">选择应用</div>
          <div class="relate-column-app-content">
            <div class="relate-column-app-selector">
              <el-select v-model="appIdSelected" @remove-tag="removeApp" @change="appSelectChange" filterable multiple placeholder="输入关键词查找应用" style="margin-bottom: 10px">
                <el-option
                  v-for="app in appList"
                  :key="app.id"
                  :label="app.appName"
                  :value="app.id">
                </el-option>
              </el-select>
              <div class="relate-column-apps-wp">
                <div
                  class="relate-column-apps-item"
                  :class="appId === curSelectApp ? 'active': ''"
                  v-for="appId in appIdSelected"
                  :key="appId"
                  @click="appCurChange(appId)">
                  {{getAppName(appId)}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="relate-column-select">
          <div class="header">选择栏目</div>
          <div class="relate-column-select-content i-scollbar">
            <my-tree
              lazy
              ref="colTree"
              node-key="id"
              :load="loadNode"
              :check-strictly="true"
              :data="curNodeTree"
              :key="curSelectApp"
              :props="nodeProps"
              :default-expanded-keys="ndoeExpKey"
              :default-checked-keys="checkedKeysInNodeTree"
              :render-content="renderNodeContent"
              @check-change="nodeCheckChange"
              @node-click="nodeClick"
              show-checkbox>
            </my-tree>
          </div>
        </div>
        <div class="relate-column-btns">
          <el-col :span="3" :offset="8"><el-button type="primary" :loading="submiting" @click="checkUnique">{{immediate?'提交':'确认'}}</el-button></el-col>
          <el-col :span="3" :offset="2"><el-button @click="close">取消</el-button></el-col>
        </div>
      </div>
      <!-- 选择栏目end -->

      <!-- 确认栏目begin -->
      <div class="relate-column-confirm relate-column-content" v-show="view.curView === 'confirm'">
        <div class="relate-column-content-inner">
          <el-row class="confirm-row">
            <el-col :span="4" class="title">素材标题</el-col>
            <el-col :span="19" :offset="1">{{mateList[0].title}}</el-col>
          </el-row>
          <el-row class="confirm-row">
            <el-col :span="4" class="title">新增关联栏目</el-col>
            <el-col v-if="nodeAppend.length === 0" :span="19" :offset="1">无</el-col>
            <el-col v-else :span="19" :offset="1">
              <el-row v-for="(append,index) in nodeAppend" :key="index">
                <el-col :span="24">
                  <span class="relate-column-text">{{appNameMap[append.appId] + ' - ' + append.title}}</span>
                  <i class="ipanel-icon2 ipanel-icon-preview" v-if="append.contentModuleId || append.contentModuleId === 0" title="预览"></i></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="confirm-row">
            <el-col :span="4" class="title">解除关联</el-col>
            <el-col v-if="nodeRemove.length === 0" :span="19" :offset="1">无</el-col>
            <el-col v-else :span="19" :offset="1">
              <el-row v-for="(remove,index) in nodeRemove" :key="index">
                <el-col :span="24">{{appNameMap[remove.appId] + ' - ' + remove.title}}</el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="relate-column-btns">
          <el-col :span="3" :offset="8"><el-button type="primary" @click="close">确认</el-button></el-col>
          <el-col :span="3" :offset="2"><el-button @click="view.curView='set'">返回</el-button></el-col>
        </div>
      </div>
      <!-- 确认栏目end -->
    </div>
    <div class="popup-cover"></div>
    <!-- 选择模板begin -->
    <select-temp
      :v-if="view.selectTempShow"
      :show.sync="view.selectTempShow"
      :top-area-id="topAreaId"
      :value="nodeWaitSelectTemp && nodeWaitSelectTemp.contentModuleId"
      @finish-select-temp="finishSelectTemp"></select-temp>
    <!-- 选择模板end -->
  </div>
</template>
<script>
  /* eslint-disable no-undef */
  import SelectTemp from './SelectTemp.vue'
  import util from './../../assets/js/util'
  import API from './../../assets/js/api'
  import MyTree from './../../components/tree/src/tree'
  export default {
    name: 'relateNode',
    props: {
      curView: {
        type: String,
        required: true
      },
      show: {
        type: Boolean,
        required: true
      },
      mateList: {
        type: Array,
        required: true
      },
      oriNodes: {
        type: Array,
        default () {
          return []
        }
      },
      immediate: {
        type: Boolean,
        default () {
          return true
        }
      },
      topAreaId: [Number, String]
    },
    data () {
      return {
        // 选择的app列表
        appIdSelected: [],
        // 关联的app,键为appId,值为该app下关联的栏目
        appSelected: {},
        appList: [],
        appNameMap: {},
        curSelectApp: -1,
        curNodeTree: [],
        nodeWaitSelectTemp: null,
        nodeSelect: [],
        checkedKeysInNodeTree: [],
        nodeAppend: [],
        nodeRemove: [],
        nodeProps: {
          label: 'title',
          children: 'children',
          isLeaf (data) {
            return data.isLeaf === 1
          },
          disabled (data) {
            return data.isLeaf !== 1 || '' + data.hasPage === '0' || data.hasPage === null
          }
        },
        view: {
          curView: this.curView,
          selectTempShow: false
        },
        submiting: false
      }
    },
    components: {
      SelectTemp,
      MyTree
    },
    computed: {
      ndoeExpKey () {
        let keys = []
        this.curNodeTree.forEach(function (node) {
          keys.push(node.id)
        }, this)
        return keys
      }
    },
    watch: {
      show (show) {
        if (show) {
          this.appSelected = {}
          this.appIdSelected = []
          if (this.oriNodes.length > 0) {
            this.oriNodes.forEach(function (node) {
              /* 初始化栏目id数组,以及'应用-栏目'Map */
              !this.appIdSelected.includes(node.appId) && this.appIdSelected.push(node.appId)
              if (this.appSelected[node.appId]) {
                this.appSelected[node.appId].nodes.push(node)
              } else {
                this.appSelected[node.appId] = {
                  appName: '',
                  nodes: [node]
                }
              }
            }, this)
          }
        }
      }
    },
    methods: {
      close () {
        this.view.curView = 'set'
        this.appSelected = {}
        this.appIdSelected = []
        this.curNodeTree = []
        this.nodeSelect = []
        this.curSelectApp = -1
        this.checkedKeysInNodeTree = []
        this.nodeAppend = []
        this.nodeRemove = []
        this.$emit('update:show', false)
      },
      getAppList () {
        let params = {
          page: 1,
          size: 999,
          areaId: this.topAreaId
        }
        this.axios.get(API.get_app_list, { params }).then((data) => {
          this.appList = data.rows
          data.rows.forEach(function (app) {
            this.appNameMap[app.id] = app.appName
          }, this)
        })
      },
      getNodeList (appId) {
        var params = {
          appId,
          page: 1,
          size: 999
        }
        this.axios.get(API.get_node_list, { params }).then((data) => {
          let rootId = 0
          data.rows.forEach(function (node) {
            if (node.pId === 0) {
              rootId = node.id
            }
          }, this)
          let nodeTree = util.list2tree(data.rows, rootId, 'title')
          this.curNodeTree = nodeTree
        })
      },
      getAppName (appId) {
        let appList = this.appList
        let appName = ''
        for (var i = 0; i < appList.length; i++) {
          var app = appList[i]
          if ('' + app.id === '' + appId) {
            appName = app.appName
            break
          }
        }
        return appName
      },
      loadNode (node, resolve) {
        if (node.level === 0) {
          return resolve(node.data.key ? [node.data] : [])
        }
        if (node.level === 1 || node.level === 2) {
          return resolve(node.data.children || [])
        }
        if (node.level > 2) {
          let params = {
            pId: node.data.id,
            page: 1,
            size: 999
          }
          this.axios.get(API.get_node_list, { params }).then((res) => {
            resolve(res.rows)
          }).catch(() => {
            resolve([])
            this.$message({
              message: '获取子栏目失败!',
              type: 'error'
            })
          })
        }
      },
      appCurChange (appId) {
        this.curSelectApp = appId
        this.getNodeList(appId)
        let curAppNodes = this.appSelected[appId].nodes
        let nodeIds = []
        curAppNodes.forEach(function (node) {
          nodeIds.push(node.id)
        }, this)
        this.checkedKeysInNodeTree = nodeIds
      },
      appSelectChange (selected) {
        selected.forEach(function (element) {
          if (!this.appSelected.hasOwnProperty(element)) {
            this.appSelected[element] = {
              appName: this.getAppName(element),
              nodes: []
            }
          }
        }, this)
      },
      nodeCheckChange (data, checked, childChecked) {
        let checkKeys = []
        let nodes = this.$refs.colTree.getCheckedNodes()
        this.appSelected[this.curSelectApp].nodes = nodes
        nodes.forEach(function (node) {
          checkKeys.push(node.id)
        }, this)
        this.checkedKeysInNodeTree = checkKeys
      },
      removeApp (node) {
        this.curNodeTree = []
        this.curSelectApp = -1
        let appId = node.value
        if (this.appSelected[appId]) {
          delete this.appSelected[appId]
        }
      },
      checkUnique () {
        var origin = this.oriNodes.concat()
        var oldest = []
        var equalIdxOri = []
        var equalIdxOld = []
        this.nodeRemove = []
        this.nodeAppend = []
        for (var key in this.appSelected) {
          if (this.appSelected.hasOwnProperty(key)) {
            let app = this.appSelected[key]
            oldest.push(...app.nodes)
          }
        }
        for (var i = 0; i < origin.length; i++) {
          var ori = origin[i]
          for (var j = 0; j < oldest.length; j++) {
            var old = oldest[j]
            if (ori.id === old.id) {
              console.log(i + '-' + j)
              equalIdxOri.push(i)
              equalIdxOld.push(j)
            }
          }
        }
        origin.forEach(function (el, m) {
          if (equalIdxOri.indexOf(m) === -1) {
            this.nodeRemove.push(el)
          }
        }, this)
        oldest.forEach(function (el, n) {
          if (equalIdxOld.indexOf(n) === -1) {
            this.nodeAppend.push(el)
          }
        }, this)
        this.nodeSelect = oldest
        this.submit()
      },
      renderNodeContent (h, { node, data, store }) {
        let self = this

        /* 对栏目树的每一个栏目都进行判断,如果该栏目选择了内容页模板,且该栏目是初始存在的,则更新初始栏目列表里面的数据,
        *  如果栏目树中该栏目没有选择内容页模板,即"data.contentModuleId === null",则用初始栏目的数据覆盖栏目树中的该栏目
        *
        * oriNodes(已经存在) <========================> nodeTree(用户选择)
        *                      同步contentModuleId
        */
        let oriNodes = this.appSelected[data.appId].nodes
        if (Array.isArray(oriNodes)) {
          oriNodes.some(function (oriNode) {
            if (data.id === oriNode.id) {
              if (data.contentModuleId === null) {
                data.contentModuleId = oriNode.contentModuleId
              } else {
                oriNode.contentModuleId = data.contentModuleId
              }
              return true
            }
          }, this)
        }

        return h('span', {
          style: {
            width: '100%',
            height: '26px',
            lineHeight: '26px'
          }
        }, [
          data.title,
          h('i', {
            style: {
              color: '#13CE66',
              fontSize: '12px',
              float: 'right',
              display: node.checked && (!!data.contentModuleId || data.contentModuleId === 0) ? 'block' : 'none'
            },
            attrs: {
              class: 'iconfont icon-checkbox'
            }
          }),
          h('button', {
            style: {
              float: 'right',
              marginRight: '5px',
              marginTop: '2px',
              display: node.checked ? 'block' : 'none'
            },
            attrs: {
              class: 'select-temp-btn'
            },
            domProps: {
              innerHTML: '选择模板'
            },
            on: {
              click (e) {
                self.selectTemp(e, data, node)
              }
            }
          })
        ])
      },
      selectTemp (e, data, node) {
        e.stopPropagation()
        this.nodeWaitSelectTemp = data
        this.view.selectTempShow = true
      },
      submit () {
        if (this.immediate) {
          /* 立即请求接口关联栏目 */
          let data = new URLSearchParams()
          if (this.nodeSelect.length > 0) {
            this.nodeSelect.forEach(function (node) {
              let param = '' + node.id + '&'
              if (node.contentModuleId || node.contentModuleId === 0) {
                param += node.contentModuleId
              }
              data.append('nodeIds', param)
            }, this)
          } else {
            data.append('nodeIds', '')
          }
          data.append('id', this.mateList[0].id)

          this.submiting = true
          this.axios.patch(API.entry_link_node, data).then((data) => {
            this.view.curView = 'confirm'
            this.submiting = false
            this.$message({
              message: '关联栏目成功!',
              type: 'success'
            })
          }).catch(() => {
            this.submiting = false
            this.$message({
              message: '关联栏目失败!',
              type: 'error'
            })
          })
        } else {
          /* 触发事件,将选择的栏目信息传递出去 */
          this.nodeSelect.forEach(function (node) {
            node.appName = this.appNameMap[node.appId]
          }, this)
          this.$emit('change-nodes', this.nodeSelect)
          this.close()
        }
      },
      finishSelectTemp (contentModuleId) {
        console.log(contentModuleId)
        this.nodeWaitSelectTemp.contentModuleId = contentModuleId
      }
    },
    created () {
      this.getAppList()
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 590px;
    height: 522px;
    top: calc(50% - 261px);
    left: calc(50% - 285px);
  }
  .confirm-row+.confirm-row{
    margin-top: 20px;
  }
  .confirm-row .el-row{
    padding-bottom: 10px;
  }
  .title{
    color: #7b828c;
    text-align: right;
  }
  .header{
    height: 40px;
    box-sizing: border-box;
    background-color: #eff2f7;
    border-bottom: thin solid #d3dce6;
    text-align: center;
    line-height: 38px;
    font-weight: bold;
  }
  .relate-column-app{
    height: 400px;
    width: 50%;
    box-sizing: border-box;
    border: thin solid #d3dce6;
    float: left;
  }
  .relate-column-select{
    height: 400px;
    width: 50%;
    box-sizing: border-box;
    border: thin solid #d3dce6;
    float: left;
    margin-left: -1px;
  }
  .relate-column-content-inner{
    height: 400px;
    width: 100%;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .relate-column-btns{
    clear: both;
    padding-top: 10px;
  }
  .relate-column-app-content{
    padding: 5px;
  }
  .line-height-36{
    line-height: 36px;
  }
  .el-tree{
    border: none;
  }
  .relate-column-app-content,.relate-column-select-content{
    height: calc(100% - 40px);
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .relate-column-text{
    vertical-align: middle;
  }
  .relate-column-app-selector{
    text-align: center;
    margin: 10px 0;
  }
  .relate-column-apps-item{
    height: 30px;
    line-height: 30px;
    padding-left: 30px;
    text-align: left;
    color: #1F2D3D;
    cursor: pointer;
    background-color: #fff;
  }
  .relate-column-apps-item.active{
    background-color: #97d3ff;
  }
  .relate-column-apps-item:not(.active):hover{
    background-color: #e4e8f1;
  }
  
</style>
<style>
  .relate-column-app-content .el-checkbox__input.is-disabled{
    display: none;
  }
  .relate-column .select-temp-btn{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #bfcbd9;
    border-color: #c4c4c4;
    color: #1f2d3d;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
    border-radius: 4px;
  }
  .relate-column .select-temp-btn:hover,.relate-column .select-temp-btn:focus{
    color: #20a0ff;
    border-color: #20a0ff;
  }
</style>
