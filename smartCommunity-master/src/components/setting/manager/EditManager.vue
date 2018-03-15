<template>
  <div class="edit-manager" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">编辑管理员</div>
      <div class="edit-manager-content">
        <el-form label-width="100px" :model="manager">
          <el-form-item label="管理员类型">
            <el-col :span="12">
              <el-select v-model="manager.adminType" placeholder="请选择角色">
                <el-option
                  v-for="(val, key) in managerTypeMap"
                  :key="key"
                  :label="val"
                  :value="key">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="用户名">
            <el-col :span="12">
              {{manager.userName}}
            </el-col>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-col :span="12" v-if="!isSelect">
              {{manager.areaName}}
            </el-col>
            <el-col :span="12" v-if="!isSelect">
              <el-button @click="reselectArea" size="small">重新选择</el-button>
            </el-col>
            <el-col :span="12" v-else>
              <area-cascader
                lazy
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :area-props="{label:'name',children:'children'}"
                :default-expanded-keys="initExpand"
                :selected-area="manager.areaId"
                @check-area="changeArea">
              </area-cascader>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btn">
        <el-button @click="submit" type="primary" :disabled="!submitDis" :loading="submiting">提交</el-button>
        <el-button @click="confirmResetPassword">重置密码</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  import CountInput from './../../common/CountInput.vue'
  import AreaCascader from './../../common/AreaCascader.vue'
  export default {
    name: 'editManager',
    mixins: [loadAreaMixin],
    props: {
      show: {
        type: Boolean
      },
      curManager: {
        type: Object
      },
      areas: {
        type: Array
      },
      curAdminType: [Number, String]
    },
    data () {
      return {
        manager: {
          userName: '',
          areaNames: '',
          adminType: '',
          areaId: ''
        },
        submiting: false,
        isSelect: false
      }
    },
    watch: {
      curManager: {
        immediate: true,
        handler (curManager) {
          if (curManager) {
            curManager.areaNames !== '' && (this.isSelect = false)
            Object.assign(this.manager, curManager)
          }
        }
      }
    },
    components: {
      CountInput,
      AreaCascader
    },
    computed: {
      submitDis () {
        var manager = this.manager
        let valid = true
        if (!(manager.userName && manager.adminType !== '')) {
          valid = false
        }
        if (this.isSelect) {
          if (manager.areaId.length === 0) {
            valid = false
          }
        }
        return valid
      },
      managerTypeMap () {
        var map = {}
        if ('' + this.curAdminType === '1') {
          map = {
            2: '区域管理员',
            3: '普通管理员'
          }
        } else if ('' + this.curAdminType === '2') {
          map = {
            2: '区域管理员',
            3: '普通管理员'
          }
        } else {
          map = {
            3: '普通管理员'
          }
        }
        return map
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.isSelect = false
        this.manager.areaId = ''
      },
      changeArea (areaId) {
        this.manager.areaId = areaId
      },
      reselectArea () {
        this.isSelect = true
        this.manager.areaId = ''
      },
      submit () {
        let { id, areaId: areaIds, adminType, userName } = this.manager
        var data = {
          id,
          areaIds,
          adminType,
          userName
        }
        this.submiting = true
        this.axios.put(API.edit_manager, data).then(() => {
          this.close()
          this.$emit('update-managers')
          this.$message({
            message: '编辑管理员成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '编辑管理员失败!',
            type: 'error'
          })
        })
      },
      confirmResetPassword () {
        this.$confirm('确认将密码设置为初始值?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this.resetPassword().then(() => {
                instance.confirmButtonLoading = false
                done()
              })
            } else {
              instance.confirmButtonLoading = false
              done()
            }
          }
        }).catch(() => {})
      },
      resetPassword () {
        let params = new URLSearchParams()
        params.append('id', this.curManager.id)
        return this.axios.patch(API.update_password, params).then(() => {
          this.$message({
            message: '重置密码成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '重置密码失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    height: 522px;
    width: 590px;
    top: calc(50% - 261px);
    left: calc(50% - 285px);
  }
  .edit-manager-content{
    height: 380px;
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .edit-manager-content .el-row{
    padding: 20px 0;
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
    margin-bottom: 20px;
  }
</style>
