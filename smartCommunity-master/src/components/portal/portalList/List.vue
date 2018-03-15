<template>
  <div class="portal-list">
    <!-- portal列表操作按钮begin -->
    <div class="portal-list-tool">
      <el-button type="primary" @click="toggleNewPortal(true)" v-if="userRightList.includes('addPortal')" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-new"></i>新建</el-button>
      <el-button type="primary" @click="newEdit" v-if="userRightList.includes('editPortal')" :disabled="!editable.edit" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
      <el-button type="primary" @click="preview" v-if="userRightList.includes('prePortal')" :disabled="!curPortal" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-preview1"></i>预览</el-button>
      <el-button type="primary" @click="confirmCheckPortal" v-if="userRightList.includes('pubExam')" :disabled="!editable.check" size="small" class="top-operate"><i class="ipanel-icon2 ipanel-icon-audit"></i>提交审核</el-button>
      <el-button type="primary" @click="versionCtr" v-if="userRightList.includes('pubVersion')" :disabled="!editable.release" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-publish"></i>发布</el-button>
      <el-button type="primary" @click="view.handColumnShow = true" v-if="userRightList.includes('authPortal')" v-show="rootAreaId === filterData.areaId" :disabled="!curPortal" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-send"></i>下发</el-button>
      <el-button type="primary" @click="toggleDelPortal" v-if="userRightList.includes('delPortal')" :disabled="!curPortal || curPortal && curPortal.status === 4" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
      <!-- <el-button type="primary" @click="versionCtr" :disabled="!editable.version" size="small" class="top-operate"><i class="iconfont icon-banben"></i>版本管理</el-button> -->
      <div class="search">
        <el-input
        prefix-icon="el-icon-search"
        placeholder="请输入Portal名相关字"
        @change="val => {filterData.portalName = val}"
        :value="filterData.portalName">
        <i slot="suffix" @click="filterData.portalName = ''" v-show="filterData.portalName" class="el-input__icon el-icon-circle-close"></i>
        </el-input>
      </div>
    </div>
    <!-- portal列表操作按钮end -->

    <!--portal列表begin  -->
    <div class="portal-list-main">
      <el-tree
        lazy
        ref="portalListAreaTree"
        node-key="id"
        highlight-current
        :data="areas"
        :indent="8"
        :load="loadArea"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExKeys"
        :props="{label: 'name',children: 'children',isLeaf: data => data.isLeaf === 1}"
        @current-change="areaChange"></el-tree>
      <div class="portal-lit-table">
        <el-table
          :data="portal"
          :height="547"
          border
          highlight-current-row
          v-loading="view.loading"
          @current-change="changeCurrent"
          style="width: 100%">
          <el-table-column
            label="Portal名称"
            prop="portalName"
            width="220">
          </el-table-column>
          <el-table-column
            label="终端类型"
            :render-header="renderTerminalHeader"
            width="160">
            <template slot-scope="scope">
              {{terminalMap['' + scope.row.terminaType]}}
            </template>
          </el-table-column>
          <el-table-column
            label="Portal属性"
            :render-header="renderPropHeader"
            width="160">
            <template slot-scope="scope">
              {{portalPro['' + scope.row.portalProperty]}}
            </template>
          </el-table-column>
          <el-table-column
            label="Portal状态"
            :render-header="renderStatusHeader"
            width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.status !== 1">{{portalStaMap['' + scope.row.status]}}</div>
              <el-button v-else type="text" @click="showRejectMsg(scope.row.reviewMsg)">已驳回</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="180">
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <i v-if="scope.row.status === 4" class="iconfont icon-zhifeiji" title="已发布"></i>
            </template>
          </el-table-column>
        </el-table>
        <transition  name="el-zoom-in-top">
          <div class="terminal-filter portal-list-filter" v-show="view.terminalFilterShow">
            <ul class="filter-container">
              <li class="main-filter" :class="{'is-current': filterData.terminal == ''}" @click="filter({text: 'terminal', value: ''})">全部</li>
              <li class="main-filter" :class="{'is-current': ['1', '2', '3'].includes(filterData.terminal)}">TV端
                <ul class="sub-filter-container">
                  <li class="sub-filter" :class="{'is-current': filterData.terminal == '1'}" @click="filter({text: 'terminal', value: '1'})">标清盒子</li>
                  <li class="sub-filter" :class="{'is-current': filterData.terminal == '2'}" @click="filter({text: 'terminal', value: '2'})">高清盒子</li>
                  <li class="sub-filter" :class="{'is-current': filterData.terminal == '3'}" @click="filter({text: 'terminal', value: '3'})">4K盒子</li>
                </ul>
              </li>
              <li class="main-filter" :class="{'is-current': filterData.terminal == '4'}" @click="filter({text: 'terminal', value: '4'})">手机端</li>
            </ul>
          </div>
        </transition>
        <transition  name="el-zoom-in-top">
          <div class="prop-filter portal-list-filter" v-show="view.protalPropFilterShow">
            <ul class="filter-container">
              <li class="main-filter" :class="{'is-current': filterData.prop == ''}" @click="filter({'text': 'prop', 'value': ''})">全部</li>
              <li class="main-filter" :class="{'is-current': filterData.prop == key}" v-for="(value, key) in portalPro" v-if="key != -1" @click="filter({'text': 'prop', 'value': key})" :key="key">{{value}}</li>
            </ul>
          </div>
        </transition>
        <transition name="el-zoom-in-top">
          <div class="status-filter portal-list-filter" v-show="view.protalStatusFilterShow">
            <ul class="filter-container">
              <li class="main-filter" :class="{'is-current': filterData.status == ''}" @click="filter({text: 'status', value: ''})">全部</li>
              <li class="main-filter"
                v-for="(val, key) in portalStaMap"
                :key="key"
                :class="{'is-current': filterData.status == key}"
                @click="filter({text: 'status', value: key})">
                {{val}}
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <!-- portal列表end -->

    <!--portal列表分页begin -->
    <div class="portal-list-pagination">
      <el-pagination
        :current-page="curPage"
        :page-sizes="[20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="currentPageChange"
        @size-change="sizeChange">
      </el-pagination>
    </div>
    <!-- portal列表分页end -->

    <!-- 新建portal组件begin -->
    <new-portal 
      :show.sync="view.newPortalShow"
      :isNew="view.isNew" 
      :rootAreaId="rootAreaId"
      @upload-portal-list="getPortalList">
    </new-portal>
    <!-- 新建portal组件end -->

    <!-- 删除portal组件begin -->
    <del-portal
      :show.sync="view.delPortalShow"
      :portal="curPortal"
      @upload-portal-list="getPortalList">
    </del-portal>
    <!-- 删除portal组件end -->

    <!-- 下发栏目begin -->
    <hand-column
      :show.sync="view.handColumnShow"
      :portal="curPortal"
      :areas="areas">
    </hand-column>
    <!-- 下发栏目end -->

    <!-- 版本管理begin -->
    <portal-version
      :portal="curPortal"
      :servers="servers"
      :show.sync="view.portalVersionShow">
    </portal-version>
    <!-- 版本管理end -->

    <!-- 模板预览begin -->
    <iframe-preview
      :show.sync="view.imgPreviewShow"
      :url="previewUrl"
      :title="curPreview">
    </iframe-preview>
    <!-- 模板预览end -->
  </div>
</template>
<script>
  import API from '../../../assets/js/api.js'
  import util from '../../../assets/js/util.js'
  import loadAreaMixin from '../../../assets/js/loadAreaMixin.js'
  import DelPortal from './DelPortal.vue'
  import NewPortal from './NewPortal.vue'
  import HandColumn from './HandColumn.vue'
  import PortalVersion from './PortalVersion.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'portalList',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      servers: Array,
      userRightList: Array
    },
    data () {
      return {
        // portal列表
        portal: [],
        portalCopy: [],
        // 当前的分页页码
        curPage: 1,
        // 分页总页数
        pageSize: 20,
        total: 0,
        handArea: '',
        terminalMap: util.terminalMap,
        portalPro: util.portalProMap,
        portalStaMap: util.portalStatusMap,
        curPortal: null,
        previewUrl: '',
        curPreview: '',
        filterData: {
          areaId: '',
          portalName: '',
          terminal: '',
          prop: '',
          status: ''
        },
        // 视图相关
        view: {
          protalPropFilterShow: false, // portal属性过滤器是否显示
          terminalFilterShow: false, // 终端类型过滤器是否显示,
          protalStatusFilterShow: false,
          newPortalShow: false, // 新建portal是否显示,
          portalVersionShow: false,
          isNew: true,
          delPortalShow: false,
          handColumnShow: false,
          loading: false,
          imgPreviewShow: false
        },
        cancelFn: {
          list: null
        },
        // el-tree的属性映射
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    components: {
      NewPortal,
      DelPortal,
      HandColumn,
      PortalVersion,
      IframePreview
    },
    watch: {
      areas: {
        immediate: true,
        handler (areas) {
          if (areas && areas.length > 0) {
            this.filterData.areaId = areas[0].id
            this.$nextTick(() => {
              this.$refs.portalListAreaTree.setCurrentKey(areas[0].id)
            })
          }
        }
      },
      filterData: {
        immediate: true,
        deep: true,
        handler (filter) {
          if (filter.areaId) {
            this.getPortalList()
          }
        }
      }
    },
    computed: {
      defaultExKeys () {
        let keys = []
        if (this.areas.length > 0) {
          keys.push(this.areas[0].id)
        }
        return keys
      },
      rootAreaId () {
        let rootAreaId = ''
        if (this.areas && this.areas.length > 0) {
          rootAreaId = this.areas[0].id
        }
        return rootAreaId
      },
      editable () {
        var editable = {
          check: true,
          release: true,
          version: true,
          edit: true
        }
        let curSelect = this.curPortal
        if (!curSelect) {
          editable = {
            check: false,
            release: false,
            version: false,
            edit: false
          }
        } else {
          if (!['0', '1', '5'].includes(curSelect.status + '')) {
            editable.check = false
          }
          if (curSelect.status + '' === '2') {
            editable.edit = false
          }
        }
        return editable
      }
    },
    methods: {
      /**
      *获取并更新portal列表
      */
      getPortalList (id) {
        if (this.userRightList.includes('portalList')) {
          let { portalName, areaId, terminal, prop, status } = this.filterData
          let params = {
            page: this.curPage,
            rows: this.pageSize,
            terminaType: terminal || -1,
            portalProperty: prop || -1,
            status: status || -1
          }
          portalName && (params.portalName = portalName)
          areaId && (params.groupId = areaId)
          
          this.view.loading = true
  
          typeof this.cancelFn.list === 'function' && this.cancelFn.list()
          var CancelToken = this.CancelToken
  
          this.axios.get(API.get_portal_list, { params,
            cancelToken: new CancelToken((c) => {
              this.cancelFn.list = c
            })
          }).then((data) => {
            this.portalCopy = this.portal = data.rows
            this.total = data.total
            this.view.loading = false
            if (id) {
              this.curPortal = {
                id,
                groupId: this.filterData.areaId
              }
              this.newEdit()
            }
          }).catch((error) => {
            if (error.code !== 6000) {
              this.view.loading = false
              this.$message({
                message: '获取Portal列表失败!',
                type: 'error'
              })
            }
          })
        }
      },
      changeCurrent (cur) {
        this.curPortal = cur
      },
      newEdit () {
        this.curPortal.groupId = this.filterData.areaId
        this.$emit('newEdit', this.curPortal)
      },
      /**
      *根据条件筛选展示表格数据
      *@param {object} f 筛选条件对象
      */
      filter (f) {
        this.filterData[f.text] = f.value
        if (this.view.protalPropFilterShow) this.togglePropFilterShow()
        if (this.view.terminalFilterShow) this.toggleTerminalFilterShow()
        if (this.view.protalStatusFilterShow) this.toggleStatusFilterShow()
      },
      /**
      *触发树节点选择的事件
      *@param {object} data 节点的数据对象
      *@param {vnode} node 节点的VNode对象
      */
      areaChange (data, node) {
        this.filterData.areaId = data.id
      },
      /**
      *自定义“终端类型”的表头
      */
      renderTerminalHeader (h, e) {
        const self = this
        return h('div', {
          'class': 'filter-trigger-wp',
          on: {
            click () {
              self.toggleTerminalFilterShow()
            }
          }
        }, [
          h('span', null, e.column.label),
          h('i', {
            'class': 'ipanel-terminal-icon el-icon-arrow-down'
          })
        ])
      },
      /**
      *自定义“portal属性”的表头
      */
      renderPropHeader (h, e) {
        const self = this
        return h('div', {
          'class': 'filter-trigger-wp',
          on: {
            click () {
              self.togglePropFilterShow()
            }
          }
        }, [
          h('span', null, e.column.label),
          h('i', {
            'class': 'ipanel-prop-icon el-icon-arrow-down'
          })
        ])
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
      confirmCheckPortal () {
        this.$confirm('确认将该Portal提交审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.checkPortal().then(() => {
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
      checkPortal () {
        let params = {
          id: this.curPortal.id,
          groupId: this.filterData.areaId
        }
        return this.axios.get(API.check_portal, { params }).then(() => {
          this.getPortalList()
          this.$message({
            message: 'Portal提交审核成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: 'Portal提交审核失败!',
            type: 'error'
          })
        })
      },
      showPublish () {
        this.view.publishShow = true
      },
      preview () {
        let params = {
          id: this.curPortal.id,
          groupId: this.filterData.areaId
        }
        this.axios.get(API.get_portal_preview, { params }).then((data) => {
          this.view.imgPreviewShow = true
          this.curPreview = this.curPortal.portalName
          this.previewUrl = data.msg
        }).catch(() => {
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      },
      versionCtr () {
        this.view.portalVersionShow = true
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
      /**
      *反转“终端类型”筛选选项的状态
      */
      toggleTerminalFilterShow () {
        this.view.terminalFilterShow = !this.view.terminalFilterShow
        $('.ipanel-terminal-icon').toggleClass('show')
      },
      /**
      *反转“portal属性”筛选选项的状态
      */
      togglePropFilterShow () {
        this.view.protalPropFilterShow = !this.view.protalPropFilterShow
        $('.ipanel-prop-icon').toggleClass('show')
      },
      toggleStatusFilterShow () {
        this.view.protalStatusFilterShow = !this.view.protalStatusFilterShow
        $('.ipanel-status-icon').toggleClass('show')
      },
      /**
      *反转“新建portal”表单的状态
      */
      toggleNewPortal (isNew) {
        this.view.isNew = isNew
        this.view.newPortalShow = !this.view.newPortalShow
      },
      toggleDelPortal () {
        this.view.delPortalShow = !this.view.delPortalShow
      },
      currentPageChange (page) {
        this.curPage = page
        this.getPortalList()
      },
      sizeChange (size) {
        this.pageSize = size
        this.getPortalList()
      }
    },
    beforeRouteLeave (to, from, next) {
      for (var key in this.cancelFn) {
        if (this.cancelFn.hasOwnProperty(key)) {
          typeof this.cancelFn[key] === 'function' && this.cancelFn[key].call(null, from.path)
        }
      }
      next()
    },
    mounted () {
      var self = this
      /* 绑定终端类型,发布状态过滤器的隐藏事件 */
      $(document).off('.hideFilter').on('click.hideFilter', function (e) {
        e.stopPropagation()
        let $parents = $(e.target).parents('.portal-list-filter')
        if ($parents.length === 0) {
          if (!$(e.target).is('.ipanel-terminal-icon,.ipanel-prop-icon,.ipanel-status-icon')) {
            self.view.terminalFilterShow = false
            self.view.protalPropFilterShow = false
            self.view.protalStatusFilterShow = false
            $('.ipanel-terminal-icon').removeClass('show')
            $('.ipanel-prop-icon').removeClass('show')
            $('.ipanel-status-icon').removeClass('show')
          }
        }
      })
    }
  }
</script>
<style scoped>
  .portal-lit-table{
    position: relative;
  }
  .terminal-th:hover .terminal-filter{
    display: block;
  }
  .terminal-filter{
    position: absolute;
    top: 41px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 290px;
  }
  .prop-th:hover .prop-filter{
    display: block;
  }
  .prop-filter{
    position: absolute;
    top: 41px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 450px;
  }
  .portal-list-filter li{
    width: 100%;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .status-filter{
    position: absolute;
    top: 41px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 610px;
  }
  .main-filter{
    width: 60px;
    position: relative;
  }
  .filter-container li:hover{
    background-color: #d3dce6;
  }
  .filter-container>li:hover>.sub-filter-container{
    display: block;
  }
  .filter-container>li.is-current>.sub-filter-container{
    display: block;
  }
  .sub-filter-container{
    position: absolute;
    display: none;
    border: thin solid #ccc;
    left: 80px;
    width: 80px;
    top: 0;
    background-color: #fff;
  }
  .portal-list-main{
    height: 547px;
    margin-top: 12px;
    margin-bottom: 10px
  }
  .portal-list-main .el-tree{
    width: 120px;
    height: 100%;
    box-sizing: border-box;
    float: left;
    overflow: auto;
  }
  .el-tree-node__label {
    font-size: 14px;
    text-overflow: ellipsis;
    width: 60px;
    overflow: hidden;
  }
  .portal-list-tool{
    position: relative;
  }
  .portal-list-tool .search{
    width: 200px;
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .portal-lit-table{
    float: left;
    margin: 0 10px;
    box-sizing: border-box;
    width: calc(100% - 144px);
    height: 100%;
    overflow: hidden;
  }
  .portal-list-pagination{
    text-align: right;
    margin-bottom: 26px;
  }
  .new-portal-close{
    width: 18px;
    height: 18px;
    position: absolute;
    top: 16px;
    right: 16px;
    background: url(../../../assets/imgs/icon/sprite.png) no-repeat;
    background-position-x: 3px;
    background-position-y: -69px;
    transition: all .5s;
  }
  .new-portal-close:hover{
    cursor: pointer;
    transform: rotate(180deg);
  }
  .cover{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
    z-index: 10;
  }
  .sub-filter{
    color: #000;
  }
  .main-filter.is-current, .sub-filter.is-current{
    background-color: #20a0ff;
    color: #fff;
  }
  .main-filter.is-current:hover, .sub-filter.is-current:hover{
    background-color: #1c8de0;
  }
  .el-button.is-disabled .icon-banben{
    color: #7b828c;
  }
  .icon-banben{
    font-size: 18px;
    margin-top: 2px;
  }
</style>
<style>
  .portal-list-tool{
    display: flex;
  }
  .portal-list-tool .el-button{
    padding: 8px 20px;
  }
  .portal-list-tool .el-button span{
    display: flex;
    align-items: center;
  }
  .portal-list .el-tree-node.is-current>.el-tree-node__content{
    background-color: #d3dce6 !important;
  }
  .portal-lit-table .el-table{
    border-color: #d1dbe5;
  }
  .ipanel-prop-icon,.ipanel-terminal-icon{
    display: inline-block;
    margin-left: 3px;
    cursor: pointer;
    vertical-align: middle;
  }
  .portal-list-main .el-icon-arrow-down{
    transition: all 0.3s;
  }
  .portal-list-main .el-icon-arrow-down.show{
    transform: rotate(180deg);
  }
  .icon-zhifeiji{
    color: #20a0ff;
  }
  .portal-list .el-form{
    padding-left: 20px;
  }
  .portal-list .el-form-item {
    margin-bottom: 10px !important;
  }
  .portal-list .el-form-item .el-select{
    width: 100%;
  }
  .portal-list .filter-trigger-wp{
    cursor: pointer;
    line-height: 23px !important;
  }
  .portal-list .el-table th>.cell{
    height: 23px;
  }
  .portal-lit-table .el-button span{
    color: #1f2d3d;
    text-decoration: underline;
  }
  .portal-lit-table .el-button:hover span{
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
