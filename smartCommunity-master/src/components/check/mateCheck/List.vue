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
      <el-col :span="2" class="gray-14 title">终端类型</el-col>
      <el-col :span="3">
        <el-select
          :disabled="mateFilter.areaId === ''"
          v-model="mateFilter.deviceId"
          @change="deviceChange"
          placeholder="请选择终端类型">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="(val, key) in deviceMap" :label="val" :value="key" :key="key"></el-option>
        </el-select>
      </el-col>
      <el-col :span="2" class="gray-14 title">关联应用</el-col>
      <el-col :span="3">
        <el-cascader
          :disabled="mateFilter.deviceId == 0"
          :props="{ label: 'appName', value: 'id' }"
          :options="appOptions"
          v-model="mateFilter.app"
          :show-all-levels="false"
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
      <el-button type="primary" @click="showDetail" v-if="userRightList.includes('getEntryDetail')" :disabled="colSelect.length !== 1" class="top-operate"><i class="ipanel-icon2 ipanel-icon-detail"></i>查看</el-button>
      <el-button type="primary" @click="$emit('pass',colSelect)" v-if="userRightList.includes('updateEntryStatus')" :disabled="colSelect.length === 0" class="top-operate"><i class="ipanel-icon2 ipanel-icon-pass"></i>通过</el-button>
      <el-button type="primary" @click="$emit('reject',colSelect)" v-if="userRightList.includes('updateEntryStatus')" :disabled="colSelect.length === 0" class="top-operate"><i class="ipanel-icon2 ipanel-icon-reject"></i>驳回</el-button>
    </div>
    <div class="metarial-list-table">
      <el-table
        ref="metarialTable"
        :data="mateList"
        :height="490"
        v-loading="loading"
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
          :render-header="renderStatusHeader"
          label="状态"
          width="120">
          <template slot-scope="scope">
            <div>{{entryStatusMap[scope.row.entryStatus]}}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="关联栏目"
          width="300">
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
          prop="author"
          label="添加人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="submitTime"
          label="提交时间">
        </el-table-column>
      </el-table>
      <transition name="el-zoom-in-top">
        <div class="status-filter entry-list-filter" v-show="view.entryStatusFilterShow">
          <ul class="filter-container">
            <li class="main-filter" :class="{'is-current': mateFilter.status == ''}" @click="changeStatus('')">全部</li>
            <li class="main-filter" :class="{'is-current': mateFilter.status == '2'}" @click="changeStatus('2')">待审核</li>
            <li class="main-filter" :class="{'is-current': mateFilter.status == '3'}" @click="changeStatus('3')">已通过</li>
          </ul>
        </div>
      </transition>
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
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import AreaCascader from './../../common/AreaCascader.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'mateCheckList',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      updateList: {
        type: Boolean
      },
      userRightList: Array
    },
    data () {
      return {
        mateList: [],
        mateFilter: {
          app: [0],
          key: '',
          areaId: '',
          node: [0],
          deviceId: 0,
          status: ''
        },
        curPage: 1,
        total: 0,
        pageSize: 20,
        colSelect: [],
        previewUrl: '',
        curPreTmp: '',
        appOptions: [{
          appName: '全部',
          value: 0,
          id: 0
        }],
        nodeOptions: [{
          title: '全部',
          value: 0,
          id: 0
        }],
        deviceMap: util.deviceMap,
        entryStatusMap: util.entryStatusMap,
        cascaderProp: {
          value: 'id',
          label: 'label'
        },
        view: {
          entryStatusFilterShow: false,
          iframePreviewShow: false
        },
        loading: false
      }
    },
    watch: {
      updateList: {
        immediate: true,
        handler (updateList) {
          this.$emit('update:updateList', false)
          updateList && this.getMateList()
        }
      }
    },
    components: {
      AreaCascader,
      IframePreview
    },
    methods: {
      getMateList () {
        let size = this.pageSize
        let page = this.curPage
        let { app, areaId, node, deviceId, key, status } = this.mateFilter
        let filters = { appId: app, deviceId, nodeId: node, title: key, areaId }
        var params = {
          size,
          page
        }

        if (status) {
          params.entryStatus = status
        } else {
          params.showType = 0
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
        
        this.loading = true
        this.axios.get(API.get_entry_list, { params }).then((data) => {
          this.loading = false
          this.total = data.total
          this.mateList = data.rows
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '获取素材审核列表失败!',
            type: 'error'
          })
        })
      },
      getAppList (deviceId) {
        if (this.userRightList.includes('listApps')) {
          let params = {
            page: 1,
            size: 999
          }
          if ('' + deviceId !== '0') {
            params.deviceId = deviceId
            this.axios.get(API.get_app_list, { params }).then((data) => {
              data.rows.forEach(function (row) {
                row.label = row.appName
              }, this)
              this.appOptions = [{
                appName: '全部',
                value: 0,
                id: 0
              }].concat(data.rows)
            })
          }
        }
      },
      renderStatusHeader (h, data) {
        const self = this
        return h('div', {
          'class': 'filter-trigger-wp',
          on: {
            click () {
              self.toggleStatusFilterShow()
            }
          }
        }, [
          h('span', null, data.column.label),
          h('i', {
            'class': 'ipanel-status-icon el-icon-arrow-down'
          })
        ])
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
      areaFilterChange (val) {
        this.mateFilter.app = [0]
        this.mateFilter.node = [0]
        this.mateFilter.deviceId = 0
        this.mateFilter.areaId = val
        this.getMateList()
      },
      deviceChange (val) {
        if (val === 0) {
          this.mateFilter.app = [0]
          this.mateFilter.node = [0]
        } else {
          this.getAppList(val)
        }
        this.getMateList()
      },
      appFilterChange (val) {
        let params = {
          page: 1,
          size: 999
        }
        let appId = val[0]
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
            title: '全部',
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
      showDetail () {
        this.$emit('show-detail', this.colSelect[0])
      },
      changeStatus (val) {
        this.mateFilter.status = val
        this.getMateList()
        this.toggleStatusFilterShow()
      },
      toggleStatusFilterShow () {
        this.view.entryStatusFilterShow = !this.view.entryStatusFilterShow
        $('.ipanel-status-icon').toggleClass('show')
      },
      clearInput () {
        this.mateFilter.key = ''
        this.getMateList()
      }
    },
    mounted () {
      this.getMateList()
    },
    activated () {
      if (this.updateList) {
        this.getMateList()
        this.$emit('update:updateList', false)
      }
      var self = this
      /* 绑定终端类型,发布状态过滤器的隐藏事件 */
      $(document).off('.hideFilter').on('click.hideFilter', function (e) {
        e.stopPropagation()
        let $parents = $(e.target).parents('.entry-list-filter')
        if ($parents.length === 0) {
          if (!$(e.target).is('.ipanel-status-icon')) {
            self.view.entryStatusFilterShow = false
            $('.ipanel-status-icon').removeClass('show')
          }
        }
      })
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
    margin: 10px 0;
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
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }
  .status-filter{
    position: absolute;
    top: 41px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 285px;
  }
  .status-filter li{
    width: 100%;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .main-filter.is-current{
    background-color: #20a0ff;
    color: #fff;
  }
  .main-filter.is-current:hover{
    background-color: #1c8de0;
  }
  .iframe-preview{
    z-index: 9999 !important;
  }
</style>
<style>
  .metarial-list-table{
    position: relative;
  }
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
  .metarial-list .filter-trigger-wp{
    line-height: 23px;
    display: inline;
    width: 100%;
    cursor: pointer;
  }
  .ipanel-status-icon{
    display: inline-block;
    margin-left: 3px;
    cursor: pointer;
    vertical-align: middle;
  }
  .metarial-list .el-icon-arrow-down{
    transition: all 0.3s;
  }
  .metarial-list .el-icon-arrow-down.show{
    transform: rotate(180deg);
  }
</style>
