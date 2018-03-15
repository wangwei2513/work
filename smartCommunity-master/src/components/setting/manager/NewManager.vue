<template>
  <div class="new-manager" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">添加管理员</div>
      <div class="new-manager-content">
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
              <count-input
                v-model="manager.userName"
                :total="20"
                regType="cn"
                placeholder="请输入用户名称"
                @blur="checkUnique">
              </count-input>
            </el-col>
            <el-col :span="9" :offset="3" class="error-info" v-show="userNameExist">用户名已存在!</el-col>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-col :span="12">
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
        <el-button @click="submit" type="primary" :disabled="submitDis" :loading="submiting">提交</el-button>
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
    name: 'addManager',
    mixins: [loadAreaMixin],
    props: {
      show: {
        type: Boolean
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
          roleId: '',
          adminType: '',
          areaId: ''
        },
        userNameExist: false,
        submiting: false
      }
    },
    components: {
      CountInput,
      AreaCascader
    },
    computed: {
      submitDis () {
        let manager = this.manager
        return !(manager.userName && manager.adminType !== '' && manager.areaId)
      },
      managerTypeMap () {
        var map = {}
        if ('' + this.curAdminType === '1') {
          map = {
            2: '区域管理员',
            3: '普通管理员'
          }
          this.manager.adminType = '2'
        } else if ('' + this.curAdminType === '2') {
          map = {
            2: '区域管理员',
            3: '普通管理员'
          }
          this.manager.adminType = '3'
        } else {
          map = {
            3: '普通管理员'
          }
          this.manager.adminType = '3'
        }
        return map
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.userNameExist = false
        this.manager = {
          userName: '',
          adminType: '',
          areaId: ''
        }
      },
      changeArea (area) {
        this.manager.areaId = area
      },
      checkUnique () {
        let userName = this.manager.userName
        userName !== '' && this.axios.get(API.check_manager_exist, { params: { userName } }).then(() => {
          this.userNameExist = false
        }).catch((error) => {
          if (error.code === '201') {
            this.userNameExist = true
          }
        })
      },
      submit () {
        this.userNameExist = false
        this.submiting = true
        this.axios.get(API.check_manager_exist, { params: {userName: this.manager.userName} }).then(() => {
          this.addManager()
        }).catch((error) => {
          if (error.code === '201') {
            this.userNameExist = true
          } else {
            this.$message({
              message: '用户名验重失败!',
              type: 'error'
            })
          }
          this.submiting = false
        })
      },
      addManager () {
        let { userName, areaId: areaIds, adminType } = this.manager
        var data = {
          userName,
          areaIds,
          adminType
        }
        this.axios.post(API.manager_sign_up, data).then((res) => {
          this.close()
          this.submiting = false
          data.id = res.id
          this.$emit('finish-add-managers', data)
          this.$message({
            message: '新增管理员成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '新增管理员失败!',
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
  .new-manager-content{
    height: 380px;
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .new-manager-content .el-row{
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
