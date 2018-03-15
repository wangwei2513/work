<template>
  <div class="edit-item-addCustom" v-if="show">
    <div class="popup-box">
      <div class="popup-header">{{isNew?'添加扩展字段':'编辑扩展字段'}}</div>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="closeNewCustom()"></i>
      <div class="addCustom-content">

        <el-row>
          <el-col class="custom-type" :span="4">扩展字段名</el-col>
          <el-col :span="10" :offset="1" v-if="isNew">
            <el-select
              v-model="customField.name"
              clearable
              filterable
              allow-create
              default-first-option
              placeholder="请输入扩展字段名">
              <el-option
                v-for="item in initFields"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="10" :offset="1" v-else>
            {{customField.name}}
          </el-col>
        </el-row>
        <el-row>
          <el-col class="custom-type" :span="4">内容</el-col>
          <el-col :span="10" :offset="1">
            <el-input v-model="customField.content" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
        <el-row v-show="customField.name !== 'marquee'">
          <el-col class="custom-type" :span="4">图片</el-col>
          <el-col :span="18" :offset="1">
            <el-upload
              ref="customUpload"
              action=""
              :on-change="handleCustomChange"
              :fileList="customField.fileList"
              :auto-upload="false"
              list-type="picture">
              <el-button size="small">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row v-show="customField.name !== 'marquee'">
          <el-col class="custom-type" :span="4">链接</el-col>
          <el-col :span="10" :offset="1"><el-input size="small" v-model="customField.link"></el-input></el-col>
          <el-col :span="6" :offset="1"><el-button size="small" @click="showSelectRelatedApp">关联应用</el-button></el-col>
          <transition name="el-zoom-in-top">
            <span class="custom-field-error-tip" v-show="showUrlErrorMsg">url地址格式不正确，请检查后重新提交！<i @click="showUrlErrorMsg = false" class="iconfont icon-arrows_remove"></i></span>
          </transition>
        </el-row>
      </div>
      <div class="popup-btn">
        <el-button type="primary" :disabled="!submitNewCustomDis" @click="handleCustomSubmit" :loading="submiting">提交</el-button>
        <el-button v-show="!isNew" :loading="submiting" type="danger" @click="confirmDel">删除</el-button>
        <el-button @click="closeNewCustom">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
    <!--选择关联应用messageBox begin  -->
    <relate-app
      key="customField"
      :relatedAppData="relatedApp"
      :relatedAppsData="relatedAppsData"
      :show.sync="view.selectRelatedAppShow"
      @selectApp="selectApp">
    </relate-app>
    <!--选择关联应用messageBox end  -->
  </div>
</template>
<script>
  import API from './../../assets/js/api.js'
  import RelateApp from './RelateApp.vue'
  import CountInput from './CountInput.vue'
  export default {
    name: 'customField',
    props: {
      show: Boolean,
      isNew: Boolean,
      isGrid: Boolean,
      gridId: String,
      ckTdId: String,
      curMenuId: [String, Number],
      customFieldData: Object,
      relatedAppsData: Array
    },
    data () {
      return {
        relatedApp: {
          area: '天河'
        },
        customField: {
          fileList: [],
          link: '',
          content: '',
          name: ''
        },
        apiUncertain: {
          add: this.isGrid ? API.add_portal_grid_field : API.add_portal_menu_field,
          del: this.isGrid ? API.del_portal_grid_field : API.del_portal_menu_field,
          edit: this.isGrid ? API.edit_portal_grid_field : API.edit_portal_menu_field
        },
        initFields: [
          {
            label: 'poster（海报）',
            value: 'poster'
          },
          {
            label: 'marquee（跑马灯）',
            value: 'marquee'
          }
        ],
        view: {
          selectRelatedAppShow: false
        },
        submiting: false,
        showUrlErrorMsg: false
      }
    },
    components: {
      RelateApp,
      CountInput
    },
    computed: {
      // 判断"自定义字段添加"是否至少有一项有内容
      submitNewCustomDis () {
        const data = this.customField
        let valid = true
        if (data.name !== '') {
          if (data.name === 'marquee') {
            valid = data.content !== ''
          } else {
            valid = data.content || data.fileList.length > 0 || data.link
          }
        } else {
          valid = false
        }
        return valid
      }
    },
    watch: {
      show: {
        handler (show) {
          if (show) {
            if (this.isNew) {
              this.customField = {
                name: '',
                fileList: [],
                link: '',
                content: ''
              }
            } else {
              $.extend(true, this.customField, this.customFieldData)
              if (this.customFieldData.fileList.length === 0) {
                this.customField.fileList = []
              }
            }
            this.$nextTick(() => {
              if (this.customField.fileList.length === 0) {
                this.$refs.customUpload.clearFiles()
              }
            })
          }
        }
      }
    },
    methods: {
      handleCustomChange (file, fileList) {
        if (fileList.length > 1) {
          fileList.shift()
        }
        this.customField.fileList = fileList
      },
      delCustomField () {
        let params = {
          id: this.curMenuId,
          extendId: this.customField.id
        }
        if (this.isGrid) {
          params.gridId = this.gridId
        }
        this.submiting = true
        this.axios.get(this.apiUncertain.del, { params }).then(() => {
          this.submiting = false
          this.$emit('update-custom-fields')
          this.closeNewCustom()
          this.$message({
            message: '删除扩展字段成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '删除扩展字段失败!',
            type: 'error'
          })
        })
      },
      closeNewCustom () {
        this.$emit('update:show', false)
      },
      confirmDel () {
        this.$confirm('确定删除此扩展字段吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delCustomField()
        }).catch(() => {})
      },
      handleCustomSubmit () {
        let url = this.isNew ? this.apiUncertain.add : this.apiUncertain.edit
        let { name, link, fileList, content, id: extendId } = this.customField
        if (link !== '' && typeof link === 'string') {
          const match = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
          if (!match.test(link)) {
            this.showUrlErrorMsg = true
            return false
          }
        }
        let params = new FormData()
        extendId && params.append('extendId', extendId)
        params.append('id', this.curMenuId)
        params.append('key', name)
        params.append('type', 3)
        params.append('url', link)
        params.append('desc', content)
        if (fileList.length > 0 && fileList[0].raw) {
          params.append('posterImg', fileList[0].raw)
        }
        
        if (this.isGrid) {
          params.append('gridId', this.gridId)
          params.append('ckTdId', this.ckTdId)
        }

        this.submiting = true
        this.axios.post(url, params).then(() => {
          this.submiting = false
          this.$emit('update-custom-fields')
          this.closeNewCustom()
          this.$message({
            message: (this.isNew ? '添加' : '修改') + '扩展字段成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: (this.isNew ? '添加' : '修改') + '扩展字段失败!',
            type: 'error'
          })
        })
      },
      showSelectRelatedApp () {
        this.view.selectRelatedAppShow = true
      },
      selectApp (link) {
        this.customField.link = link
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 590px;
    height: 522px;
    top: calc(50% - 261px);
    left: calc(50% - 285px);
  }
  .addCustom-content{
    height: 380px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .addCustom-content .el-row{
    padding: 10px 0;
  }
  .popup-btn{
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .custom-type{
    padding: 2px;
    color: #7b828c;
    text-align: right;
  }
  .custom-field-error-tip{
    position: absolute;
    top: 48px;
    left: 114px;
    font-size: 12px;
    color: #FA5555;
  }
  .icon-arrows_remove{
    position: absolute;
    right: -24px;
    top: 0px;
    height: 12px;
    font-size: 22px;
    line-height: 17px;
  }
</style>
<style>
  /*添加扩展字段的el-upload自定义样式begin  */
  .addCustom-content .el-upload-list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .addCustom-content .el-upload-list--picture .el-upload-list__item{
    height: 80px;
    width: 80px;
    margin-top:5px;
    margin-right: 10px;
    padding: 10px 5px 5px 85px;
  }
  .addCustom-content .el-upload-list--picture .el-upload-list__item-thumbnail{
    height: 60px;
    width: 60px;
  }
  .addCustom-content .el-upload-list--picture .el-upload-list__item-name{
    display: none;
  }
  /*添加扩展字段的el-upload自定义样式end  */
</style>
