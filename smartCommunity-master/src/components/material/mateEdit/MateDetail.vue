<template>
  <div class="mate-detail">
      <el-form ref="mate" :model="mate" label-width="80px">
        <el-form-item label="素材标题">
          <el-col :span="6">
            {{mate.title}}
          </el-col>
        </el-form-item>
        <el-form-item label="标题拼音">
          <el-col :span="6">
            {{mate.titleEnName}}
          </el-col>
        </el-form-item>
        <el-form-item label="副标题">
          <el-col :span="6">
            {{mate.subTitle || '无'}}
          </el-col>
        </el-form-item>
        <el-form-item label="简介">
          <el-col :span="12">
            {{mate.description || '无'}}
          </el-col>
        </el-form-item>
        <el-form-item label="日期">
          <el-col :span="6">
            {{mate.entryDate || '无'}}
          </el-col>
        </el-form-item>
        <el-form-item label="海报图片">
          <img v-if="mate.entryPoster && mate.entryPoster.imageUrl" style="max-height: 100px;" :src="mate.entryPoster && mate.entryPoster.imageUrl || ''" :title="mate.entryPoster && mate.entryPoster.imageName">
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="正文内容">
          <el-col :span="24" class="mate-content">
            <ori-html v-if="mate.content" :value="mate.content" class="mate-content-wp"></ori-html>
            <span v-else>无</span>
          </el-col>
        </el-form-item>
        <el-form-item label="相册图集">
          <el-col :span="24" v-if="mate.albums && mate.albums.length > 0">
            <img class="alubms" :src="img && img.imageUrl" :title="img && img.imageName" v-for="(img,index) in mate.albums" :key="index">
          </el-col>
          <el-col v-else>
            无
          </el-col>
        </el-form-item>
        <el-form-item label="外跳链接">
          <el-col :span="12">
            {{mate.linkUrl || '无'}}
          </el-col>
        </el-form-item>
        <el-form-item label="视频文件">
          <el-col :span="6">
            <el-button size="small" v-if="mate.video">预览视频</el-button>
            <span v-else>无</span>
          </el-col>
        </el-form-item>
        <el-form-item label="背景音乐">
          <el-col :span="6">
            <el-button size="small" v-if="mate.backgroundMusic">试听</el-button>
            <span v-else>无</span>
          </el-col>
        </el-form-item>
        <custom-field-list
          class="custom-field-list"
          @editCustomField="editCustomField"
          :editable="false"
          :customFields="mate.extendFields">
        </custom-field-list>
        <el-form-item label="关联栏目" v-if="mate.nodes && mate.nodes.length > 0">
          <el-row v-for="(col,index) in mate.nodes" :key="index">
            <el-col :span="12">
              <span class="relate-column-text">
                {{col.appName + ' - ' + col.title}}
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="关联栏目" v-else>
          <el-col :span="12">无</el-col>
        </el-form-item>
      </el-form>
      <el-row v-if="isCheck">
        <el-col :span="1" :offset="10"><el-button :disabled="mate.entryStatus !== 2" @click="$emit('pass',[mate])" type="primary">通过</el-button></el-col>
        <el-col :span="1" :offset="1"><el-button :disabled="mate.entryStatus !== 2" @click="$emit('reject',[mate])">驳回</el-button></el-col>
      </el-row>
      <el-row v-else>
        <el-col :span="1" :offset="10"><el-button type="primary" @click="$emit('edit-mate', mateId)">编辑</el-button></el-col>
        <el-col :span="1" :offset="1"><el-button @click="$emit('close-current')">关闭</el-button></el-col>
      </el-row>
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import CustomFieldList from './../../common/CustomFieldList.vue'
  import OriHtml from './OriHtml.vue'
  export default {
    name: 'mateDetail',
    props: {
      isCheck: {
        type: Boolean
      },
      mateData: {
        type: Object,
        required: true
      },
      updateList: {
        type: Boolean
      }
    },
    data () {
      return {
        mate: {
          title: '',
          subTitle: '',
          description: '',
          content: '',
          entryDate: '',
          entryPoster: [],
          albums: [],
          isLocalVideo: 1,
          isLocalAudio: 1,
          video: [],
          audio: [],
          videoSrc: '',
          audioSrc: '',
          extendFields: [],
          nodes: []
        }
      }
    },
    components: {
      CustomFieldList,
      OriHtml
    },
    computed: {
      mateId () {
        return this.$route.params.id
      }
    },
    watch: {
      updateList: {
        immediate: true,
        handler (updateList) {
          if (updateList) {
            this.getMateDetail()
          }
        }
      }
    },
    methods: {
      getMateDetail () {
        this.axios.get(API.get_entry_info, { params: { id: this.mateId } }).then((data) => {
          data.extendFields = []
          data.extendfieldResps.forEach(function (extendField) {
            data.extendFields.push({
              id: extendField.id,
              name: extendField.fieldKey,
              content: extendField.fieldValue
            })
          }, this)
          this.mate = data
        }).catch(() => {
          this.$message({
            message: '获取素材详情失败!',
            type: 'error'
          })
        })
      }
    },
    activated () {
      this.getMateDetail()
    }
  }
</script>
<style scoped>
  .mate-detail{
    margin-bottom: 40px;
  }
  .custom-field-list{
    margin-bottom: 22px;
  }
  .ipanel-icon{
    cursor: pointer;
  }
  .alubms{
    width: auto;
    height: 100px;
    margin-right: 10px;
  }
  .mate-content-wp{
    padding: 10px;
    box-sizing: border-box;
    border: thin solid #ccc;
    border-radius: 4px;
    max-height: 600px;
    overflow: auto;
    width: 100%;
  }
</style>
<style>
  .mate-detail .ql-container .ql-editor {
    min-height: 20em;
    padding-bottom: 1em;
    max-height: 40em;
  }
  .mate-detail .el-form-item__label{
    color: #7b828c;
  }
  .mate-detail .custom-field .row-name{
    width: 80px;
    font-size: 14px;
    text-align: right;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
  }
</style>