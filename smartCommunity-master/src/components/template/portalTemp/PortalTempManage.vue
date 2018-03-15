<template>
  <div class="portal-temp-manage">
    <el-row type="flex" align="middle">
      <el-col :span="2" class="gray-14">选择区域</el-col>
      <el-col :span="4">
        <area-cascader
          lazy
          :load="loadArea"
          :areas="areas"
          :mulitiple="false"
          :area-props="{label:'name',children:'children',isLeaf: data => data.isLeaf === 1}"
          :default-expanded-keys="initExpand"
          :selected-area="tempFilter.areaId"
          @check-area="changeArea">
        </area-cascader>
      </el-col>
      <el-col :span="2" :offset="1" class="gray-14">终端类型</el-col>
      <el-col :span="4">
        <el-select v-model="tempFilter.terminal" placeholder="请选择终端类型">
          <el-option label="全部" value="-1"></el-option>
          <el-option label="TV端" value="1"></el-option>
          <el-option label="手机端" value="4"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" :offset="1" v-show="tempFilter.terminal==='1'">
        <el-select v-model="tempFilter.subterminal" placeholder="请选择终端类型">
          <el-option label="标清盒子" value="1"></el-option>
          <el-option label="高清盒子" value="2"></el-option>
          <el-option label="4K盒子" value="3"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="portal-temp-list-wp" v-loading="loading">
      <div class="portal-temp-tabs">
        <i-tabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="tabChange"></i-tabs>
      </div>
      <div class="portal-temp-list">
        <!-- 新增模板begin -->
        <div class="portal-temp-new" @click="openPortalTemp(true)" v-if="userRightList.includes('addTemplate')">
          <i class="portal-temp-add-icon"></i>
          <span>新增模板</span>
        </div>
        <!-- 新增模板end -->

        <!-- 模板列表begin -->
        <div v-for="(temp,index) in temps" @click="preview(temp)" class="portal-temp-item" :key="index">
          <img :src="temp.tmplAbbrPath" class="portal-temp-img" :title="temp.tmplName" alt="">
          <div class="portal-temp-item-bottom" @click.stop="">
            <span class="portal-temp-item-title">{{temp.tmplName}}</span>
            <span class="portal-temp-item-del" @click.stop="confirmDelPortalTemp(temp)" v-if="userRightList.includes('delTemplate')" title="删除模板"></span>
            <span class="portal-temp-item-edit" @click.stop="openPortalTemp(false, temp)" v-if="userRightList.includes('editTemplate')" title="编辑模板"></span>
          </div>
        </div>
        <!-- 模板列表end -->
      </div>
    </div>

    <!-- 新建模板begin -->
    <portal-temp-operate
      :areas= "areas"
      :isNew="view.isNew"
      :portalTemp="curPortalTemp"
      :active-tab="activeTab"
      :show.sync="view.portalTemOptShow"
      @update-temp-list="getPortalTemps">
    </portal-temp-operate>
    <!-- 新建模板end -->

    <!-- 模板预览begin -->
    <iframe-preview
      :show.sync="view.imgPreviewShow"
      :url="previewUrl"
      :title="curPreview"></iframe-preview>
    <!-- 模板预览end -->
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import util from './../../../assets/js/util.js'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import PortalTempOperate from './PortalTempOperate.vue'
  import ITabs from './../../common/ITabs.vue'
  import AreaCascader from './../../common/AreaCascader.vue'
  import IframePreview from './../../common/IframePreview.vue'
  export default {
    name: 'portalTempManage',
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
        tempFilter: {
          terminal: '-1',
          subterminal: '2',
          useGrid: '-1',
          areaId: ''
        },
        deviceMap: util.deviceMap,
        temps: [],
        previewUrl: '',
        curPreview: '',
        curPortalTemp: {},
        tabs: [
          {
            id: '-1',
            label: '全部'
          },
          {
            id: '1',
            label: '带网格布局'
          },
          {
            id: '0',
            label: '不带网格布局'
          }
        ],
        activeTab: '-1',
        view: {
          imgPreviewShow: false,
          portalTemOptShow: false,
          isNew: true
        },
        loading: false
      }
    },
    components: {
      IframePreview,
      PortalTempOperate,
      ITabs,
      AreaCascader
    },
    watch: {
      areas: {
        immediate: true,
        handler (areas) {
          if (areas && areas.length > 0) {
            this.tempFilter.areaId = areas[0].id
          }
        }
      },
      tempFilter: {
        immediate: true,
        deep: true,
        handler (tempFilter) {
          if (tempFilter.areaId && tempFilter.useGrid) {
            this.getPortalTemps()
          }
        }
      }
    },
    methods: {
      getPortalTemps () {
        if (this.userRightList.includes('portalList')) {
          let { areaId: groupId, terminal, subterminal, useGrid } = this.tempFilter
          let params = {
            page: 1,
            rows: 999,
            groupId,
            useGrid,
            terminalType: '' + terminal === '1' ? subterminal : terminal
          }
          this.loading = true
          this.axios.get(API.get_portal_temp_list, { params }).then((data) => {
            this.loading = false
            this.temps = data.rows
          }).catch(() => {
            this.loading = false
            this.$message({
              message: '获取模板列表失败!',
              type: 'error'
            })
          })
        }
      },
      tabChange (tab) {
        this.tempFilter.useGrid = tab.id
        this.activeTab = tab.id
      },
      changeArea (areaId) {
        this.tempFilter.areaId = areaId
      },
      preview (temp) {
        let params = {
          id: temp.id
        }
        this.userRightList.includes('delTemplate') && this.axios.get(API.get_portal_temp_preview, { params }).then((data) => {
          this.view.imgPreviewShow = true
          this.curPreview = temp.tmplName
          this.previewUrl = data.msg
        }).catch(() => {
          this.$message({
            message: '获取模板预览地址失败!',
            type: 'error'
          })
        })
      },
      openPortalTemp (isNew, temp) {
        this.view.isNew = isNew
        if (!isNew) {
          this.curPortalTemp = temp
        }
        this.view.portalTemOptShow = true
      },
      confirmDelPortalTemp (temp) {
        this.$confirm('确认删除此模板？删除后无法恢复，请谨慎操作！', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.delPortalTemp(temp).then(() => {
                instance.confirmButtonLoading = false
                done()
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      },
      delPortalTemp (temp) {
        let params = {
          ids: temp.id
        }
        return this.axios.get(API.del_portal_temp, { params }).then(() => {
          this.getPortalTemps()
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        }).catch((error) => {
          console.log(error)
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .portal-temp-list-wp{
    height: 547px;
    padding: 20px;
    box-sizing: border-box;
    border: thin solid #d3dce6;
    margin-top: 13px;
  }
  .portal-temp-tabs{
    height: 40px;
  }
  .portal-temp-list{
    height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .portal-temp-new{
    width: 300px;
    height: 170px;
    float: left;
    cursor: pointer;
    margin: 40px 40px 0 40px;
    box-sizing: border-box;
    border: thin solid #8b919a;
    background-color: #d6dbdf;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .portal-temp-new span{
    font-size: 14px;
    color: #1f2d3d;
  }
  .portal-temp-item{
    float: left;
    position: relative;
    width: 300px;
    height: 170px;
    margin: 40px 40px 0 40px;
    overflow: hidden;
  }
  .portal-temp-item img{
    height: 100%;
  }
  .portal-temp-item-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(0,0,0,.8)
  }
  .portal-temp-item-bottom span{
    line-height: 30px;
  }
  .portal-temp-item-title{
    padding-left: 20px;
    color: #fff;
    font-size: 14px;
  }
  .portal-temp-item-edit{
    display: block;
    float: right;
    margin: 5px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-color: #fff;
    background: url(../../../../static/imgs/icon/sprite.png) -106px -21px no-repeat;
  }
  .portal-temp-item-del{
    float: right;
    display: block;
    margin: 5px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-color: #fff;
    background: url(../../../../static/imgs/icon/sprite.png) 4px -68px no-repeat;
  }
  .portal-temp-add-icon{
    display: block;
    margin-bottom: 20px;
    height: 48px;
    width: 48px;
    background: url(../../../../static/imgs/icon/add.png) no-repeat;
  }
  .portal-temp-item{
    background: url(../../../../static/imgs/icon/default.png) no-repeat;
    background-color: #e0e0e0;
    background-position: center;
  }
</style>
