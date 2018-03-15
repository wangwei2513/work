<template>
  <div class="app-temp-manage">
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
          :selected-area="appFilter.areaId"
          @check-area="changeArea">
        </area-cascader>
      </el-col>
      <el-col :span="2" :offset="1" class="gray-14">终端类型</el-col>
      <el-col :span="4">
        <el-select v-model="appFilter.deviceId" @change="getAppTemps()" placeholder="请选择终端类型">
          <el-option v-for="(value, key) in deviceMap" :label="value" :value="key" :key="key"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="app-temp-list-wp">
      <div class="app-temp-tabs">
        <i-tabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="tabChange"></i-tabs>
      </div>
      <div class="app-temp-list">
        <!-- 新增模板begin -->
        <div v-if="userRightList.includes('addModule')" class="app-temp-new" @click="editAppTemp(true)">
          <i class="app-temp-add-icon"></i>
          <span>新增模板</span>
        </div>
        <!-- 新增模板end -->

        <!-- 模板列表begin -->
        <div v-for="(temp, index) in temps" class="app-temp-item" :key="index" @click="preview(temp)">
          <img :src="'http://' + temp.thumbNailImageUrl" alt="">
          <div class="app-temp-item-bottom" @click="$event.stopPropagation()">
            <span class="app-temp-item-title">{{temp.moduleName}}</span>
            <span v-if="userRightList.includes('deleteModule')" class="app-temp-item-del" @click="confirmDelAppTemp(temp)" title="删除模板"></span>
            <span v-if="userRightList.includes('editModule')" class="app-temp-item-edit" @click="editAppTemp(false, temp)" title="编辑模板"></span>
          </div>
        </div>
        <!-- 模板列表end -->
      </div>
    </div>

    <!-- 新建模板begin -->
    <app-temp-operate
      :areas= "areas"
      :isNew="view.isNew"
      :appTemp="curAppTemp"
      :active-tab="activeTab"
      :show.sync="view.appTemOptShow"
      @update-temp-list="getAppTemps">
    </app-temp-operate>
    <!-- 新建模板end -->

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
  import API from './../../../assets/js/api.js'
  import util from './../../../assets/js/util.js'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import IframePreview from './../../common/IframePreview.vue'
  import AppTempOperate from './AppTempOperate.vue'
  import ITabs from './../../common/ITabs.vue'
  import AreaCascader from './../../common/AreaCascader.vue'
  export default {
    name: 'appTempManage',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      areasNoRoot: {
        type: Array
      },
      userRightList: {
        type: Array
      }
    },
    data () {
      return {
        appFilter: {
          areaId: '',
          deviceId: '1',
          moduleType: '2'
        },
        cascaderProp: {
          value: 'id',
          label: 'label'
        },
        deviceMap: util.deviceMap,
        temps: [],
        previewUrl: '',
        curPreview: '',
        curAppTemp: null,
        tabs: [
          {
            id: '2',
            label: '独立页模板'
          },
          {
            id: '0',
            label: '组合模板'
          },
          {
            id: '3',
            label: '内容页模板'
          }
        ],
        activeTab: '2',
        view: {
          imgPreviewShow: false,
          appTemOptShow: false,
          isNew: true
        }
      }
    },
    watch: {
      areas: {
        immediate: true,
        handler (areas) {
          if (areas && areas.length > 0) {
            this.appFilter.areaId = areas[0].id
          }
        }
      },
      appFilter: {
        immediate: true,
        deep: true,
        handler (appFilter) {
          if (appFilter.areaId) {
            this.getAppTemps()
          }
        }
      }
    },
    components: {
      IframePreview,
      AppTempOperate,
      ITabs,
      AreaCascader
    },
    methods: {
      getAppTemps () {
        const self = this
        let { areaId, deviceId, moduleType } = this.appFilter
        var params = {
          page: 1,
          size: 999,
          areaId,
          moduleType,
          deviceId
        }
        this.axios.get(API.get_temp_list, { params }).then(function (data) {
          self.temps = data.rows
        })
      },
      getPreviewUrl (temp) {
        let params = {
          id: temp.id
        }
        return this.axios.get(API.get_temp_preview_url, { params }).then((data) => {
          this.previewUrl = data.url
        }).catch(() => {
          this.$message({
            message: '获取模板预览地址失败!',
            type: 'error'
          })
        })
      },
      changeArea (areaId) {
        this.appFilter.areaId = areaId
      },
      preview (temp) {
        if (this.userRightList.includes('previewModule')) {
          this.curPreview = temp.moduleName
          this.getPreviewUrl(temp).then(() => {
            this.view.imgPreviewShow = true
          })
        }
      },
      editAppTemp (isNew, temp) {
        this.view.isNew = isNew
        if (!isNew) {
          temp.areaIds = temp.areaId
          this.curAppTemp = temp
        }
        this.view.appTemOptShow = true
      },
      confirmDelAppTemp (temp) {
        this.$confirm('确认删除此模板？删除后无法恢复，请谨慎操作！', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.delAppTemp(temp).then(() => {
                instance.confirmButtonLoading = false
                done()
              })
            } else {
              done()
            }
          }
        }).catch(() => {})
      },
      delAppTemp (temp) {
        let params = {
          ids: temp.id
        }
        return this.axios.delete(API.del_temp, { params }).then(() => {
          this.getAppTemps()
          this.$message({
            message: '删除应用模板成功',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '删除应用模板失败!',
            type: 'error'
          })
        })
      },
      tabChange (tab) {
        this.appFilter.moduleType = tab.id
        this.activeTab = tab.id
        this.getAppTemps()
      }
    }
  }
</script>
<style scoped>
  .app-temp-list-wp{
    height: 547px;
    padding: 20px;
    box-sizing: border-box;
    border: thin solid #d3dce6;
    margin-top: 13px;
  }
  .app-temp-tabs{
    height: 40px;
  }
  .app-temp-list{
    height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .app-temp-new{
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
  .app-temp-new span{
    font-size: 14px;
    color: #1f2d3d;
  }
  .app-temp-item{
    float: left;
    position: relative;
    width: 300px;
    height: 170px;
    margin: 40px 40px 0 40px;
    overflow: hidden;
    background-color: #cdcdcd;
  }
  .app-temp-item img{
    height: 170px;
    width: 300px;
    display: block;
  }
  .app-temp-item-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(0,0,0,.8)
  }
  .app-temp-item-bottom span{
    line-height: 30px;
  }
  .app-temp-item-title{
    padding-left: 20px;
    color: #fff;
    font-size: 14px;
  }
  .app-temp-item-edit{
    display: block;
    float: right;
    margin: 5px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-color: #fff;
    background: url(../../../../static/imgs/icon/sprite.png) -106px -21px no-repeat;
  }
  .app-temp-item-del{
    float: right;
    display: block;
    margin: 5px;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-color: #fff;
    background: url(../../../../static/imgs/icon/sprite.png) 4px -68px no-repeat;
  }
  .app-temp-add-icon{
    display: block;
    margin-bottom: 20px;
    height: 48px;
    width: 48px;
    background: url(../../../../static/imgs/icon/add.png) no-repeat;
  }
</style>
