<template>
  <div class="new-portal" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">{{isNew?'新建Portal':'复制Portal'}}</h2>
      <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
      <div class="new-portal-content">
        <el-form ref="newPortal" label-position="left" :model="newPortal" label-width="120px">
          <el-form-item label="终端类型">
            <el-col :span="11">
              <el-select v-model="newPortal.terminal" placeholder="请选择终端类型">
                <el-option label="TV端" value="1"></el-option>
                <el-option label="手机端" value="4"></el-option>
              </el-select>
            </el-col>
            <el-col :span="11" :offset="1" v-show="newPortal.terminal==='1'">
              <el-select v-model="newPortal.subterminal" placeholder="请选择终端类型">
                <el-option label="标清盒子" value="1"></el-option>
                <el-option label="高清盒子" value="2"></el-option>
                <el-option label="4K盒子" value="3"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="所属区域">
            <el-col :span="11">
              <el-cascader
                :options="areaTree"
                :show-all-levels="false"
                :props="cascaderProp"
                v-model="newPortal.area"
              ></el-cascader>
            </el-col>
          </el-form-item> -->
          <el-form-item label="Portal名称">
            <el-col :span="11">
              <count-input
                v-model="newPortal.portalName"
                :total="15"
                placeholder="请输入Portal名称"></count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="是否使用模板" v-if="isNew">
            <el-switch v-model="newPortal.useTemplate" @change="changeUseTemp"></el-switch>
          </el-form-item>
          <el-form-item label="上传Portal" v-if="!newPortal.useTemplate">
            <el-upload
              action=""
              ref="portalUpdata"
              :auto-upload="false"
              :on-change="changeFile"
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="选择模板" v-else>
            <el-col :span="4">
              <el-button @click="selectTempShow = true" size="small" type="primary">点击选择</el-button>
            </el-col>
            <el-col :span="8" :offset="1">
              {{newPortal.tmplName || '请选择模板'}}
            </el-col>
          </el-form-item>
           <el-form-item label="网格设置" v-if="newPortal.useTemplate && newPortal.useGrid">
            <el-col :span="4">
              <el-input v-model="newPortal.row"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">行</el-col>
            <el-col :span="4">
              <el-input v-model="newPortal.col"></el-input>
            </el-col>
            <el-col :span="2" :offset="1">列</el-col>
          </el-form-item>
          <el-form-item label="网格单位长度" v-if="newPortal.useTemplate && newPortal.useGrid">
            <el-col :span="11">
              <el-select v-model="newPortal.unit" type="number" filterable allow-create placeholder="请选择单位">
                <el-option label="20" value="20"></el-option>
                <el-option label="45" value="45"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="网格间距" v-if="newPortal.useTemplate && newPortal.useGrid">
            <el-col :span="11">
              <el-select v-model="newPortal.spaceBtw" filterable allow-create placeholder="请选择间距">
                <el-option label="5" value="5"></el-option>
                <el-option label="10" value="10"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btns" v-if="isNew">
        <el-col :span="4" :offset="6">
          <el-button @click="submit(false)" :loading="submiting" :disabled="!newPortalIsValid">仅保存</el-button>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button @click="submit(true)" :loading="submiting" type="primary" :disabled="!newPortalIsValid">保存并进入编辑</el-button>
        </el-col>
      </div>
    </div>
    <div class="popup-cover"></div>
    <modal-box
      :show.sync="modalShow"
      :height="140"
      :width="400"
      :zIndex="1011"
      title="上传Portal中">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="updatePercent"></el-progress>
    </modal-box>
    <select-temp
      :show.sync="selectTempShow"
      title="选择Portal模板"
      :data="[]"
      :tempId="newPortal.tmplId"
      :tempName="newPortal.tmplName"
      :rootAreaId="rootAreaId"
      @finish-select-temp="finishSelectTemp">
    </select-temp>
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import ModalBox from './../../common/Modal'
  import CountInput from './../../common/CountInput.vue'
  import SelectTemp from './SelectTemp.vue'
  export default {
    name: 'newPortal',
    props: {
      rootAreaId: [String, Number],
      isNew: Boolean,
      show: Boolean
    },
    data () {
      return {
        newPortal: {
          portalName: '',
          terminal: '1',
          subterminal: '2',
          useTemplate: false,
          tempFile: null,
          tmplId: '',
          tmplName: '',
          useGrid: false,
          col: '',
          row: '',
          unit: '',
          spaceBtw: ''
        },
        cascaderProp: {
          children: 'children',
          label: 'label',
          value: 'label'
        },
        modalShow: false,
        selectTempShow: false,
        submiting: false,
        progressBarTotalWidth: 360,
        progressBarWidth: '0px',
        updatePercent: 0
      }
    },
    computed: {
      newPortalIsValid () {
        const setting = this.newPortal
        let valid = true
        if (setting.portalName === '') {
          valid = false
        }
        if (setting.useTemplate && (setting.tmplId === '' || (setting.useGrid && !(setting.col && setting.row && setting.unit && setting.spaceBtw)))) {
          valid = false
        }
        // if (setting.useTemplate) {
        //   if (setting.useGrid && !(setting.col && setting.row && setting.unit && setting.spaceBtw)) {
        //     valid = false
        //   }
        // }
        if (!setting.useTemplate && !setting.tempFile) {
          valid = false
        }
        return valid
      }
    },
    components: {
      ModalBox,
      CountInput,
      SelectTemp
    },
    watch: {
      show: {
        handler (show) {
          if (show) {
            if (this.isNew) {
              this.newPortal = {
                portalName: '',
                terminal: '1',
                subterminal: '2',
                useTemplate: false,
                tempFile: null,
                tmplId: '',
                tmplName: '',
                useGrid: false,
                col: '',
                row: '',
                unit: '',
                spaceBtw: ''
              }
              this.$nextTick(() => {
                this.$refs.portalUpdata.clearFiles()
              })
            }
          }
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
      },
      changeFile (file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        this.newPortal.tempFile = fileList[0]
      },
      submit (goEdit) {
        var self = this
        let params = new FormData()
        let { col, portalName, row, terminal, subterminal, unit, spaceBtw, useTemplate, tempFile, tmplId, useGrid } = this.newPortal
        params.append('portalName', portalName)
        params.append('useTmpl', useTemplate ? 1 : 0)
        /* 当选择模板时,可以调整模板的属性.当上传portal时,不能调整其属性 */
        if (useTemplate) {
          // TODO 验证数据是否为数字
          params.append('useGrid', useGrid ? 1 : 0)
          params.append('tmplId', tmplId)
          params.append('colSize', col)
          params.append('rowSize', row)
          params.append('cellLen', unit)
          params.append('cellGapLen', spaceBtw)
          this.submiting = true
        } else {
          params.append('importFile', tempFile.raw)
          this.modalShow = true
        }
        /* tv端分有子类型 */
        if (terminal === '1') {
          params.append('terminaType', subterminal)
        } else {
          params.append('terminaType', terminal)
        }
        
        this.axios.post(API.add_portal, params, {
          onUploadProgress (e) {
            let loaded = e.loaded
            let total = e.total
            let percent = loaded / total * 100
            self.updatePercent = parseFloat(percent.toFixed(1))
          },
          timeout: 10000000
        }).then((data) => {
          this.close()
          this.$emit('upload-portal-list', goEdit ? data.obj : '')
          this.modalShow = false
          this.submiting = false
          this.$message({
            message: '新建Portal成功!',
            type: 'success'
          })
        }).catch((data) => {
          this.modalShow = false
          this.submiting = false
          this.$message({
            message: data.msg,
            type: 'error'
          })
        })
      },
      finishSelectTemp (temp) {
        this.newPortal.tmplId = temp.id
        this.newPortal.tmplName = temp.tmplName
        if ('' + temp.useGrid === '1') {
          this.newPortal.useGrid = true
          this.newPortal.col = temp.colSize
          this.newPortal.row = temp.rowSize
          this.newPortal.unit = temp.cellLen
          this.newPortal.spaceBtw = temp.cellGapLen
        } else {
          this.newPortal.useGrid = false
        }
      },
      changeUseTemp (val) {
        if (val) {
          this.newPortal.useGrid = false
          this.newPortal.tmplId = ''
          this.newPortal.tmplName = ''
        }
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 640px;
    height: 520px;
    left: calc(50% - 320px);
    top: calc(50% - 260px);
  }
  .new-portal-content{
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .upload-progress-outer{
    width: 100%;
    height: 20px;
    position: relative;
    top: calc(50% - 10px);
    border-radius: 4px;
    background-color: #ccc;
  }
  .upload-progress-inner{
    height: 100%;
    border-radius: 4px;
    background-color: #13CE66;
  }
</style>
<style>
  .portal-lit-table tr{
    cursor: pointer;
  }
</style>
