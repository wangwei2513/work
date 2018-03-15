<template>
  <div class="metarial-list">
    <el-row type="flex" align="middle">
      <el-col :span="1" class="gray-14 title">区域</el-col>
      <el-col :span="3">
        <area-cascader
          lazy
          clearable
          :load="loadArea"
          :areas="areas"
          :mulitiple="false"
          :area-props="{label:'name',children:'children'}"
          :default-expanded-keys="initExpand"
          :selected-area="mateFilter.areaId"
          @check-area="areaFilterChange">
        </area-cascader>
      </el-col>
      <el-col :span="2" class="gray-14 title">关联应用</el-col>
      <el-col :span="3">
        <el-cascader
          :disabled="mateFilter.areaId === ''"
          :props="cascaderProp"
          :options="appOptions"
          v-model="mateFilter.app"
          :show-all-levels="false"
          @active-item-change="getAppList"
          @change="appFilterChange"
        ></el-cascader>
      </el-col>
      <el-col :span="2" class="gray-14 title">关联栏目</el-col>
      <el-col :span="3">
        <el-cascader
          :disabled="mateFilter.app[0] == 0"
          :props="{label: 'title', value: 'id', children: 'children'}"
          :options="nodeOptions"
          v-model="mateFilter.node"
          :change-on-select="true"
          :show-all-levels="false"
          @change="getMateList"
        ></el-cascader>
      </el-col>
      <el-col :span="2" class="gray-14 title">状态</el-col>
      <el-col :span="3">
        <el-select v-model="mateFilter.entryStatus" @change="getMateList" placeholder="请选择状态">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="(val, key) in entryStatusMap" :label="val" :value="key" :key="key"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-input
          v-model="mateFilter.key"
          prefix-icon="el-icon-search"
          placeholder="请输入素材名关键字"
          @change="getMateList">
          <i slot="suffix" @click="clearInput" v-show="mateFilter.key" class="el-input__icon el-icon-circle-close"></i>
          </el-input>
        </el-col>
    </el-row>
    <div class="metarial-list-btns">
      <el-button type="primary" @click="addNewMaterial" v-if="userRightList.includes('addEntry')" class="top-operate">
        <i class="ipanel-icon1 ipanel-icon-new"></i>新建</el-button>
      <el-button type="primary" @click="newMaterialDetail" v-if="userRightList.includes('getEntryDetail')" :disabled="colSelect.length !== 1" class="top-operate">
        <i class="ipanel-icon2 ipanel-icon-detail"></i>详情</el-button>
      <el-button type="primary" @click="editNewMaterial" v-if="userRightList.includes('editEntry')" :disabled="!(colSelect.length === 1 && editable.edit)" class="top-operate">
        <i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
      <el-button type="primary" @click="showRelateColumn" v-if="userRightList.includes('assignEntryToNode')" :disabled="colSelect.length !== 1" class="top-operate">
        <i class="ipanel-icon2 ipanel-icon-link"></i>关联栏目</el-button>
      <el-button type="primary" @click="confirmDel" v-if="userRightList.includes('deleteEntry')" :disabled="!editable.del" class="top-operate">
        <i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
      <el-button type="primary" @click="confirmCheck" v-if="userRightList.includes('updateEntryStatus')" :disabled="!editable.check" class="top-operate">
        <i class="ipanel-icon2 ipanel-icon-audit"></i>提交审核</el-button>
      <el-button type="primary" @click="recycle" v-if="userRightList.includes('listAbandonedEntrys')" class="top-operate">
        <i class="iconfont icon-recycle"></i>回收站</el-button>
    </div>
    <div class="metarial-list-table">
      <el-table
        ref="metarialTable"
        :data="mateList"
        :height="490"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="title"
          label="素材标题"
          width="220">
        </el-table-column>
        <el-table-column
          prop="entryStatus"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.entryStatus !== 4">{{entryStatusMap[scope.row.entryStatus]}}</div>
            <el-button v-else type="text" @click="showRejectMsg(scope.row.rejectTxt)">已驳回</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="author"
          label="添加人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          width="220">
        </el-table-column>
        <el-table-column
          prop="column"
          label="关联栏目"
          width="260">
          <template slot-scope="scope">
            <!-- 没有关联栏目begin -->
            <div v-if="!scope.row.nodes || scope.row.nodes.length === 0" class="relate-column-item">无</div>
            <!-- 没有关联栏目end -->

            <!-- 关联栏目只有一个begin -->
            <div v-else-if="scope.row.nodes.length === 1">
              <div v-for="(col,index) in scope.row.nodes" class="relate-column-item" :key="index">
                <span class="relate-column-text" :title="col.appName+' - '+col.title">
                  {{col.appName+' - '+col.title}}
                </span>
                <i class="ipanel-icon2 ipanel-icon-preview" @click="previewEntry(col, scope.row)" v-if="col.hasPage == 1" title="预览"></i>
              </div>
            </div>
            <!-- 关联栏目只有一个end -->
            
            <!-- 关联栏目多于一个begin -->
            <el-popover trigger="hover" placement="right" popper-class="my-popover-style" v-else>
              <p v-for="(col, index) in scope.row.nodes" class="popover-p" :key="index" :title="col.appName+' - '+col.title">
                <span class="relate-column-text" :title="col.appName+' - '+col.title">
                  {{col.appName+' - '+col.title}}
                </span>
                <i class="ipanel-icon2 ipanel-icon-preview" @click="previewEntry(col, scope.row)" v-if="col.hasPage == 1" title="预览"></i>
              </p>
              <div slot="reference" class="col-wrapper">
                <div class="relate-column-item">
                  <p>
                    <span class="relate-column-text" :title="scope.row.nodes[0].appName+' - '+scope.row.nodes[0].title">
                      {{scope.row.nodes[0].appName+' - '+scope.row.nodes[0].title}}
                    </span>
                    <i class="ipanel-icon2 ipanel-icon-preview" @click="previewEntry(scope.row.nodes[0], scope.row)" v-if="scope.row.nodes[0].hasPage == 1" title="预览"></i>
                  </p>
                  <p>...</p>
                </div>
              </div>
            </el-popover>
            <!-- 关联栏目多于一个end -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button v-show="mateFilter.entryStatus == '3'" v-if="userRightList.includes('previewEntry')" type="text" size="small">预览</el-button>
            <el-button v-show="mateFilter.entryStatus == '3'" @click="changeSort(scope.row.id, 'top')" v-if="!scope.row.firstEntery" type="text" size="small">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="metarial-list-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="[20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 关联栏目操作begin -->
    <relate-node
      key="list-relate-node"
      :show.sync="view.relateColumnShow"
      :mateList="colSelect"
      :top-area-id="topAreaId"
      :ori-nodes="curEntryNodes"
      :curView="'set'">
    </relate-node>
    <!-- 关联栏目操作end -->

    <!-- 模板预览begin -->
      <iframe-preview
        :show.sync="view.iframePreviewShow"
        :url="previewUrl"
        :title="curPreTmp">
      </iframe-preview>
      <!-- 模板预览end -->
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import util from './../../../assets/js/util.js'
  // import Cookies from './../../../assets/js/cookie.js'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import RelateNode from './../RelateNode.vue'
  import AreaCascader from './../../common/AreaCascader.vue'
  import IframePreview from './../../common/IframePreview.vue'
  let appOptions = [{
    label: '全部',
    id: 0,
    value: 0
  }]
  let deviceMap = util.deviceMap
  for (var key in deviceMap) {
    appOptions.push({
      label: deviceMap[key],
      id: key,
      children: []
    })
  }
  export default {
    name: 'mateList',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      update: {
        type: Boolean
      },
      userRightList: {
        type: Array
      }
    },
    data () {
      return {
        mateList: [],
        mateFilter: {
          app: [0],
          entryStatus: 0,
          areaId: '',
          node: [0],
          key: ''
        },
        total: 0,
        curPage: 1,
        pageSize: 20,
        colSelect: [],
        curEntryNodes: [],
        previewUrl: '',
        curPreTmp: '',
        entryStatusMap: util.entryStatusMap,
        nodeOptions: [{
          title: '全部',
          value: 0,
          id: 0
        }],
        appOptions,
        cascaderProp: {
          value: 'id',
          label: 'label'
        },
        view: {
          relateColumnShow: false,
          iframePreviewShow: false
        }
      }
    },
    watch: {
      update: {
        immediate: true,
        handler (update) {
          if (update) {
            this.getMateList()
            this.$emit('update-mate-list', false)
          }
        }
      }
    },
    computed: {
      editable () {
        var selection = this.colSelect
        var len = selection.length
        var editable = {
          del: true,
          edit: true,
          check: true
        }
        if (len === 0) {
          return {
            del: false,
            edit: false,
            check: false
          }
        } else {
          for (var i in selection) {
            var select = selection[i]
            if (select.entryStatus === 2) {
              editable.del = false
            }
            if (select.entryStatus === 2 || select.entryStatus === 3) {
              editable.edit = false
            }
            if (select.entryStatus !== 1 && select.entryStatus !== 4) {
              editable.check = false
            }
          }
        }
        return editable
      },
      topAreaId () {
        var id = ''
        if (this.areas && this.areas.length > 0) {
          id = this.areas[0].id
        }
        return id
      }
    },
    components: {
      RelateNode,
      AreaCascader,
      IframePreview
    },
    methods: {
      getMateList () {
        let size = this.pageSize
        let page = this.curPage
        let { app, areaId, entryStatus, node, key } = this.mateFilter
        let filters = { appId: app[1], deviceId: app[0], areaId, nodeId: node, entryStatus, title: key }
        var params = {
          size,
          page
        }

        for (let n in filters) {
          let val = filters[n]
          if (Array.isArray(val) && val.length > 0) {
            if (val[0] && val[0] !== 0) {
              params[n] = val[val.length - 1]
            }
          } else {
            if (val && val !== 0) {
              params[n] = val
            }
          }
        }
        // '' + entryStatus !== '0' && (params.entryStatus = entryStatus)
        // key !== '' && (params.title = key)
        
        this.axios.get(API.get_entry_list, { params }).then((data) => {
          this.total = data.total
          this.mateList = data.rows
          let len = this.mateList.length
          if (this.curPage === 1) {
            len > 0 && (this.mateList[0].firstEntery = true)
          }
          if (this.curPage === Math.ceil(this.total / this.pageSize)) {
            len > 0 && (this.mateList[len - 1].lastEntery = true)
          }
        }).catch(() => {
          this.$message({
            message: '获取素材列表失败!',
            type: 'error'
          })
        })
      },
      getAppList (val) {
        let params = {
          page: 1,
          size: 999
        }
        let deviceId = val[0]
        if ('' + deviceId !== '0') {
          params.deviceId = deviceId
          this.axios.get(API.get_app_list, { params }).then((data) => {
            data.rows.forEach(function (row) {
              row.label = row.appName
            }, this)
            for (let i = 0; i < this.appOptions.length; i++) {
              let device = this.appOptions[i]
              if ('' + device.id === '' + deviceId) {
                device.children = data.rows
              }
            }
          })
        }
      },
      areaFilterChange (areaId) {
        this.mateFilter.areaId = areaId
        this.mateFilter.app = [0]
        this.mateFilter.node = [0]
        this.getMateList()
      },
      appFilterChange (val) {
        let params = {
          page: 1,
          size: 999
        }
        let appId = val[1]
        if ('' + appId !== '0') {
          params.appId = appId
          this.axios.get(API.get_node_list, { params }).then((data) => {
            let rootId = 0
            data.rows.forEach(function (node) {
              if (node.pId === 0) {
                rootId = node.id
              }
            }, this)
            let nodeTree = util.list2tree(data.rows, rootId, 'title')
            nodeTree.unshift({
              id: 0,
              title: '全部',
              label: '全部',
              isLeaf: 1
            })
            this.nodeOptions = nodeTree
          })
        } else {
          this.nodeOptions = [{
            label: '全部',
            value: 0,
            id: 0
          }]
        }
        this.mateFilter.node = [0]
        this.getMateList()
      },
      handleSelectionChange (selection) {
        this.colSelect = selection
      },
      handleSizeChange (size) {
        this.pageSize = size
        this.getMateList()
      },
      handleCurrentChange (page) {
        this.curPage = page
        this.getMateList()
      },
      confirmDel () {
        this.$confirm('素材删除后将不可恢复,请谨慎操作!', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMaterial()
        }).catch(() => {})
      },
      confirmCheck () {
        this.$confirm('提交审核后,素材不可再编辑,请谨慎操作!', '提示', {
          confirmButtonText: '确认提交',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCheck()
        }).catch(() => {})
      },
      submitCheck () {
        let ids = []
        this.colSelect.forEach(function (ele) {
          ids.push(ele.id)
        }, this)
        let params = new URLSearchParams()
        params.append('ids', ids.join(','))
        params.append('entryStatus', 2)
        this.axios.patch(API.update_entry_status, params).then((data) => {
          this.$message({
            message: '素材提交审核成功!',
            type: 'success'
          })
          this.colSelect.forEach(function (ele) {
            ele.entryStatus = 2
          }, this)
        }).catch(() => {
          this.$message({
            message: '素材提交审核失败!',
            type: 'error'
          })
        })
      },
      previewEntry (node, entry) {
        let params = {
          nodeId: node.id,
          id: entry.id
        }
        this.axios.get(API.prview_entry, { params }).then((data) => {
          this.view.iframePreviewShow = true
          this.previewUrl = data.url
          this.curPreTmp = entry.title
        }).catch(() => {
          this.$message({
            message: '获取素材预览地址失败!',
            type: 'error'
          })
        })
      },
      showRejectMsg (rejectTxt) {
        this.$msgbox({
          title: '驳回理由',
          message: (
            <div>
              <p class="reject-msg-p"><span class="reject-msg-title">驳回理由</span><span class="reject-msg-text">{rejectTxt || '无'}</span></p>
            </div>
          ),
          confirmButtonText: '知道了'
        }).then(action => {
        })
      },
      addNewMaterial () {
        this.$emit('new-mate')
      },
      editNewMaterial () {
        this.$emit('edit-mate', this.colSelect[0].id)
      },
      newMaterialDetail () {
        this.$emit('show-mate', this.colSelect[0].id)
      },
      deleteMaterial () {
        let ids = this.colSelect.map(function (ele) {
          return ele.id
        }, this)
        ids = ids.join(',')
        let params = {
          ids
        }
        this.axios.delete(API.del_entry, { params }).then(() => {
          this.getMateList()
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
        })
      },
      recycle () {
        this.$emit('go-recycle')
      },
      showRelateColumn () {
        this.curEntryNodes = this.colSelect[0].nodes
        this.view.relateColumnShow = true
      },
      changeSort (id, sortDirection) {
        let params = new URLSearchParams()
        params.append('id', id)
        params.append('sortDirection', sortDirection)
        this.axios.patch(API.change_entry_sort, params).then(() => {
          this.getMateList()
        }).catch(() => {
          this.$message({
            message: '操作失败!',
            type: 'error'
          })
        })
      },
      clearInput () {
        this.mateFilter.key = ''
        this.getMateList()
      }
    },
    created () {
      this.getMateList()
    }
  }
</script>
<style scoped>
  .metarial-list{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .title{
    text-align: right;
    padding-right: 20px;
  }
  .metarial-list-btns{
    margin: 20px 0;
    display: flex;
  }
  .metarial-list-page{
    text-align: right;
    padding-top: 5px;
  }
  .popover-p{
    padding: 4px 0 4px 8px;
  }
  .popover-p:hover{
    background-color: #f5f7fa;
  }
  .relate-column-item{
    font-size: 12px;
    line-height: 14px;
  }
  .relate-column-text{
    display: inline-block;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  /* 图标begin */
  .ipanel-icon-preview{
    vertical-align: middle;
    cursor: pointer;
  }
  /* 图标end */
  .iframe-preview{
    z-index: 9999 !important;
  }
</style>
<style>
  .metarial-list-btns .el-button span{
    display: flex;
    align-items: center;
  }
  .metarial-list-table .el-button span{
    color: #1f2d3d;
    text-decoration: underline;
  }
  .metarial-list-table .el-button:hover span{
    color: #20a0ff;
  }
  .reject-msg-text{
    margin-left: 20px;
    color: #000;
  }
  .reject-msg-p{
    margin: 10px 0;
  }
</style>
