<template>
  <div class="select-related-app" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">选择关联应用</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="closeSelectRelatedApp()"></i>
      <div class="select-related-app-content">
        <el-row>
          <el-col :span="4" class="row-name">所属区域</el-col>
          <el-col :span="20">{{relatedApp.area}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="row-name">应用列表</el-col>
          <el-col :span="20">
          </el-col>
        </el-row>
      </div>
      <div class="select-related-app-btn">
        <el-button :disabled="relatedApp.link === ''" type="primary" @click="selecteRelatedAppOk">确认</el-button>
        <el-button @click="selecteRelatedAppCancel">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  export default {
    name: 'relateApp',
    props: {
      show: Boolean,
      relatedAppData: Object,
      relatedAppsData: Array
    },
    data () {
      return {
        relatedApp: this.relatedAppData,
        link: ''
      }
    },
    computed: {
      relatedApps () {
        return this.relatedAppsData
      }
    },
    methods: {
      closeSelectRelatedApp () {
        this.$emit('update:show', false)
      },
      selecteRelatedAppOk () {
        this.$emit('selectApp', this.link)
        this.closeSelectRelatedApp()
      },
      selecteRelatedAppCancel () {
        this.closeSelectRelatedApp()
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 590px;
    height: 522px;
    left: calc(50% - 285px);
    top: calc(50% - 261px);
    z-index: 1012;
  }
  .popup-cover{
    z-index: 1011;
  }
  .select-related-app-btn{
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .select-related-app-content .el-radio-group .el-radio{
    display: inline-block;
    width: 120px;
    overflow: hidden;
    margin: 0 0 10px 0;
    text-overflow: ellipsis;
  }
  .select-related-app-content{
    height: 380px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .select-related-app-content .el-row{
    padding: 20px 0;
  }
</style>
