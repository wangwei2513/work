<template>
  <div>
    <div class="input-wp">
      <el-button type="primary" :size="size" @click="selectFile">选择文件</el-button>
      <input type="file" v-show="false" :multiple="multiple" @change="changeFile">
    </div>
    <span v-if="fileList.length === 0" class="input-tip">未选择文件</span>
    <span v-else class="input-tip">
      <span v-for="(file, index) in fileList" :key="index">{{file.name}}</span>
    </span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'iUpload',
  props: {
    size: {
      type: String,
      default: 'small'
    },
    multiple: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    selectFile (e) {
      var fileInput = e.target.parentNode.nextElementSibling
      fileInput.click()
    },
    changeFile (e) {
      this.fileList = e.target.files
      this.$emit('change', e.target.files)
    }
  }
}
</script>
<style scoped>
.input-wp{
  float: left;
}
.input-tip{
  float: left;
  margin-left: 5px;
  font-size: 12px;
}
</style>
