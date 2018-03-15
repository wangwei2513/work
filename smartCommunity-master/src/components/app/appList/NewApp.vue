<template>
  <div class="new-app" v-show="show">
    <div class="popup-box">
      <h2 class="popup-header">{{isNew?'新建应用':'修改应用'}}</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="new-app-content">
        <el-form ref="newApp" label-position="left" :model="newAppSubmit" label-width="120px">
          <el-form-item label="关联终端" :required="true">
            <el-col :span="16" v-if="isNew">
              <el-select v-model="newApp.deviceIds" placeholder="请选择终端类型">
                <el-option v-for="(val, key) in deviceMap" :label="val" :value="key" :key="key"></el-option>
              </el-select>
            </el-col>
            <el-col :span="16" v-else>
              {{deviceMap[newApp.deviceIds]}}
            </el-col>
          </el-form-item>
          <el-form-item label="所属区域" :required="true">
            <el-col :span="16">
              <area-cascader
                lazy
                :value="newApp.areaIds"
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :area-props="{label:'name',children:'children'}"
                :default-expanded-keys="initExpand"
                :selected-area="newApp.areaIds"
                @check-area="checkArea">
              </area-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label="应用名称" :required="true">
            <el-col :span="16">
              <count-input
                v-model="newApp.appName"
                :total="15"
                placeholder="请输入应用名称"></count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="应用路径" :required="true" v-if="isNew">
            <el-col :span="16" v-if="inputMode === 'auto'">
              <span v-show="!newApp.appEnName" class="placeholder">请输入应用名称!</span>
              <word-to-pinyin
                key="appEnName"
                :value="newApp.appName"
                :traVal.sync="newApp.appEnName"
                spliter=""></word-to-pinyin>
            </el-col>
            <el-col :span="6" :offset="1" v-if="inputMode === 'auto'">
              <el-button @click="inputMode = 'custom'">手动输入</el-button>
            </el-col>
            <el-col :span="16" v-if="inputMode === 'custom'">
              <count-input
                v-model="newApp.appEnName"
                :total="20"
                regType="w"
                :showCounter="false"
                placeholder="请输入应用路径">
              </count-input>
            </el-col>
            <el-col :span="6" :offset="1" v-if="inputMode === 'custom'">
              <el-button @click="inputMode = 'auto'">自动获取</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="应用路径" :required="true" v-else>
            <el-col :span="16">
              {{newApp.appEnName}}
            </el-col>
          </el-form-item>
          <el-form-item label="关联服务器">
            <el-col :span="16">
              <el-select
                v-model="newApp.serverIds"
                multiple placeholder="请选择服务器"
                no-data-text="所选区域没有关联任何服务器"
                :disabled="newApp.areaIds === ''">
                <el-option
                  v-for="server in serversCopy"
                  :key="server.id"
                  :label="server.serverName"
                  :value="server.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btns">
        <el-col :span="4" :offset="6">
          <el-button @click="submit(false)" :loading="submiting" type="primary" :disabled="!newAppIsValid">仅保存</el-button>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button @click="submit(true)" type="primary" :disabled="!newAppIsValid">保存并进入编辑</el-button>
        </el-col>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import util from './../../../assets/js/util'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import WordToPinyin from './../../common/CC2P'
  import CountInput from './../../common/CountInput.vue'
  import AreaCascader from './../../common/AreaCascader.vue'
  export default {
    name: 'newApp',
    mixins: [loadAreaMixin],
    props: {
      areas: Array,
      app: Object,
      isNew: Boolean,
      show: Boolean,
      servers: Array
    },
    data () {
      return {
        newApp: {
          deviceIds: '1',
          areaIds: '',
          appName: '',
          appEnName: '',
          serverIds: []
        },
        newAppSubmit: {},
        serversCopy: [],
        deviceMap: util.deviceMap,
        submiting: false,
        inputMode: 'auto',
        cascaderProp: {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      }
    },
    components: {
      WordToPinyin,
      CountInput,
      AreaCascader
    },
    watch: {
      servers: {
        immediate: true,
        handler (newVal) {
          this.serversCopy = newVal
        }
      },
      show (show) {
        if (show) {
          if (this.isNew) {
            this.newApp = {
              deviceIds: '1',
              areaIds: '',
              appName: '',
              appEnName: '',
              serverIds: []
            }
          } else {
            let curApp = {}
            Object.assign(curApp, this.app)
            curApp.areaIds = this.app.areaId
            curApp.serverIds = []
            if (Array.isArray(this.app.servers)) {
              curApp.serverIds = this.app.servers.map(function (server) {
                return server.id
              }, this)
            }
            this.newApp = curApp
          }
        }
      }
    },
    computed: {
      newAppIsValid () {
        const setting = this.newApp
        return !!(setting.deviceIds && setting.areaIds && setting.appName)
      },
      initExpand () {
        var expand = []
        if (this.areas.length > 0) {
          expand.push(this.areas[0].id)
        }
        return expand
      }
    },
    methods: {
      submit (goEdit) {
        this.submiting = true
        var name = {
          id: this.newApp.id,
          appName: this.newApp.appName
        }
        var enName = {
          id: this.newApp.id,
          appEnName: this.newApp.appEnName
        }
        this.axios.get(API.check_app_exist, { params: name }).then(() => {
          return true
        }).catch((data) => {
          this.submiting = false
          this.$message({
            message: data.code === '201' ? '应用名称已存在!' : '应用名验重失败!',
            type: 'error'
          })
          return false
        }).then((valid) => {
          valid && this.axios.get(API.check_app_exist, { params: enName }).then(() => {
            this.isNew ? this.addApp(goEdit) : this.editApp(goEdit)
          }).catch((data) => {
            this.submiting = false
            this.$message({
              message: data.code === '201' ? '应用路径名已存在!' : '应用路径名验重失败!',
              type: 'error'
            })
          })
        })
      },
      checkArea (areaIds) {
        this.newApp.areaIds = areaIds
        this.newApp.serverIds = []
        this.serverInArea(areaIds)
      },
      serverInArea (areaId) {
        this.serversCopy = this.servers.filter((server) => {
          return '' + server.areaId === '' + areaId
        })
      },
      addApp (goEdit) {
        let { deviceIds, areaIds, appName, appEnName, serverIds } = this.newApp
        let params = {
          appEnName,
          appName,
          areaIds,
          deviceIds,
          locationUrl: appEnName,
          serverIds: serverIds.join(',')
        }
        this.axios.post(API.add_app, params).then((resData) => {
          this.submiting = false
          this.$emit('update-app-list', goEdit ? resData.appId : '')
          this.close()
          this.$message({
            message: '新建应用成功!',
            type: 'success'
          })
        }).catch((error) => {
          console.log(error)
          this.submiting = false
          this.$message({
            message: '新建应用失败!',
            type: 'error'
          })
        })
      },
      editApp (goEdit) {
        let { deviceIds, areaIds, appName, appEnName, serverIds, id } = this.newApp
        let params = {
          appEnName,
          appName,
          areaIds,
          deviceIds,
          id,
          locationUrl: appEnName,
          serverIds: serverIds.join(',')
        }
        this.axios.put(API.edit_app, params).then(() => {
          this.submiting = false
          this.$emit('update-app-list', goEdit ? id : '')
          this.close()
          this.$message({
            message: '修改应用成功!',
            type: 'success'
          })
        }).catch((error) => {
          console.log(error)
          this.submiting = false
          this.$message({
            message: '修改应用失败!',
            type: 'error'
          })
        })
      },
      close () {
        this.inputMode = 'auto'
        this.$emit('update:show', false)
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 600px;
    height: 480px;
    left: calc(50% - 300px);
    top: calc(50% - 240px);
  }
  .new-app-content{
    height: 340px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-radio{
    margin: 5px 0;
  }
  .el-form-item{
    margin-bottom: 20px !important;
  }
</style>
