<template>
  <div class="portal-list">
    <el-row type="flex" align="middle">
      <el-col :span="1" class="gray-14 title">区域</el-col>
      <el-col :span="3">
        <area-cascader
          lazy
          :load="loadArea"
          :areas="areas"
          :mulitiple="false"
          :area-props="{label:'name',children:'children'}"
          :default-expanded-keys="initExpand"
          :selected-area="filterData.areaId"
          @check-area="areaFilterChange">
        </area-cascader>
      </el-col>
      <!-- <el-col :span="2" class="gray-14 title">终端类型</el-col>
      <el-col :span="3">
        <el-select
          v-model="filterData.terminal"
          placeholder="请选择终端类型">
          <el-option label="全部" value="-1"></el-option>
          <el-option v-for="(val, key) in terminalMap" :label="val" :value="key" :key="key"></el-option>
        </el-select>
      </el-col> -->
      <el-col :span="4" :offset="16">
        <el-input
          :value="filterData.portalName"
          @change="val=>filterData.portalName=val"
          prefix-icon="el-icon-search"
          placeholder="请输入Portal名关键字">
          <i slot="suffix" @click="filterData.portalName = ''" v-show="filterData.portalName" class="el-input__icon el-icon-circle-close"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="portal-list-btns">
      <el-button type="primary" @click="previewPortal" v-if="userRightList.includes('prePortal')" :disabled="!colSelect" class="top-operate"><i class="ipanel-icon2 ipanel-icon-detail"></i>预览</el-button>
      <el-button type="primary" @click="confirmPassPortal" v-if="userRightList.includes('passPortal')" :disabled="!colSelect" class="top-operate"><i class="ipanel-icon2 ipanel-icon-pass"></i>通过</el-button>
      <el-button type="primary" @click="comfirmRejcetPortal" v-if="userRightList.includes('upPassPortal')" :disabled="!colSelect" class="top-operate"><i class="ipanel-icon2 ipanel-icon-reject"></i>驳回</el-button>
    </div>
    <div class="portal-list-table">
      <el-table
        :data="portalList"
        :height="490"
        border
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          width="55">
          <template slot-scope="scope">
            <el-radio v-model="colSelect" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          label="Portal名称"
          prop="portalName"
          width="220">
        </el-table-column>
        <el-table-column
          label="终端类型"
          width="160">
          <template slot-scope="scope">
            {{terminalMap['' + scope.row.terminaType]}}
          </template>
        </el-table-column>
        <el-table-column
          label="Portal属性"
          width="160">
          <template slot-scope="scope">
            {{portalPro['' + scope.row.portalProperty]}}
          </template>
        </el-table-column>
        <el-table-column
          label="发布状态"
          width="160">
          <template slot-scope="scope">
            {{portalStaMap['' + scope.row.status]}}
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
    </div>
    <div class="portal-list-page">
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
        :title="curPreview">
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
    name: 'portalCheck',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      userRightList: Array
    },
    data () {
      return {
        portalList: [],
        filterData: {
          areaId: '',
          portalName: '',
          terminal: '-1',
          prop: '',
          status: ''
        },
        cancelFn: {
          list: null
        },
        curPortal: null,
        curPage: 1,
        total: 0,
        pageSize: 20,
        colSelect: '',
        previewUrl: '',
        curPreview: '',
        terminalMap: util.terminalMap,
        portalPro: util.portalProMap,
        portalStaMap: util.portalStatusMap,
        cascaderProp: {
          value: 'id',
          label: 'label'
        },
        view: {
          iframePreviewShow: false
        },
        loading: false
      }
    },
    watch: {
      colSelect (id) {
        this.portalList.some(function (val) {
          if (val.id === id) {
            this.curPortal = val
            return true
          }
        }, this)
      },
      areas: {
        immediate: true,
        handler (areas) {
          if (areas && areas.length > 0) {
            this.filterData.areaId = areas[0].id
          }
        }
      },
      filterData: {
        deep: true,
        immediate: true,
        handler (filterData) {
          if (filterData.areaId) {
            this.getPortalList()
          }
        }
      }
    },
    components: {
      AreaCascader,
      IframePreview
    },
    methods: {
      getPortalList () {
        if (this.userRightList.includes('examPortalList')) {
          let params = {
            page: this.curPage,
            rows: this.pageSize
          }
          this.filterData.portalName && (params.portalName = this.filterData.portalName)
          this.filterData.areaId && (params.groupId = this.filterData.areaId)
          this.loading = true
  
          typeof this.cancelFn.list === 'function' && this.cancelFn.list()
          var CancelToken = this.CancelToken
  
          this.axios.get(API.get_check_portal_list, { params,
            cancelToken: new CancelToken((c) => {
              this.cancelFn.list = c
            })
          }).then((data) => {
            this.portalList = data.rows
            this.total = data.total
            this.loading = false
          }).catch((error) => {
            if (error.code !== 6000) {
              this.loading = false
              this.$message({
                message: '获取Portal列表失败!',
                type: 'error'
              })
            }
          })
        }
      },
      previewPortal (node, entry) {
        let params = {
          id: this.curPortal.id,
          groupId: this.filterData.areaId
        }
        this.axios.get(API.get_portal_preview, { params }).then((data) => {
          this.view.iframePreviewShow = true
          this.curPreview = this.curPortal.portalName
          this.previewUrl = data.msg
        }).catch(() => {
          this.$message({
            message: '获取预览地址失败!',
            type: 'error'
          })
        })
      },
      areaFilterChange (val) {
        this.filterData.areaId = val
      },
      handleSelectionChange (selection) {
        this.colSelect = selection
      },
      handleSizeChange (size) {
        this.pageSize = size
        this.getPortalList()
      },
      handleCurrentChange (page) {
        this.curPage = page
        this.getPortalList()
      },
      confirmPassPortal () {
        this.$confirm('确认通过该Portal?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.passPortal().then(() => {
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
      passPortal () {
        let params = {
          id: this.curPortal.id,
          groupId: this.filterData.areaId
        }
        return this.axios.get(API.pass_portal_check, { params }).then(() => {
          this.getPortalList()
          this.$message({
            message: '通过Portal成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '通过Portal失败!',
            type: 'error'
          })
        })
      },
      comfirmRejcetPortal () {
        var self = this
        this.$prompt('请填写驳回理由', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              self.rejectPortal(instance.inputValue).then(() => {
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
      rejectPortal (message) {
        let params = new URLSearchParams()
        params.append('id', this.curPortal.id)
        params.append('groupId', this.filterData.areaId)
        params.append('message', message)
        
        return this.axios.post(API.reject_portal_check, params).then(() => {
          this.getPortalList()
          this.$message({
            message: '驳回Portal成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '驳回Portal失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .portal-list{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .title{
    text-align: right;
    padding-right: 20px;
  }
  .portal-list-btns{
    margin: 10px 0;
    display: flex;
  }
  .portal-list-page{
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
  .portal-list-table{
    position: relative;
  }
  .portal-list-btns .el-button span{
    display: flex;
    align-items: center;
  }
  .portal-list-table .el-button span{
    color: #1f2d3d;
    text-decoration: underline;
  }
  .portal-list-table .el-button:hover span{
    color: #20a0ff;
  }
  .reject-msg-text{
    margin-left: 20px;
    color: #000;
  }
  .reject-msg-p{
    margin: 10px 0;
  }
  .portal-list .filter-trigger-wp{
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
  .portal-list .el-icon-arrow-down{
    transition: all 0.3s;
  }
  .portal-list .el-icon-arrow-down.show{
    transform: rotate(180deg);
  }
</style>
