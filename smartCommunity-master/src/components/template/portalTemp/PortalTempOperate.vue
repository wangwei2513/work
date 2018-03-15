<template>
  <div class="portal-temp-operate" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">{{isNew?'添加Portal模板':'修改Portal模板'}}</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="portal-temp-opt-content">
        <el-form ref="newPortalTemp" label-position="left" :model="newPortalTemp" label-width="80px">
          <el-form-item label="模板名称" required >
            <el-col :span="17">
              <count-input
                v-model="newPortalTemp.tmplName"
                :total="15"
                placeholder="请输入模板名称">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="终端类型" required >
            <el-col :span="8" v-if="!isNew">{{terminalMap[''+ newPortalTemp.terminalType]}}</el-col>
            <el-col :span="8" v-if="isNew">
              <el-select v-model="newPortalTemp.terminal" placeholder="请选择终端类型">
                <el-option label="TV端" value="1"></el-option>
                <el-option label="手机端" value="4"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8" :offset="1" v-if="isNew && newPortalTemp.terminal==='1'">
              <el-select v-model="newPortalTemp.subterminal" placeholder="请选择终端类型">
                <el-option label="标清盒子" value="1"></el-option>
                <el-option label="高清盒子" value="2"></el-option>
                <el-option label="4K盒子" value="3"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="上传模板" required >
            <el-upload
              ref="uploadPortalTemp"
              action=""
              :auto-upload="false"
              :on-change="changeFile">
              <el-button size="small" type="primary">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">格式参考范例模板<a href="#">下载范例</a></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="关联区域" required >
            <el-col :span="17">
              <area-cascader
                lazy
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :area-props="{label:'name',children:'children',isLeaf: data => data.isLeaf === 1}"
                :default-expanded-keys="initExpand"
                :selected-area="newPortalTemp.areaIds"
                @check-area="checkArea">
              </area-cascader>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btns">
        <el-col :span="4" :offset="6">
          <el-button type="primary" :disabled="!newPortalTempIsValid" @click="submitEdit">提交</el-button>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button @click="close">取消</el-button>
        </el-col>
      </div>
    </div>
    <div class="popup-cover"></div>
    <modal-box
      :show.sync="modalShow"
      :height="140"
      :width="400"
      :zIndex="1011"
      title="上传Portal模板中">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="updatePercent"></el-progress>
    </modal-box>
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import util from './../../../assets/js/util'
  import CountInput from './../../common/CountInput'
  import AreaCascader from './../../common/AreaCascader.vue'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import ModalBox from './../../common/Modal'
  export default {
    name: 'portalTempOperate',
    mixins: [loadAreaMixin],
    props: {
      areas: Array,
      show: Boolean,
      isNew: Boolean,
      portalTemp: Object
    },
    data () {
      return {
        newPortalTemp: {
          terminal: '1',
          subterminal: '2',
          tmplName: '',
          file: null,
          areaIds: ''
        },
        terminalMap: util.terminalMap,
        fileLen: 0,
        modalShow: false,
        updatePercent: 0
      }
    },
    computed: {
      newPortalTempIsValid () {
        const setting = this.newPortalTemp
        return setting.tmplName && setting.areaIds
      }
    },
    watch: {
      show (show) {
        if (show) {
          if (this.isNew) {
            this.newPortalTemp = {
              terminal: '1',
              subterminal: '2',
              tmplName: '',
              file: null,
              areaIds: ''
            }
          } else {
            this.portalTemp.areaIds = this.portalTemp.groupId
            Object.assign(this.newPortalTemp, this.portalTemp)
          }
        }
        this.$nextTick(() => {
          this.$refs.uploadPortalTemp.clearFiles()
        })
      }
    },
    components: {
      CountInput,
      AreaCascader,
      ModalBox
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.fileLen = 0
      },
      changeFile (file, fileList) {
        if (fileList.length > 1) {
          fileList.shift()
        }
        this.fileLen = fileList.length
        this.newPortalTemp.file = fileList.length === 0 ? null : fileList[0].raw
      },
      checkArea (areaIds) {
        this.newPortalTemp.areaIds = areaIds
      },
      submitEdit () {
        var self = this
        let { tmplName, terminal, subterminal, file, id, areaIds } = this.newPortalTemp
        let params = new FormData()
        params.append('tmplName', tmplName)
        params.append('groupId', areaIds)
        params.append('terminalType', terminal === '1' ? subterminal : terminal)
        id && params.append('id', id)
        if (file) {
          this.modalShow = true
          params.append('importFile', file)
        }

        /* 根据this.isNew判断是新建还是编辑 */
        this.axios({
          url: this.isNew ? API.add_portal_temp : API.edit_portal_temp,
          method: 'post',
          data: params,
          onUploadProgress (e) {
            let loaded = e.loaded
            let total = e.total
            let percent = loaded / total * 100
            self.updatePercent = parseFloat(percent.toFixed(1))
          },
          timeout: 10000000
        }).then(() => {
          this.close()
          this.modalShow = false
          this.$emit('update-temp-list')
          this.$message({
            message: this.isNew ? '添加模板成功!' : '修改模板成功!',
            type: 'success'
          })
        }).catch((data) => {
          this.modalShow = false
          this.$message({
            message: data.msg,
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 580px;
    height: 440px;
    left: calc(50% - 290px);
    top: calc(50% - 220px);
  }
  .portal-temp-opt-content{
    height: 320px;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .popup-btns{
    width: 100%;
    padding: 5px;
    height: 36px;
  }
</style>
