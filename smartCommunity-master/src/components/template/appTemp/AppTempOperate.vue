<template>
  <div class="app-temp-operate" v-show="show">
    <div class="popup-box">
      <h2 class="popup-header">{{isNew?'添加App模板':'修改App模板'}}</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="app-temp-opt-content">
        <el-form ref="newAppTemp" label-position="left" :model="newAppTemp" label-width="120px">
          <el-form-item label="模板类型">
            <el-row  v-if="isNew">
              <el-col :span="24">
                <el-radio-group v-model="newAppTemp.moduleType">
                  <el-radio v-for="(val,key) in moduleTypeMap" :label="key" :key="key">{{val}}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row  v-if="isNew && newAppTemp.moduleType == 0">
              <el-col :span="24">
                <el-radio-group v-model="newAppTemp.mutiModuleType">
                  <el-radio v-for="(val,key) in mutiModuleTypeMap" :label="key" :key="key">{{val}}</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-col :span="24" v-if="!isNew">{{totalModuleTypeMap[newAppTemp.moduleType]}}</el-col>
          </el-form-item>
          <el-form-item label="模板名称" style="margin-bottom: 18px;">
            <el-col :span="17">
              <count-input
                v-model="newAppTemp.moduleName"
                :total="15"
                placeholder="请输入模板名称">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="终端类型">
            <el-col :span="17" v-if="isNew">
              <el-select v-model="newAppTemp.deviceId" placeholder="请选择终端类型">
                <el-option v-for="(val, key) in deviceMap" :key="key" :label="val" :value="key"></el-option>
              </el-select>
            </el-col>
            <el-col :span="17" v-else>{{deviceMap['' + newAppTemp.deviceId]}}</el-col>
          </el-form-item>
          <el-form-item :label="isNew?'上传模板':'更换模板'">
            <el-upload
              :file-list="newAppTemp.files"
              :on-change="handleChange"
              :auto-upload="false"
              action="">
              <el-button type="primary">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">
                <span class="download-example">格式请参考范例模板<a href="#" @click.prevent="">下载范例</a></span>
              </div>
            </el-upload>
            <!-- <i-upload
              @change="changeFile">
            </i-upload> -->
          </el-form-item>
          <el-form-item label="关联区域">
            <el-col :span="17" v-show="!isNew && !isSelect">{{newAppTemp.areaName||'无'}}</el-col>
            <el-col :span="7" v-show="!isNew && !isSelect"><el-button @click="reselectArea" size="small">重新选择</el-button></el-col>
            <el-col :span="17" v-show="isNew || isSelect">
              <area-cascader
                lazy
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :area-props="{label:'name',children:'children',isLeaf: data => data.isLeaf === 1}"
                :default-expanded-keys="initExpand"
                :selected-area="newAppTemp.areaIds"
                @check-area="checkArea">
              </area-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label="关联父模板" v-if="isNew && newAppTemp.mutiModuleType == 5">
            <el-col :span="24">
              <el-button @click="selectParentTemp" :disabled="!newAppTemp.areaIds" plain>选择父模板</el-button>
              <span class="app-temp-parent-name">{{newAppTemp.parentName||'未选择模板'}}</span>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btns">
        <el-col :span="4" :offset="7">
          <el-button type="primary" :disabled="!newAppTempIsValid" @click="submitEdit" :loading="submiting">提交</el-button>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button @click="close">取消</el-button>
        </el-col>
      </div>
    </div>
    <select-temp
      :show.sync="selectTempShow"
      title="选择父模板"
      :data="parentTemps"
      :tempId="newAppTemp.parentId"
      :tempName="newAppTemp.parentName"
      @finish-select-temp="finishSelectTemp"></select-temp>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import CountInput from './../../common/CountInput'
  import AreaCascader from './../../common/AreaCascader.vue'
  import IUpload from './../../common/IUpload'
  import SelectTemp from './SelectTemp.vue'
  import util from './../../../assets/js/util'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import API from './../../../assets/js/api'
  export default {
    name: 'appTempOperate',
    mixins: [loadAreaMixin],
    props: {
      areas: Array,
      isNew: Boolean,
      appTemp: {
        type: Object
      },
      show: Boolean,
      activeTab: [String, Number]
    },
    data () {
      return {
        newAppTemp: {
          moduleName: '',
          deviceId: '1',
          moduleType: this.activeTab,
          mutiModuleType: '1',
          areaIds: '',
          parentId: '',
          parentName: '',
          files: []
        },
        parentTemps: [],
        fileLen: 0,
        isSelect: false,
        deviceMap: util.deviceMap,
        moduleTypeMap: util.moduleTypeMap,
        mutiModuleTypeMap: util.mutiModuleTypeMap,
        totalModuleTypeMap: util.totalModuleTypeMap,
        submiting: false,
        selectTempShow: false
      }
    },
    computed: {
      newAppTempIsValid () {
        let setting = this.newAppTemp
        let valid = true
        if (this.isNew) {
          valid = !!(setting.deviceId && setting.areaIds !== '' && setting.moduleName !== '' && this.fileLen > 0)
          if (setting.mutiModuleType === '5' && !setting.parentId) {
            valid = false
          }
        } else {
          valid = !!(setting.areaIds !== '' && setting.moduleName !== '')
        }
        return valid
      }
    },
    components: {
      CountInput,
      IUpload,
      AreaCascader,
      SelectTemp
    },
    watch: {
      show (show) {
        if (show) {
          if (!this.isNew) {
            Object.assign(this.newAppTemp, this.appTemp)
          }
        } else {
          this.initForm()
        }
      },
      activeTab (activeTab) {
        if (this.isNew) {
          this.newAppTemp.moduleType = activeTab
        }
      }
    },
    methods: {
      getParentTemps () {
        var params = {
          page: 1,
          size: 999,
          areaId: this.newAppTemp.areaIds,
          moduleType: '4'
        }
        this.axios.get(API.get_temp_list, { params }).then((data) => {
          this.parentTemps = data.rows
        })
      },
      changeFile (fileList) {
        this.fileLen = fileList.length
        this.newAppTemp.files = fileList
      },
      handleChange (file, fileList) {
        this.fileLen = fileList.length
        if (fileList.length > 1) {
          fileList.shift()
        }
        this.newAppTemp.files = fileList
      },
      checkArea (areaIds) {
        this.newAppTemp.areaIds = areaIds
      },
      reselectArea () {
        this.isSelect = true
        this.newAppTemp.areaIds = ''
      },
      selectParentTemp () {
        this.selectTempShow = true
        this.getParentTemps()
      },
      finishSelectTemp (temp) {
        this.newAppTemp.parentId = temp.id
        this.newAppTemp.parentName = temp.name
      },
      submitEdit () {
        var self = this
        this.submiting = true
        let { moduleName, id } = this.newAppTemp
        var params = {
          moduleName,
          id
        }
        this.axios.get(API.check_temp_exist, { params }).then(function () {
          self.isNew ? self.requestNewTemp() : self.requestEditTemp()
        }).catch(function (error) {
          console.log(error)
          self.submiting = false
          self.$message({
            message: error.code === '201' ? '模板名已存在!' : '模板名查重失败!',
            type: 'error'
          })
        })
      },
      requestNewTemp () {
        var self = this
        var data = new FormData()
        let { files, moduleName, deviceId, moduleType, mutiModuleType, areaIds, parentId } = this.newAppTemp
        let blob = new Blob([files[0].raw], {type: 'application/x-zip-compressed'})
        data.append('moduleZipFile', blob, files[0].name)
        data.append('moduleName', moduleName)
        data.append('deviceId', deviceId)

        if ('' + moduleType === '0') {
          /* 选择模板类型为组合模板时,moduleType由mutiModuleType决定 */
          data.append('moduleType', mutiModuleType)
          if ('' + mutiModuleType === '5') {
            /* 当选择子模板类型时需要关联父模板 */
            data.append('parentId', parentId)
          }
        } else {
          data.append('moduleType', moduleType)
        }
        
        data.append('areaIds', areaIds)
        this.axios.post(API.add_temp, data).then(function () {
          self.close()
          self.submiting = false
          self.$emit('update-temp-list')
          self.$message({
            message: '添加模板成功!',
            type: 'success'
          })
        }).catch(function () {
          self.submiting = false
          self.$message({
            message: '添加模板失败!',
            type: 'error'
          })
        })
      },
      requestEditTemp () {
        var self = this
        var data = new FormData()
        let { files, moduleName, deviceId, moduleType, areaIds, id } = this.newAppTemp
        if (files.length > 0) {
          let blob = new Blob([files[0].raw], {type: 'application/x-zip-compressed'})
          data.append('moduleZipFile', blob, files[0].name)
        }
        data.append('moduleName', moduleName)
        data.append('deviceId', deviceId)
        data.append('id', id)
        data.append('moduleType', moduleType)
        data.append('areaIds', areaIds)
        this.axios.put(API.edit_temp, data).then(function () {
          self.close()
          self.submiting = false
          self.$emit('update-temp-list')
          self.$message({
            message: '编辑模板成功!',
            type: 'success'
          })
        }).catch(function () {
          self.submiting = false
          self.$message({
            message: '编辑模板失败!',
            type: 'error'
          })
        })
      },
      close () {
        this.$emit('update:show', false)
        if (this.isNew) {
          this.initForm()
        }
      },
      initForm () {
        this.newAppTemp = {
          moduleName: '',
          deviceId: '1',
          moduleType: this.activeTab,
          mutiModuleType: '1',
          areaIds: '',
          parentId: '',
          parentName: '',
          files: []
        }
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 600px;
    height: 500px;
    left: calc(50% - 300px);
    top: calc(50% - 250px);
  }
  .app-temp-opt-content{
    height: 380px;
    padding: 20px 40px 0 40px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .app-temp-operate h2{
    font-size: 14px;
    color: #1f2d3d;
    font-weight: bold;
    margin-bottom: 25px;
  }
  .app-temp-opt-btns{
    width: 100%;
    padding: 5px;
    height: 36px;
  }
  .download-example{
    display: block;
    clear: both;
    color: #F64747;
    font-size: 12px;
  }
  .download-example a{
    color: #1F2D3D;
  }
  .app-temp-parent-name{
    color: #1F2D3D;
    font-size: 12px;
    margin-left: 10px;
    max-width: 120px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style>
  .app-temp-operate .el-form-item {
    margin-bottom: 10px;
  }
</style>