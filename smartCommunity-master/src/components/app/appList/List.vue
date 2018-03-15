<template>
  <div class="app-list">
    <!-- app列表操作按钮begin -->
    <div class="app-list-tool">
      <el-button type="primary" @click="showNewApp(true)" v-if="userRightList.includes('addApp')" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-new"></i>新建</el-button>
      <el-button type="primary" @click="showNewApp(false)" :disabled="!curSelect" v-if="userRightList.includes('editApp')" size="small" class="top-operate"><i class="iconfont icon-gengxin"></i>修改</el-button>
      <el-button type="primary" @click="newEdit" :disabled="!curSelect" v-if="userRightList.includes('editApp')" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
      <el-button type="primary" @click="downloadApp" :disabled="!curSelect|| curSelect.publishStatus !== 2" v-if="userRightList.includes('downloadApp')" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-edit"></i>下载</el-button>
      <el-button type="primary" @click="selectPreviewServer" v-if="userRightList.includes('previewApp')" :disabled="!curSelect || curSelect.publishStatus !== 2" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-preview1"></i>预览</el-button>
      <el-button type="primary" @click="confirmReleaseApp" v-if="userRightList.includes('publishApp')" :disabled="!curSelect" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-publish"></i>发布</el-button>
      <el-button type="primary" @click="linkServers" v-if="userRightList.includes('assignAppToServers')" :disabled="!curSelect" size="small" class="top-operate"><i class="ipanel-icon2 ipanel-icon-link"></i>关联服务器</el-button>
      <el-button type="primary" @click="toggleDelApp" v-if="userRightList.includes('deleteApp')" :disabled="!curSelect" size="small" class="top-operate"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
      <el-button type="primary" @click="versionCtr" v-if="userRightList.includes('listHisVersions')" :disabled="!curSelect || curSelect.publishStatus !== 2" size="small" class="top-operate"><i class="iconfont icon-banben"></i>版本管理</el-button>
      <div class="search">
        <el-input
          v-if="userRightList.includes('listApps')"
          placeholder="请输入应用名相关字"
          prefix-icon="el-icon-search"
          @change="val => {filterData.appName = val}"
          :value="filterData.appName">
          <i slot="suffix" @click="filterData.appName = ''" v-show="filterData.appName !== ''" class="el-input__icon el-icon-circle-close"></i>
        </el-input>
      </div>
    </div>
    <!-- app列表操作按钮end -->

    <!-- app列表begin -->
    <div class="app-list-main">
      <!-- 区域树begin -->
      <el-tree
        node-key="id"
        highlight-current
        lazy
        ref="applistAreaTree"
        :data="areas"
        :indent="8"
        :load="loadArea"
        :props="{label: 'name', children: 'children', isLeaf (data) {return data.isLeaf === 1}}"
        :expand-on-click-node="false"
        :default-expanded-keys="initExpand"
        @current-change="areaChange">
      </el-tree>
      <!-- 区域树end -->
      <div class="app-lit-table">
        <el-table
          @current-change="currentChange"
          :data="appList"
          :height="547"
          highlight-current-row
          border
          v-loading="view.loading"
          style="width: 100%">
          <el-table-column
            label="应用名称"
            prop="appName"
            width="220">
          </el-table-column>
          <el-table-column
            label="终端类型"
            :render-header="renderTerminalHeader"
            width="160">
             <template slot-scope="scope">
              {{deviceMap[scope.row.deviceIds]}}
            </template>
          </el-table-column>
          <el-table-column
            label="发布状态"
            :render-header="renderStatusHeader"
            width="160">
            <template slot-scope="scope">
              {{appStatusMap[scope.row.publishStatus]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="创建时间">
          </el-table-column>
        </el-table>
        <transition name="el-zoom-in-top">
          <div class="terminal-filter app-list-filter" v-show="view.terminalFilterShow">
            <ul class="filter-container">
              <li class="main-filter" :class="{'is-current': filterData.deviceId == ''}" @click="filter({filterName: 'deviceId', value: ''})">全部</li>
              <li class="main-filter"
                v-for="(val, key) in deviceMap"
                :class="{'is-current': filterData.deviceId == key}"
                :key="key"
                 @click="filter({filterName: 'deviceId', value: key})">
                 {{val}}
              </li>
            </ul>
          </div>
        </transition>
        <transition name="el-zoom-in-top">
          <div class="status-filter app-list-filter" v-show="view.appStatusFilterShow">
            <ul class="filter-container">
              <li class="main-filter" :class="{'is-current': filterData.publishStatus == ''}" @click="filter({filterName: 'publishStatus', value: ''})">全部</li>
              <li class="main-filter"
                v-for="(val, key) in appStatusMap"
                :class="{'is-current': filterData.publishStatus == key}"
                @click="filter({filterName: 'publishStatus', value: key})"
                :key="key">
                {{val}}
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <!--app列表end  -->

    <!-- 用来实现无刷新下载 -->
    <iframe id="framFile" name="framFile" style="display:none;"></iframe>

    <!--app列表分页begin  -->
    <div class="app-list-pagination">
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
    <!--app列表分页end  -->

    <!--新建app组件begin  -->
    <new-app
      :show.sync="view.newAppShow"
      :isNew="view.isNew" 
      :areas="areas"
      :servers="servers"
      :app="curSelect"
      @update-app-list="getAppList">
    </new-app>
    <!--新建app组件end  -->

    <!-- 删除app组件begin -->
    <del-app
      :show.sync="view.delAppShow"
      :app="curSelect"
      @update-app-list="getAppList">
    </del-app>
    <!-- 删除app组件end -->

    <!-- 关联服务器组件begin -->
    <link-servers
      :show.sync="view.linkServersShow"
      :app="curSelect"
      :servers="servers"
      @update-app-list="getAppList">
    </link-servers>
    <!-- 关联服务器组件end -->

    <!-- 应用版本管理begin -->
    <app-version
      :show.sync="view.versionCtrShow"
      :app="curSelect">
    </app-version>
    <!-- 应用版本管理end -->

    <!-- 预览服务器选择begin -->
    <select-publish-server
      @preview-app="previewApp"
      :show.sync="view.SelectPublishServerShow"
      :app="curSelect"></select-publish-server>
    <!-- 预览服务器选择end -->

    <!-- 模板预览begin -->
    <iframe-preview
      :show.sync="view.iframePreviewShow"
      :url="previewUrl"
      :title="curPreview">
    </iframe-preview>
    <!-- 模板预览end -->

  </div>
</template>
<script>
  import API from '../../../assets/js/api.js'
  import util from './../../../assets/js/util'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import DelApp from './DelApp.vue'
  import NewApp from './NewApp.vue'
  import LinkServers from './LinkServers.vue'
  import AppVersion from './AppVersion.vue'
  import SelectPublishServer from './SelectPublishServer.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'appList',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array
      },
      servers: {
        type: Array
      },
      userRightList: {
        type: Array
      }
    },
    data () {
      return {
        // app列表
        appList: [],
        // 当前的分页页码
        curPage: 1,
        // 分页总页数
        total: 0,
        pageSize: 20,
        handArea: '',
        filterData: {
          areaId: '',
          deviceId: '',
          publishStatus: '',
          appName: ''
        },
        // 当前选中的app对象
        curApp: {
          terminal: '',
          area: '',
          appName: '',
          type: '',
          name: ''
        },
        previewUrl: '',
        curPreview: '',
        curSelect: null,
        deviceMap: util.deviceMap,
        appStatusMap: util.appStatusMap,
        // 视图相关
        view: {
          appStatusFilterShow: false, // 发布状态过滤器是否显示
          terminalFilterShow: false, // 终端类型过滤器是否显示
          newAppShow: false, // 新建app是否显示
          isNew: true, // 是新建还是复制
          delAppShow: false, // 删除app是否显示
          loading: false, // 表格是否在加载中
          linkServersShow: false, // 关联服务器组件是否显示,
          versionCtrShow: false,
          SelectPublishServerShow: false,
          iframePreviewShow: false
        },
        // el-tree的属性映射
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    components: {
      NewApp,
      DelApp,
      AppVersion,
      LinkServers,
      IframePreview,
      SelectPublishServer
    },
    watch: {
      areas: {
        immediate: true,
        handler () {
          if (this.areas && this.areas.length > 0) {
            let topArea = this.areas[0]
            this.filterData.areaId = topArea.id
            this.$nextTick(() => {
              this.$refs.applistAreaTree.setCurrentKey(topArea.id)
            })
          }
        }
      },
      filterData: {
        immediate: true,
        deep: true,
        handler (filterData) {
          if (filterData.areaId !== '') {
            this.getAppList()
          }
        }
      }
    },
    computed: {
      initExpand () {
        var expand = []
        if (this.areas.length > 0) {
          expand.push(this.areas[0].id)
        }
        return expand
      }
    },
    methods: {
      /**
      *获取并更新app列表
      */
      getAppList (appId) {
        let {areaId, deviceId, publishStatus, appName} = this.filterData
        var params = {
          size: this.pageSize,
          page: this.curPage,
          areaId
        }
        deviceId && (params.deviceId = deviceId)
        publishStatus && (params.publishStatus = publishStatus)
        appName && (params.appName = appName)

        this.view.loading = true
        this.axios.get(API.get_app_list, { params }).then((data) => {
          this.appList = data.rows
          this.total = data.total
          this.view.loading = false
          appId && this.$emit('new-edit', { id: appId })
        }).catch((error) => {
          console.log(error)
          this.view.loading = false
          this.$message({
            message: '获取应用列表失败!',
            type: 'error'
          })
        })
      },
      /**
       * 新开一个编辑页
       */
      newEdit () {
        this.$emit('new-edit', this.curSelect)
      },
      /**
      *根据条件筛选展示表格数据
      *@param {object} f 筛选条件对象
      */
      filter (f) {
        this.filterData[f.filterName] = f.value
        if (this.view.appStatusFilterShow) this.toggleStatusFilterShow()
        if (this.view.terminalFilterShow) this.toggleTerminalFilterShow()
      },
      /**
      *触发树节点选择的事件
      *@param {object} data 节点的数据对象
      *@param {vnode} node 节点的VNode对象
      */
      areaChange (data, node) {
        this.filterData.areaId = data.id
      },
      updateAppInfo (id, changes) {
        this.appList.some(function (app, i) {
          if (app.id === id) {
            app[changes.field] = changes.value
            return true
          }
        }, this)
      },
      currentPageChange (page) {
        this.curPage = page
        this.getAppList()
      },
      sizeChange (size) {
        this.pageSize = size
        this.getAppList()
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
      *自定义“app属性”的表头
      */
      renderStatusHeader (h, e) {
        const self = this
        return h('div', {
          'class': 'filter-trigger-wp',
          on: {
            click () {
              self.toggleStatusFilterShow()
            }
          }
        }, [
          h('span', null, e.column.label),
          h('i', {
            'class': 'ipanel-status-icon el-icon-arrow-down'
          })
        ])
      },
      confirmReleaseApp () {
        let cur = this.curSelect
        let text = '是否' + (cur.publishStatus === 2 ? '更新' : '发布') + '应用：' + cur.appName + '？'
        if (Array.isArray(cur.servers) && cur.servers.length > 0) {
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                this.releaseApp(cur.id, cur.appName).then(() => {
                  instance.confirmButtonLoading = false
                  done()
                })
              } else {
                instance.confirmButtonLoading = false
                done()
              }
            }
          }).catch(() => {})
        } else {
          this.$alert('该应用没有关联任何服务器,请先至少关联一个服务器!', '提示', {
            confirmButtonText: '知道了'
          })
        }
      },
      releaseApp (id, appName) {
        let params = new URLSearchParams()
        params.append('ids', id)
        return this.axios.patch(API.publish_app, params, {
          timeout: 1000000
        }).then(() => {
          this.updateAppInfo(id, {
            field: 'publishStatus',
            value: 2
          })
          this.$message({
            message: '应用：' + appName + ' 发布成功!',
            type: 'success'
          })
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '应用：' + appName + '  发布失败!',
            type: 'error'
          })
        })
      },
      linkServers () {
        this.view.linkServersShow = true
      },
      currentChange (cur) {
        this.curSelect = cur
      },
      selectPreviewServer () {
        this.view.SelectPublishServerShow = true
      },
      previewApp (name, url) {
        this.curPreview = name
        this.previewUrl = url
        this.view.iframePreviewShow = true
      },
      downloadApp () {
        var form = $('<form>')
        var input = $('<input>')
        form.attr('style', 'display:none')
        form.attr('target', 'framFile')
        form.attr('method', 'get')
        form.attr('action', API.download_app)
        input.attr('name', 'id')
        input.attr('value', this.curSelect.id)
        form.append(input)
        $(this.$el).append(form)
        form.submit()
      },
      versionCtr () {
        this.view.versionCtrShow = true
      },
      /**
      *反转“终端类型”筛选选项的状态
      */
      toggleTerminalFilterShow () {
        this.view.terminalFilterShow = !this.view.terminalFilterShow
        $('.ipanel-terminal-icon').toggleClass('show')
      },
      /**
      *反转“app属性”筛选选项的状态
      */
      toggleStatusFilterShow () {
        this.view.appStatusFilterShow = !this.view.appStatusFilterShow
        $('.ipanel-status-icon').toggleClass('show')
      },
      /**
      *反转“新建app”表单的状态
      */
      showNewApp (isNew) {
        this.view.isNew = isNew
        this.view.newAppShow = true
      },
      toggleDelApp () {
        this.view.delAppShow = !this.view.delAppShow
      },
      toggleHandApp () {
        this.view.handAppShow = !this.view.handAppShow
      },
      toggleHandColumn () {
        this.view.handColumnShow = !this.view.handColumnShow
      }
    },
    mounted () {
      var self = this
      /* 绑定终端类型,发布状态过滤器的隐藏事件 */
      $(document).off('.hideFilter').on('click.hideFilter', function (e) {
        e.stopPropagation()
        let $parents = $(e.target).parents('.app-list-filter')
        if ($parents.length === 0) {
          if (!$(e.target).is('.ipanel-terminal-icon,.ipanel-status-icon')) {
            self.view.terminalFilterShow = false
            self.view.appStatusFilterShow = false
            $('.ipanel-terminal-icon').removeClass('show')
            $('.ipanel-status-icon').removeClass('show')
          }
        }
      })
    }
  }
</script>
<style scoped>
  .app-lit-table{
    position: relative;
  }
  .terminal-th:hover .terminal-filter{
    display: block;
  }
  .terminal-filter{
    position: absolute;
    top: 40px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 290px;
  }
  .terminal-filter li{
    width: 100%;
    height: 30px;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .status-th:hover .status-filter{
    display: block;
  }
  .status-filter{
    position: absolute;
    top: 40px;
    border: thin solid #ccc;
    border-top: none;
    background: #fff;
    width: 80px;
    left: 450px;
  }
  .status-filter li, .terminal-filter li{
    width: 100%;
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
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
  .sub-filter-container{
    position: absolute;
    display: none;
    border: thin solid #ccc;
    left: 80px;
    width: 80px;
    top: 0;
    background-color: #fff;
  }
  .app-list-main{
    height: 547px;
    margin-top: 12px;
    margin-bottom: 10px
  }
  .app-list-main .el-tree{
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
  .app-list-tool{
    position: relative;
  }
  .app-list-tool .search{
    width: 200px;
    display: inline-block;
    position: absolute;
    right: 0;
  }
  .app-lit-table{
    float: left;
    margin: 0 10px;
    width: calc(100% - 144px);
    height: 100%;
    overflow: hidden;
  }
  .app-list-pagination{
    text-align: right;
    margin-bottom: 26px;
  }
  .new-app-close{
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
  .new-app-close:hover{
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
  .main-filter.is-current{
    background-color: #20a0ff;
    color: #fff;
  }
  .main-filter.is-current:hover{
    background-color: #1c8de0;
  }
  .el-button.is-disabled .icon-banben{
    color: #7b828c;
  }
  .icon-banben{
    font-size: 18px;
    margin-top: 2px;
    margin-right: 10px;
  }
  .el-button.is-disabled .icon-gengxin{
    color: #7b828c;
  }
  .icon-gengxin{
    font-size: 17px;
    margin-right: 10px;
  }
</style>
<style>
  .app-list-tool{
    display: flex;
  }
  .app-list-tool .el-button{
    padding: 8px 20px;
  }
  .app-list-tool .el-button span{
    display: flex;
    align-items: center;
  }
  .app-list .el-tree-node.is-current>.el-tree-node__content{
    background-color: #d3dce6 !important;
  }
  .app-lit-table .el-table{
    border-color: #d1dbe5;
  }
  .ipanel-status-icon,.ipanel-terminal-icon{
    display: inline-block;
    margin-left: 3px;
    cursor: pointer;
    vertical-align: middle;
  }
  .app-list-main .el-icon-arrow-down{
    transition: all 0.3s;
  }
  .app-list-main .el-icon-arrow-down.show{
    transform: rotate(180deg);
  }
  .icon-zhifeiji{
    color: #20a0ff;
  }
  .el-table th>.cell{
    height: 23px;
  }
  .app-list .filter-trigger-wp{
    line-height: 23px;
    cursor: pointer;
  }
  .app-list .el-form{
    padding-left: 20px;
  }
  .app-list .el-form-item {
    margin-bottom: 10px !important;
  }
  .app-list .el-form-item .el-select{
    width: 100%;
  }
</style>
