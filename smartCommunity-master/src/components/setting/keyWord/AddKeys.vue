<template>
  <div class="add-key" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">{{isNew?'添加关键词':'编辑关键词'}}</div>
      <div class="add-key-content">
        <el-col :span="4">关键词</el-col>
        <el-col :span="20">
          <el-row v-for="(key,index) in keys" :key="key.label">
            <el-col :span="12"><el-input v-model="key.label"></el-input></el-col>
            <el-col :span="2" :offset="1" class="align-center">
              <i 
                @click="keys.push({label:''})"
                v-if="index == keys.length - 1 && isNew"
                class="ipanel-icon1 ipanel-icon-new whitebg"></i>
            </el-col>
          </el-row>
        </el-col>
      </div>
      <div class="popup-btn">
        <el-button type="primary" :disabled="!submitDis">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  export default {
    name: 'addKeys',
    props: {
      show: {
        type: Boolean
      },
      isNew: {
        type: Boolean
      },
      curKey: {
        type: Object
      },
      areas: {
        type: Array
      }
    },
    data () {
      return {
        keys: []
      }
    },
    watch: {
      curKey: {
        immediate: true,
        handler (curKey) {
          if (!this.isNew) {
            this.keys = [curKey]
          }
        }
      },
      isNew: {
        immediate: true,
        handler (isNew) {
          if (isNew) {
            this.keys = [
              {
                label: ''
              }
            ]
          } else {
            this.keys = [this.curKey]
          }
        }
      }
    },
    computed: {
      submitDis () {
        return false
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 590px;
    height: 522px;
    top: calc(50% - 285px);
    left: calc(50% - 261px);
  }
  .add-key-content{
    height: 380px;
    padding: 20px 40px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .add-key-content .el-row{
    padding-bottom: 20px;
  }
  .popup-btn{
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .custom-type{
    color: #7b828c;
    text-align: right;
  }
  .el-form-item{
    margin-bottom: 15px;
  }
.align-center{
  height: 36px;
  line-height: 44px;
}
</style>
