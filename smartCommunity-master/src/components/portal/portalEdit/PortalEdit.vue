<template>
  <div class="portal-edit">
    <div class="edit-construction-title">编辑栏目</div>
    <div v-if="ctsData" class="edit-construction-content">
      <!--常规编辑项begin  -->
      <el-row type="flex" align="middle" v-for="(item,index) in editItems" :key="item.name">
        <el-col :span="4" class="row-name">{{item.name}}</el-col>
        <el-col :span="6">
          <el-upload
            class="upload-wp"
            action=""
            :multiple="false"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-change="(file,fileList) => {handleChange(file,fileList,item)}"
            :on-success="modify"
            :on-remove="modify"
            :file-list="item.fileList">
            <el-button size="small">点击上传</el-button>
          </el-upload>
        </el-col>
        <el-col :span="4" :offset="1">
          <img @click="showPreview(item.name,item.previewSrc)" class="thumb" :src="item.previewSrc">
        </el-col>
        <el-col :span="8">
          <el-alert
            :title="item.info"
            type="info"
            :closable="false">
          </el-alert>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle"  v-if="!isRoot">
        <el-col :span="4" class="row-name">菜单链接</el-col>
        <el-col :span="8"><el-input size="mini" v-model="menuLink" @change="modify"></el-input></el-col>
        <el-col :span="2" :offset="1"><el-button size="mini" @click="showSelectRelatedApp">关联应用</el-button></el-col>
      </el-row>
      <!--常规编辑项end  -->

      <!--自定义字段begin  -->
      <el-row type="flex" align="middle" v-show="loading">
        <div><i class="el-icon-loading"></i><span class="placeholder">加载扩展字段中...</span></div>
      </el-row>
      <custom-field-list :customFields="customFields" @editCustomField="editCustomField" :editable="true"></custom-field-list>
      <!--自定义字段end  -->

      <!--新增自定义字段begin  -->
      <el-row type="flex" align="middle">
        <el-col :span="4" class="row-name">扩展字段</el-col>
        <el-col :span="8">
          <el-button size="small" @click="newCustomField">添加扩展字段</el-button>
        </el-col>
      </el-row>
      <!--新增自定义字段end  -->
    </div>
    <div v-else class="edit-construction-content">请选择栏目进行编辑!</div>
    <!--全局按钮begin  -->
    <div v-if="ctsData" class="edit-construction-btn">
      <el-button type="primary" @click="submitCts">提交</el-button>
      <el-button @click="$emit('preview-portal')">预览</el-button>
    </div>
    <!--全局按钮end  -->

    <!--新增/编辑自定义字段messageBox begin  -->
    <custom-field
      :show.sync="view.addCustomShow"
      :customFieldData="customField"
      :isNew="view.isNewCustom"
      :isGrid="false"
      :curMenuId="ctsData && ctsData.id"
      :relatedAppsData="relatedApps"
      @update-custom-fields="getCustomFields">
    </custom-field>
    <!--新增/编辑自定义字段messageBox end  -->

    <!--选择关联应用messageBox begin  -->
    <relate-app
      v-if="view.selectRelatedAppShow"
      :relatedAppData="relatedApp"
      :relatedAppsData="relatedApps"
      :show.sync="view.selectRelatedAppShow"
      @selectApp="selectApp">
    </relate-app>
    <!--选择关联应用messageBox end  -->
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import CustomField from './../../common/CustomField.vue'
  import RelateApp from './../../common/RelateApp.vue'
  import CustomFieldList from './../../common/CustomFieldList.vue'
  export default {
    name: 'portalEdit',
    props: {
      isRoot: Boolean,
      relatedAppsData: Array,
      ctsData: Object,
      imgSrcRoot: String
    },
    data () {
      return {
        // 图片上传编辑项
        editItems: [],
        customFields: [],
        menuLink: '',
        fileList: {
          focus: [],
          selected: [],
          blur: []
        },
        // 图片预览参数
        previewData: {
          title: '',
          imgs: []
        },
        // 编辑自定义字段的内容
        customField: {
          title: '添加扩展字段',
          name: '',
          content: '',
          imgs: 0,
          fileList: [],
          link: ''
        },
        // 关联app参数
        relatedApp: {
          area: '福田区'
        },
        // app列表
        relatedApps: this.relatedAppsData,
        // 页面视图控制
        view: {
          addCustomShow: false, // 添加/编辑自定义字段
          selectRelatedAppShow: false, // 选择关联APP
          isNewCustom: true, // 是否是添加新字段
          isRootCts: this.isRoot // 是否选择的是根栏目
        },
        loading: false
      }
    },
    computed: {
      // 判断"自定义字段添加"是否至少有一项有内容
      submitNewCustomDis () {
        var data = this.customField
        return data.content || data.imgs || data.link
      }
    },
    watch: {
      ctsData: {
        immediate: true,
        handler (ctsData) {
          if (ctsData) {
            let root = this.imgSrcRoot
            this.editItems = [
              {
                name: this.isRoot ? 'Portal背景图' : '聚焦图片',
                previewSrc: ctsData.focus.length > 0 ? root + ctsData.focus[0] : '',
                fileList: [],
                info: '该背景图地址对应根菜单的focus参数',
                fileld: 'focus'
              },
              {
                name: this.isRoot ? '自定义图片' : '选中时图片',
                previewSrc: ctsData.selected.length > 0 ? root + ctsData.selected[0] : '',
                fileList: [],
                info: '该图片对应根菜单的selected参数',
                fileld: 'selected'
              },
              {
                name: this.isRoot ? 'LOGO图' : '失焦图片',
                previewSrc: ctsData.blur.length > 0 ? root + ctsData.blur[0] : '',
                fileList: [],
                info: 'LOGO地址对应根菜单的blur参数',
                fileld: 'blur'
              }
            ]
            this.menuLink = ctsData.url
            this.customFields = []
            this.getCustomFields()
          }
        }
      }
    },
    components: {
      CustomField,
      RelateApp,
      CustomFieldList
    },
    methods: {
      handleChange (file, fileList, item) {
        let url = ''
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        this.fileList[item.fileld] = fileList
        if (fileList.length > 0) {
          url = fileList[0].url
        }
        item.previewSrc = url
      },
      getCustomFields () {
        let params = {
          id: this.ctsData.id
        }
        this.loading = true
        this.axios.get(API.get_portal_menu_field, { params }).then((fields) => {
          let alias = []
          fields.forEach(function (field) {
            let fieldAlias = {
              id: field.id,
              type: '' + field.type,
              name: field.title,
              fileList: [],
              link: field.url,
              content: field.desc || field.key
            }
            field.src.forEach(function (img) {
              if (img) {
                fieldAlias.fileList.push({
                  name: '',
                  url: this.imgSrcRoot + img
                })
              }
            }, this)
            alias.push(fieldAlias)
          }, this)
          this.customFields = alias
          this.loading = false
        }).catch(() => {
          this.loading = false
          this.$message({
            message: '获取扩展字段列表失败!',
            type: 'error'
          })
        })
      },
      handlePreview (file) {
        console.log(file)
      },
      modify () {
        this.$emit('modify')
      },
      submitCts () {
        let params = new FormData()
        params.append('id', this.ctsData.id)
        params.append('url', this.menuLink || '')
        for (var key in this.fileList) {
          if (this.fileList.hasOwnProperty(key)) {
            var files = this.fileList[key]
            if (files.length > 0) {
              let blob = new Blob([files[0].raw])
              params.append(key + 'Img', blob, files[0].name)
            }
          }
        }
        this.axios.post(API.update_portal_menu_info, params).then(() => {
          this.$emit('noModify')
          this.$emit('update-portal-menu')
          this.$message({
            message: '修改节点信息成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '修改节点信息失败!',
            type: 'error'
          })
        })
      },
      // TODO 现在大图的src是写死的，需要看接口怎么返回
      showPreview (title, thumb) {
      },
      newCustomField () {
        this.view.isNewCustom = true
        this.view.addCustomShow = true
      },
      editCustomField (fieldData) {
        this.customField = fieldData
        this.view.isNewCustom = false
        this.view.addCustomShow = true
      },
      showSelectRelatedApp () {
        this.view.selectRelatedAppShow = true
      },
      selectApp (link) {
        this.menuLink = link
      }
    }
  }
</script>
<style scoped>
  .edit-construction-title{
    height: 48px;
    line-height: 48px;
    text-align: center;
    font-size: 14px;
    border-bottom: thin solid #d3dce6;
    background-color: #eff2f7;
    color: #1f2d3d;
  }
  .row-name{
    color: #7b828c;
  }
  .edit-construction-content{
    height: 500px;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 14px;
    box-sizing: border-box;
  }
  .edit-construction-btn{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .thumb{
    height: 60px;
    margin-right: 5px;
  }
  .icon-arrows_remove{
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 40px;
    transition: all .5s;
  }
  .icon-arrows_remove:hover{
    cursor: pointer;
    transform: rotate(180deg);
  }
</style>
<style>
  .portal-edit .el-upload-list,.portal-edit  .el-upload{
    float: left;
  }
  .portal-edit .upload-wp{
    height: 60px;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .portal-edit .edit-construction-content .el-row{
    height: 60px;
    margin: 4px 0;
  }
  .portal-edit .el-upload-list__item{
    margin-top: 0px;
  }
  .portal-edit .el-upload-list__item-name{
    width: 90px;
    margin-right: 20px;
  }
</style>
