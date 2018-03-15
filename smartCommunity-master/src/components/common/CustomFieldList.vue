<template>
  <div class="custom-field-list">
    <el-row class="custom-field" type="flex" align="middle" v-for="field in customFields" :key="field.name">
      <el-col
        :span="4"
        class="row-name"
        :title="field.name">
        {{field.name}}
      </el-col>
      <el-col
        v-if="field.content!==''"
        :span="4"
        class="custom-field-content margin-right">
        <span :title="field.content">{{field.content}}</span>
      </el-col>
      <el-col
        v-if="field.fileList && field.fileList.length !== 0"
        :span="7"
        class="custom-field-img margin-right">
        <img class="thumb" :src="img.url" alt="" v-for="(img,index) in field.fileList" @click="showPreview('',img.url)" :key="index">
      </el-col>
      <el-col
        v-if="field.link!==''"
        :span="4"
        class="custom-field-link">
        <span :title="field.link">{{field.link}}</span>
      </el-col>
      <el-col :span="1" v-if="_editable">
        <i class="ipanel-icon1 ipanel-icon-edit  whitebg" @click="editCustomField(field)"></i>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'customFieldList',
    props: {
      customFields: Array,
      editable: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      _editable () {
        console.log(this.editable)
        return typeof this.editable === 'undefined' ? true : this.editable
      }
    },
    methods: {
      editCustomField (field) {
        this.$emit('editCustomField', field)
      }
    }
  }
</script>
<style scoped>
  .ipanel-icon-edit:hover{
    cursor: pointer;
  }
  .custom-field-list{
    font-size: 14px;
  }
  .custom-field-img{
    height: 60px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .custom-field-img img{
    vertical-align: top;
  }
  .custom-field-content span{
    max-height: 56px;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 14px;
    word-break: keep-all;
  }
  .thumb{
    height: 60px;
    margin-right: 5px;
  }
  .row-name{
    color: #7b828c;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 16px;
    line-height: 16px
  }
</style>
<style>
   .custom-field .el-col.margin-right{
    margin-right: 8.3%;
  } 
  .custom-field-content, .custom-field-link{
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 16px;
  }
</style>