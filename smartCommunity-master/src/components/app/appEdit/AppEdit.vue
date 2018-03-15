<template>
  <div>
    <div class="app-edit-main-left" :class="view.currentView == 'AppPreview'?'app-preview':''">
      <i-tabs
        :tabs="tabs"
        :activeTab="activeTab"
        @active-change="handleActiveChange"></i-tabs>
      <component 
        class="app-edit-component"
        :curNodeTempUrl="curNodeTempUrl"
        :curNode="curNode"
        :appInfo="appInfo"
        :select-node-module="selectNodeModule"
        :user-right-list="userRightList"
        :reload.sync="reloadCopy"
        @select-temp="$emit('show-select-temp')"
        @showMateDetail="showMateDetail"
        :is="view.currentView"></component>
    </div>
    <div class="app-edit-mate" v-if="userRightList.includes('getNodeDetail') && view.currentView == 'AppPreview'">
      <div class="app-edit-mate-title">
        页面元素编辑
      </div>
      <div class="app-edit-mate-content i-scollbar">
        <el-row type="flex" align="middle" v-if="curNode && curNode.isLeaf === 1 && curNode.pModuleType == 1">
          <el-col :span="6" class="mate-title">列表板式</el-col>
          <el-col :span="18">
            <el-select v-model="mate.listType" placeholder="请选择" size="small">
              <el-option label="列表" value="list"></el-option>
              <el-option label="宫格" value="squared"></el-option>
              <el-option label="纯内容" value="nolist"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" v-if="curNode && curNode.pModuleType != '1' && !curNode.hasOutLink">
          <el-col :span="6" class="mate-title">跑马灯</el-col>
          <el-col :span="18">
            <el-input size="small" v-model="mate.marquee" placeholder="请输入跑马灯内容"></el-input>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle" v-if="curNode && curNode.pModuleType != '1'">
          <el-col :span="6" class="mate-title">是否外跳</el-col>
          <el-col :span="18">
            <el-radio-group v-model="hasOutLink" @change="changeOutLink" :disabled="outLinkDis">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <div v-if="hasOutLink">
          <el-row type="flex" align="middle">
            <el-col :span="6" class="mate-title">外跳路径</el-col>
            <el-col :span="18">
              <el-input size="small" v-model="mate.linkUrl"></el-input>
            </el-col>
          </el-row>
        </div>
        <div v-if="curNode && curNode.pModuleType != '1'">
          <el-row v-if="!hasOutLink" type="flex" justify="center" align="top">
            <el-col :span="6" class="mate-title mate-title-top">logo图片</el-col>
            <el-col :span="18">
              <el-upload
                ref="logoUpload"
                action="http://example.com"
                :on-change="handleUploadChange.bind(this, 'logoImage')"
                :on-remove="handleRemove.bind(this, 'logoImage')"
                :fileList="(curNode && curNode.logoImage) || []"
                :auto-upload="false"
                :disabled="selectImgDis"
                list-type="picture">
                <el-button size="small" :disabled="selectImgDis">选择图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row v-if="!hasOutLink" type="flex" justify="center" align="top">
            <el-col :span="6" class="mate-title mate-title-top">背景图片</el-col>
            <el-col :span="18">
              <el-upload
                ref="bgUpload"
                action="http://example.com"
                :on-change="handleUploadChange.bind(this, 'backgroundImage')"
                :on-remove="handleRemove.bind(this, 'backgroundImage')"
                :fileList="(curNode && curNode.backgroundImage) || []"
                :auto-upload="false"
                :disabled="selectImgDis"
                list-type="picture">
                <el-button size="small" :disabled="selectImgDis">选择图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" align="top" v-show="curNode && curNode.pId !== 0">
            <!-- 根节点没有失焦海报 -->
            <el-col :span="6" class="mate-title mate-title-top">聚焦海报</el-col>
            <el-col :span="18">
              <el-upload
                ref="posterUpload"
                action="http://example.com"
                :on-change="handleUploadChange.bind(this, 'focusPoster')"
                :on-remove="handleRemove.bind(this, 'focusPoster')"
                :fileList="(curNode && curNode.focusPoster) || []"
                :auto-upload="false"
                :disabled="selectImgDis"
                list-type="picture">
                <el-button size="small" :disabled="selectImgDis">选择图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" align="top" v-show="curNode && curNode.pId !== 0">
            <!-- 根节点没有失焦海报 -->
            <el-col :span="6" class="mate-title mate-title-top">失焦海报</el-col>
            <el-col :span="18">
              <el-upload
                ref="blurPosterUpload"
                action="http://example.com"
                :on-change="handleUploadChange.bind(this, 'blurPoster')"
                :on-remove="handleRemove.bind(this, 'blurPoster')"
                :fileList="(curNode && curNode.blurPoster) || []"
                :auto-upload="false"
                :disabled="selectImgDis"
                list-type="picture">
                <el-button size="small" :disabled="selectImgDis">选择图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="userRightList.includes('editNode')" class="app-edit-mate-btn">
        <el-button :loading="submiting" @click="editNode" type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import ITabs from './../../common/ITabs.vue'
  import AppPreview from './AppPreview.vue'
  import MateList from './MateList.vue'
  import IUpload from './../../common/IUpload.vue'
  import API from './../../../assets/js/api'
  export default {
    name: 'appEdit',
    props: {
      curNodeTempUrl: String,
      reload: Boolean,
      curNode: {
        type: Object
      },
      appInfo: {
        type: Object
      },
      userRightList: {
        type: Array
      },
      selectNodeModule: {
        type: Boolean
      }
    },
    data () {
      return {
        activeTab: '1',
        hasOutLink: false,
        reloadCopy: this.reload,
        mate: {
          linkUrl: '',
          listType: '',
          marquee: '',
          logoImage: [],
          logoImageFile: null,
          backgroundImage: [],
          backgroundImageFile: null,
          focusPoster: [],
          focusPosterFile: null,
          blurPoster: [],
          blurPosterFile: null
        },
        view: {
          currentView: 'AppPreview',
          addCustomShow: false,
          isNewCustom: true,
          selectRelatedAppShow: false
        },
        submiting: false
      }
    },
    watch: {
      curNode: {
        immediate: true,
        handler (curNode) {
          if (curNode) {
            let mate = {
              linkUrl: '',
              listType: '',
              marquee: '',
              logoImage: [],
              logoImageFile: null,
              backgroundImage: [],
              backgroundImageFile: null,
              focusPoster: [],
              focusPosterFile: null,
              blurPoster: [],
              blurPosterFile: null
            }
            this.mate = $.extend(true, mate, curNode)
          }
          this.activeTab = '1'
          this.view.currentView = 'AppPreview'
          this.hasOutLink = !!this.mate.linkUrl
        }
      },
      reload (reload) {
        this.reloadCopy = reload
      },
      reloadCopy (reload) {
        this.$emit('update:reload', reload)
      }
    },
    computed: {
      tabs () {
        let tabs = [{
          label: '页面预览',
          id: '1',
          view: 'AppPreview'
        }]
        if (!this.hasOutLink && (this.curNode && this.curNode.isLeaf === 1)) {
          tabs.push({
            label: '素材列表',
            id: '2',
            view: 'MateList'
          })
        }
        return tabs
      },
      selectImgDis () {
        return !(this.curNode && this.curNode.moduleId || this.hasOutLink)
      },
      outLinkDis () {
        let curNode = this.curNode
        let disabled = false
        if (curNode && (['1', '4'].includes(curNode.pModuleType + '') || curNode.isLeaf !== 1)) {
          disabled = true
        }
        return disabled
      }
    },
    components: {
      ITabs,
      AppPreview,
      MateList,
      IUpload
    },
    methods: {
      handleActiveChange (tab) {
        this.activeTab = tab.id
        this.view.currentView = tab.view
      },
      handleUploadChange (imageType, file, fileList) {
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        fileList.length > 0 && (this.mate[imageType + 'File'] = fileList[0].raw)
      },
      editNode () {
        let { linkUrl, listType, logoImageFile, backgroundImageFile, blurPosterFile, focusPosterFile,
        id, pId, title, enName, moduleId, logoImage, backgroundImage, blurPoster, focusPoster, marquee } = this.mate
        var data = new FormData()
        data.append('id', id)
        data.append('pId', pId)
        data.append('title', title)
        data.append('enName', enName)
        data.append('appId', this.appInfo.id)
        listType && data.append('listType', listType)
        marquee && data.append('marquee', marquee)

        /* 聚焦,失焦图片不管外跳都需要传的 */
        this.appendFile(data, focusPosterFile, focusPoster, 'focusPosterFile', 'oriFocusPosterUrl')
        this.appendFile(data, blurPosterFile, blurPoster, 'blurPosterFile', 'oriBlurPosterUrl')

        /* 根据是否外跳,取消模板选择,选择设置外跳路径或者logo,背景图 */
        if (this.hasOutLink) {
          data.append('linkUrl', linkUrl)
          data.append('moduleId', '')
        } else {
          // 设置外跳路径会优先判定该栏目为外跳栏目,因此需要把外跳路径清空
          data.append('linkUrl', '')
          data.append('moduleId', moduleId || '')
          this.appendFile(data, logoImageFile, logoImage, 'logoImageFile', 'oriLogoUrl')
          this.appendFile(data, backgroundImageFile, backgroundImage, 'backgroundImageFile', 'oriBackGroundImageUrl')
        }
        
        this.submiting = true
        this.axios.put(API.edit_node, data).then(() => {
          this.$emit('update-node-info', this.curNode.id)
          this.submiting = false
          this.$message({
            message: '编辑栏目成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '编辑栏目失败!',
            type: 'error'
          })
        })
      },
      /**
       * 为栏目添加图片文件,本地选择上传的文件直接上传,如果本来就有图片,需要将图片地址返回给接口,如果不传地址也不上传图片,则视为删除该图片
       */
      appendFile (data, uploadFile, oriFilelist, fileName, oriFileUrl) {
        if (uploadFile) {
          data.append(fileName, uploadFile)
        } else if (oriFilelist.length > 0) {
          data.append(oriFileUrl, oriFilelist[0].url)
        }
      },
      handleRemove (imageType, file, fileList) {
        if (this.curNode[imageType] && fileList.length === 0) {
          // 请求存在该图片字段,移除需设置移除字段为空
          var filrstLetter = imageType[0].toUpperCase()
          var oriKey = 'ori' + filrstLetter + imageType.substring(1)
          this.mate[oriKey] = ''
          this.$message({
            message: '移除原有图片',
            type: 'info'
          })
        } else if (!this.curNode[imageType] && fileList.length === 0) {
          // 请求不存在该图片字段,不做任何操作
          this.$message({
            message: '移除本地选择图片',
            type: 'info'
          })
        }
        fileList.length === 0 && (this.mate[imageType] = [])
        console.log(arguments)
      },
      changeOutLink (val) {
        this.$emit('change-out-link', val)
      },
      showMateDetail (mate) {
        this.$emit('showMateDetail', mate)
      }
    }
  }
</script>
<style scoped>
  .app-edit-main-left{
    float: left;
    box-sizing: border-box;
    padding: 20px;
    width: 100%;
    height: 100%;
    border: thin solid #d3dce6;
  }
  .app-edit-component{
    padding-top: 20px;
  }
  .app-preview.app-edit-main-left{
    width: calc(100% - 310px);
    margin-right: 10px;
  }
  .app-edit-mate{
    float: left;
    height: 100%;
    width: 300px;
    box-sizing: border-box;
    border: thin solid #d3dce6;
  }
  .app-edit-mate-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #1f2d3d;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
  }
  .app-edit-mate-content{
    padding: 20px 10px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    height: 500px;
  }
  .app-edit-mate-btn{
    height: 49px;
    text-align: center;
    border-top: thin solid #d3dce6;
    padding-top: 6px;
  }
  .app-edit-mate-content .el-row{
    margin-bottom: 10px
  }
  .mate-title{
    font-size: 14px;
    color: #7b828c;
  }
  .mate-title-top{
    margin-top: 5px;
  }
</style>
<style>
  .app-edit-mate-content .el-upload-list__item-name{
    margin-right: 0;
    color: #48576a !important;
    cursor: initial !important;
  }
  .app-edit-mate-content .el-upload-list__item-name .el-icon-document{
    display: none;
  }
  .app-edit-mate-content .el-upload-list__item-thumbnail{
    height: 100%;
    width: auto;
  }
  .app-edit-mate-content .row-name{
    width: 25%;
  }
  .app-edit-mate-content .custom-field{
    font-size: 14px;
    margin-bottom: 10px;
  }
  
</style>