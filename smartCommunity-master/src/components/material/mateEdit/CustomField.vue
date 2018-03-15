<template>
  <div class="edit-item-addCustom" v-if="show">
    <div class="popup-box">
      <h2 class="popup-header">{{isNew?'添加扩展字段':'编辑扩展字段'}}</h2>
      <i class="iconfont icon-arrows_remove" title="关闭" @click="closeNewCustom()"></i>
      <div class="addCustom-header">{{customField.title}}</div>
      <div class="addCustom-content">
        <el-row>
          <el-col class="custom-type" :span="4">扩展字段名</el-col>
          <el-col :span="10" :offset="1">
            <count-input
              v-model="customField.name"
              :total="15"
              regType="w"
              placeholder="请输入扩展字段名">
            </count-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="custom-type" :span="4">内容</el-col>
          <el-col :span="10" :offset="1">
            <el-input v-model="customField.content" type="textarea" :rows="4" placeholder="请输入内容" resize="none"></el-input>
          </el-col>
          <el-col :span="6" :offset="1"><el-button size="small" @click="showSelectRelatedApp">关联应用</el-button></el-col>
        </el-row>
      </div>
      <div class="addCustom-btn">
        <el-button type="primary" :disabled="!submitNewCustomDis" @click="handleCustomSubmit">确认</el-button>
        <el-button v-show="!isNew" type="danger" @click="delCustomField">删除</el-button>
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
  import RelateApp from './../../common/RelateApp.vue'
  import CountInput from './../../common/CountInput.vue'
  export default {
    name: 'customField',
    props: {
      show: Boolean,
      isNew: Boolean,
      customFieldData: Object,
      relatedAppsData: Array
    },
    data () {
      return {
        relatedApp: {
          area: '天河'
        },
        customField: {
          name: '',
          content: ''
        },
        initFields: ['预选字段1', '预选字段2'],
        view: {
          selectRelatedAppShow: false
        }
      }
    },
    components: {
      CountInput,
      RelateApp
    },
    watch: {
      show: {
        immediate: true,
        handler (show) {
          $('body').css('overflow', show ? 'hidden' : 'auto')
          if (show) {
            if (this.isNew) {
              this.customField = {
                name: '',
                content: ''
              }
            } else {
              Object.assign(this.customField, this.customFieldData)
            }
          }
        }
      }
    },
    computed: {
      // 判断"自定义字段添加"是否至少有一项有内容
      submitNewCustomDis () {
        var data = this.customField
        return data.name && data.content
      }
    },
    methods: {
      submitNewCustom () {
        var data = this.customField
        if (data.name && data.content) {
          this.$emit('addNewCustom', {
            name: data.name,
            content: data.content
          })
          this.closeNewCustom()
          this.$emit('modify')
        } else {
          this.$message({
            message: '需要至少设置一个项目！',
            type: 'warning'
          })
        }
      },
      closeNewCustom () {
        this.$emit('update:show', false)
        this.$emit('closeNewCustom')
      },
      delCustomField () {
        this.$confirm('确定删除此扩展字段吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('delCustomField', this.customField)
          this.closeNewCustom()
        }).catch(() => {})
      },
      handleCustomSubmit () {
        if (this.isNew) {
          this.submitNewCustom()
        } else {
          this.editOldCustom()
        }
      },
      editOldCustom () {
        this.$emit('editOldCustom', this.customField)
        this.closeNewCustom()
      },
      showSelectRelatedApp () {
        this.view.selectRelatedAppShow = true
      },
      selectApp (link) {
        this.customField.content = link
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    height: 440px;
    width: 590px;
    top: calc(50% - 220px);
    left: calc(50% - 285px);
  }
  .addCustom-header{
    color:#1f2d3d;
    font-weight: bold;
    padding-bottom: 20px; 
  }
  .addCustom-content{
    height: 280px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .addCustom-content .el-row{
    padding: 20px 0;
  }
  .addCustom-btn{
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .custom-type{
    padding: 2px;
    color: #7b828c;
    text-align: right;
  }
</style>
