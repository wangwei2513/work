<template>
  <div class="new-mate" v-loading="loading">
      <el-form ref="mate" :model="mate" label-width="90px">
        <el-form-item label="素材标题" required>
          <el-col :span="6">
            <el-input v-model="mate.title" placeholder="请填写素材标题"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="搜索关键字">
          <el-col :span="12">
            <span class="placeholder" v-show="!mate.title">请填写素材标题</span>
            <cha-to-pinyin
              :value="mate.title"
              :traVal.sync="mate.pinyin"
              spliter=""
              onlyFirst
              :initVal="mate.titleEnName">
            </cha-to-pinyin>
          </el-col>
        </el-form-item>
        <el-form-item label="副标题">
          <el-col :span="6">
            <el-input v-model="mate.subTitle" placeholder="请填写素材副标题"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="简介">
          <el-col :span="12">
            <el-input type="textarea" :rows="4" v-model="mate.description" placeholder="请填写素材简介"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="6">
            <el-date-picker
              v-model="mate.entryDate"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="海报图片">
          <el-col :span="24">
            <el-upload
              action=""
              list-type="picture"
              multiple
              :file-list="mate.entryImageFile"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="(file, files) => {handleRemove(file, files, 'entryImageFile')}"
              :on-change="(file, files) => {handleFileChange(file, files, 'entryImageFile', false)}">
              <el-button size="small" type="primary">选择图片</el-button>
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="正文内容">
          <el-col :span="24" class="mate-content">
            <i-ueditor
              editor-name="editMate"
              :value="mateInitContent"
              @change="contentChange">
            </i-ueditor>
          </el-col>
        </el-form-item>
        <el-form-item label="相册图集">
          <el-row>
            <el-col :span="24">
              <el-upload
                action=""
                list-type="picture"
                multiple
                :file-list="mate.albumFiles"
                :auto-upload="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="(file, files) => {handleRemove(file, files, 'albumFiles')}"
                :on-change="(file, files) => {handleFileChange(file, files, 'albumFiles', true)}">
                <el-button size="small" type="primary">选择图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="外跳链接">
          <el-col :span="12">
            <el-input size="small" :value="linkUrlAppend" @change="(val) => {(!mate.linkUrl || mate.linkUrl.startsWith('http://')) && (mate.linkUrl = 'http://' + val)}">
              <template v-if="!mate.linkUrl || mate.linkUrl.startsWith('http://')" slot="prepend">http://</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="视频文件">
          <el-row>
            <el-col :span="24">
              <el-radio-group v-model="mate.videoUploadType">
                <el-radio :label="2">本地上传</el-radio>
                <el-radio :label="1">填写视频地址</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="mate.videoUploadType === 2">
              <i-upload :value="mate.videoFile" @change="(files) => {changeFiles(files, 'videoFile')}"></i-upload>
            </el-col>
            <el-col :span="6" v-else>
              <el-input placeholder="请填写视频地址" v-model="mate.videoUrl"></el-input>
            </el-col>
            <el-col :span="6" :offset="1" v-if="mate.video">
              <el-button size="small">预览视频</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="背景音乐">
          <el-row>
            <el-col :span="24">
              <el-radio-group v-model="mate.backgroundMusicUploadType">
                <el-radio :label="2">本地上传</el-radio>
                <el-radio :label="1">填写音频地址</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="mate.backgroundMusicUploadType === 2">
              <i-upload :value="mate.backgroundMusicFile" @change="(files) => {changeFiles(files, 'backgroundMusicFile')}"></i-upload>
            </el-col>
            <el-col :span="6" v-else>
              <el-input placeholder="请填写音频地址" v-model="mate.backgroundMusicUrl"></el-input>
            </el-col>
            <el-col :span="6" :offset="1" v-if="mate.backgroundMusic">
              <el-button size="small">试听</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <custom-field-list
          class="custom-field-list"
          @editCustomField="editCustomField"
          :editable="true"
          :customFields="mate.extendFields">
        </custom-field-list>
        <el-form-item label="扩展字段">
          <el-col :span="6">
            <el-button size="small" @click="view.isCustomFieldShow = true">添加扩展字段</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="关联栏目">
          <el-row>
            <el-col :span="6">
              <el-button size="small" @click="view.relateColumnShow = true">选择栏目</el-button>
            </el-col>
          </el-row>
          <el-row v-for="(col,index) in mate.nodes" :key="index">
            <el-col :span="12">
              <span class="relate-column-text">
                {{col.appName + ' - ' + col.title}}
              </span>
              <i class="iconfont icon-arrows_remove" title="解除关联" @click="removeNode(col.id)"></i>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="1" :offset="9"><el-button @click="submitMate(1)" :disabled="!editable" type="primary">保存</el-button></el-col>
        <el-col :span="2" :offset="1"><el-button @click="submitMate(3)" v-if="sySetting.auditEntryType === 'auto'" :disabled="!editable">保存并发布</el-button></el-col>
        <el-col :span="3" :offset="1"><el-button @click="submitMate(2)" v-if="sySetting.auditEntryType === 'manual'" :disabled="!editable">保存并提交审核</el-button></el-col>
      </el-row>
      <!-- 自定义字段编辑begin -->
      <custom-field
        :show.sync="view.isCustomFieldShow"
        :isNew="view.isNewCustom"
        :custom-field-data="curEditExtendField"
        :related-apps-data="relatedApps"
        @addNewCustom="addNewCustom"
        @editOldCustom="editOldCustom"
        @delCustomField="delCustomField">
      </custom-field>
      <!-- 自定义字段编辑end -->

      <!-- 关联栏目操作begin -->
      <relate-node
        key="edit-relate-node"
        :show.sync="view.relateColumnShow"
        :mateList="[mate]"
        :immediate="false"
        :ori-nodes="mate.nodes"
        :curView="'set'"
        @change-nodes="changeNodes">
      </relate-node>
      <!-- 关联栏目操作end -->
      <el-dialog v-model="view.dialogVisible" size="small">
        <img width="100%" style="max-height: 400px" :src="dialogImageUrl" alt="">
      </el-dialog>
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import util from './../../../assets/js/util.js'
  import Cookies from './../../../assets/js/cookie'
  import CustomField from './CustomField.vue'
  import CustomFieldList from './../../common/CustomFieldList.vue'
  import RelateNode from './../RelateNode.vue'
  import ChaToPinyin from './../../common/CC2P.vue'
  import IUeditor from './../../common/IUeditor.vue'
  import IUpload from './../../common/IUpload'
  export default {
    name: 'editMate',
    props: {
      sySetting: {
        type: Object
      }
    },
    data () {
      return {
        mateInitContent: '',
        mate: {
          title: '',
          titleEnName: '',
          subTitle: '',
          description: '',
          content: '',
          plainTxt: '',
          linkUrl: '',
          entryDate: Date.now(),
          entryImageFile: [],
          albumFiles: [],
          videoUploadType: 1,
          backgroundMusicUploadType: 1,
          videoFile: [],
          backgroundMusicFile: [],
          videoUrl: '',
          backgroundMusicUrl: '',
          extendFields: [],
          nodes: []
        },
        curEditExtendField: {},
        dialogImageUrl: '',
        relatedApps: [],
        view: {
          isCustomFieldShow: false,
          isNewCustom: true,
          relateColumnShow: false,
          dialogVisible: false
        },
        loading: false
      }
    },
    components: {
      CustomField,
      CustomFieldList,
      RelateNode,
      ChaToPinyin,
      IUeditor,
      IUpload
    },
    computed: {
      mateId () {
        return this.$route.params.id
      },
      linkUrlAppend () {
        let url = this.mate.linkUrl
        let result = ''
        if (url && url.startsWith('http://')) {
          result = url.split('http://')[1]
        }
        return result
      },
      editable () {
        let mate = this.mate
        return (mate.title || mate.title === 0) && mate.nodes.length > 0
      }
    },
    watch: {
      view: {
        immediate: true,
        deep: true,
        handler (view) {
          if (view.relateColumnShow) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden'
          } else {
            document.getElementsByTagName('body')[0].style.overflow = 'auto'
          }
        }
      }
    },
    methods: {
      getAppList () {
        const self = this
        this.$http.get(API.get_app_list).then(function (res) {
          const resBody = res.body
          if (resBody.ret === 0) {
            self.relatedApps = resBody.apps
          } else {
            self.$msg('获取数据失败！')
          }
        })
      },
      editCustomField (field) {
        this.view.isCustomFieldShow = true
        this.view.isNewCustom = false
        $.extend(this.curEditExtendField, field)
      },
      addNewCustom (field) {
        this.mate.extendFields.push(field)
      },
      editOldCustom (field) {
        this.mate.extendFields.some(function (extendField, i) {
          if (extendField.name === field.name) {
            extendField.name = field.name
            extendField.content = field.content
            return true
          }
        }, this)
      },
      delCustomField (field) {
        let idx = -1
        this.mate.extendFields.some(function (extendField, i) {
          if (extendField.name === field.name) {
            idx = i
            return true
          }
        }, this)
        this.mate.extendFields.splice(idx, 1)
      },
      submitMate (entryStatus) {
        var params = this.appendFormData(entryStatus)
        this.loading = true
        this.axios({
          method: 'put',
          url: API.edit_entry,
          data: params
        }).then((data) => {
          this.$emit('update-mate-list', true)
          this.loading = false
          this.$message({
            message: '成功修改素材!',
            type: 'success'
          })
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '修改素材失败!',
            type: 'error'
          })
        })
      },
      changeFiles (files, fileType) {
        this.mate[fileType] = files
      },
      contentChange (content, plainTxt) {
        this.mate.content = content
        this.mate.plainTxt = plainTxt
      },
      appendFormData (entryStatus) {
        var formData = new FormData()
        let { id, title, pinyin, subTitle, description, entryDate, content,
          plainTxt, nodes, videoUploadType, backgroundMusicUploadType, linkUrl, backgroundMusicUrl,
          backgroundMusicFile, videoUrl, videoFile, entryImageFile, albumFiles, extendFields } = this.mate

        entryDate = util.formatDate(entryDate, 'YYYY-MM-DD hh:mm:ss')

        /* 基本字符串键值对的参数,如果值不存在则不会添加参数 */
        let params = { id, title, titleEnName: pinyin, subTitle, description, entryDate, content, plainTxt, videoUploadType, backgroundMusicUploadType, linkUrl }
        for (let key in params) {
          params[key] && formData.append(key, params[key])
        }

        /* 关联栏目参数 */
        nodes.forEach(function (node) {
          let param = '' + node.id + '&'
          if (node.contentModuleId || node.contentModuleId === 0) {
            param += node.contentModuleId
          }
          formData.append('nodeIds', param)
        }, this)

         /* 扩展字段参数 */
        extendFields.forEach(function (field) {
          formData.append('extendFields', field.name + '&' + field.content)
        }, this)

        /* 可能需要特殊处理的参数 */
        formData.append('author', Cookies.get('userName'))
        formData.append('entryStatus', entryStatus)

        /* 背景音乐文件 */
        if (backgroundMusicUploadType === 1) {
          formData.append('backgroundMusicUrl', backgroundMusicUrl)
        } else {
          formData.append('backgroundMusicFile', backgroundMusicFile[0])
        }

        /* 视频文件文件 */
        if (videoUploadType === 1) {
          formData.append('videoUrl', videoUrl)
        } else {
          formData.append('videoFile', videoFile[0])
        }

        /* 入口海报文件 */
        if (entryImageFile.length > 0) {
          if (entryImageFile[0].id) {
            formData.append('oriEntryImageUrl', entryImageFile[0].imageUrl)
          } else {
            formData.append('entryImageFile', entryImageFile[0].raw)
          }
        } else {
          formData.append('oriEntryImageUrl', '')
        }

        /* 相册图集文件 */
        if (albumFiles.length > 0) {
          for (let i = 0; i < albumFiles.length; i++) {
            let albumFile = albumFiles[i]
            if (albumFile.id) {
              formData.append('oriAlbumUrls', albumFile.imageUrl)
            } else {
              formData.append('albumFiles', albumFile.raw)
            }
          }
        } else {
          formData.append('oriAlbumUrls', '')
        }
        // formData.append('videoUrl_preview', '')
        return formData
      },
      changeNodes (nodes) {
        this.mate.nodes = nodes
      },
      removeNode (nodeId) {
        let ndoes = this.mate.nodes
        let idx = -1
        for (let i = 0; i < ndoes.length; i++) {
          let node = ndoes[i]
          if (nodeId === node.id) {
            idx = i
            break
          }
        }
        this.mate.nodes.splice(idx, 1)
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url
        this.view.dialogVisible = true
      },
      handleRemove (file, fileList, fileType) {
        this.mate[fileType] = fileList
      },
      handleFileChange (file, fileList, fileType, multiple) {
        if (multiple) {
          this.mate[fileType] = fileList
        } else {
          fileList.length > 1 && fileList.splice(0, 1)
          this.mate[fileType] = fileList
        }
        console.log(this.mate)
      }
    },
    activated () {
      this.axios.get(API.get_entry_info, { params: { id: this.mateId } }).then((data) => {
        Array.isArray(data.albums) && data.albums.forEach(function (file) {
          file.name = file.imageName
          file.url = file.imageUrl
        }, this)
        if (data.entryPoster) {
          data.entryPoster.name = data.entryPoster.imageName
          data.entryPoster.url = data.entryPoster.imageUrl
          data.entryImageFile = [data.entryPoster]
        } else {
          data.entryImageFile = []
        }
        data.albumFiles = data.albums
        data.backgroundMusicUrl = data.backgroundMusic || ''
        data.videoUrl = data.video || ''
        data.entryDate = util.formatDate(data.entryDate, 'YYYY-MM-DD hh:mm:ss')
        data.extendFields = []
        data.extendfieldResps.forEach(function (extendField) {
          data.extendFields.push({
            id: extendField.id,
            name: extendField.fieldKey,
            content: extendField.fieldValue
          })
        }, this)
        data.backgroundMusicUploadType = 1
        data.videoUploadType = 1
        this.mate = data
        this.mateInitContent = data.content
      }).catch(() => {
        this.$message({
          message: '获取素材详情失败!',
          type: 'error'
        })
      })
    }
  }
</script>
<style scoped>
  .new-mate{
    margin-bottom: 40px;
  }
  .custom-field-list{
    margin-bottom: 22px;
  }
  .relate-column-text{
    vertical-align: middle;
  }
  .ipanel-icon{
    cursor: pointer;
  }
  .icon-arrows_remove{
    font-size: 24px;
    line-height: 20px;
    height: 16px;
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    position: initial;
    transition: none;
  }
  .icon-arrows_remove:hover{
    transform: none;
  }
  .entry-poster-wp{
    float: left;
    margin-right: 10px;
  }
  .entry-albums-wp{
    height: 80px;
    width: 80px;
    overflow: hidden;
  }
  .entry-albums-wp img{
    width: 100%;
  }
</style>
<style>
  .new-mate .ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 40em;
  }
  .new-mate .el-form-item__label{
    color: #7b828c;
  }
  .new-mate .custom-field .row-name{
    width: 90px;
    font-size: 14px;
    text-align: right;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }
  .new-mate .mate-content {
    line-height: 1px;
  }
  .new-mate .el-upload-list__item{
    max-width: 200px;
    display: inline-block;
    margin-right: 10px;
  }
  .new-mate .el-upload-list__item-name{
    min-width: 100px;
  }
  .new-mate .el-icon-document{
    display: none;
  }
</style>