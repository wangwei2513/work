<template>
  <div class="manager-list">

    <!-- 操作按钮begin -->
    <div class="manager-list-btns">
      <el-col :span="12">
        <el-button @click="newManager" v-if="userRightList.includes('addSysUser')" type="primary" class="top-operate"><i class="ipanel-icon1 ipanel-icon-new"></i>添加</el-button>
        <el-button @click="editManager" v-if="userRightList.includes('editSysUser')" :disabled="selection.length !== 1 || selection[0].adminType == 1" type="primary" class="top-operate"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
        <el-button @click="confirmDel" v-if="userRightList.includes('delSysUser')" :disabled="selection.length === 0 || selection[0].adminType == 1" type="primary" class="top-operate"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
        <el-button @click="rightSetting" v-if="userRightList.includes('assignRoleToSysUser')" :disabled="selection.length !== 1 || selection[0].adminType == 2 || selection[0].adminType == 1" type="primary" class="top-operate"><i class="ipanel-icon2 ipanel-icon-right"></i>权限设置</el-button>
        <el-button @click="$emit('role-setting', selection[0])" v-if="userRightList.includes('role')" type="primary" class="top-operate"><i class="ipanel-icon2 ipanel-icon-role"></i>角色管理</el-button>
      </el-col>
      <el-col :span="3" v-if="listSysUsers">
        <area-cascader
          lazy
          :load="loadArea"
          :areas="areas"
          :mulitiple="false"
          :area-props="{label:'name',children:'children'}"
          :default-expanded-keys="initExpand"
          :selected-area="filter.areaId"
          @check-area="updateManagerList">
        </area-cascader>
      </el-col>
      <el-col :span="2" v-if="listSysUsers" class="lh36gray">分类查看</el-col>
      <el-col :span="3" v-if="listSysUsers">
        <el-select v-model="filter.adminType" placeholder="请选择角色">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(val, key) in managerTypeMap"
            v-if="key != 1"
            :key="key"
            :label="val"
            :value="key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-input 
          v-if="listSysUsers"
          :value="filter.userName"
          @change="(val) => {filter.userName = val}"
          prefix-icon="el-icon-search"
          placeholder="请输入关键词">
          <i slot="suffix" @click="filter.userName = ''" v-show="filter.userName !== ''" class="el-input__icon el-icon-circle-close"></i>
        </el-input>
      </el-col>
    </div>
    <!-- 操作按钮end -->

    <!-- 管理员列表begin -->
    <div class="manager-list-table">
      <el-table
        :data="managers"
        :height="497"
        border
        @selection-change="handleChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="80">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          label="管理员类型"
          width="180">
          <template slot-scope="scope">
            <span>{{managerTypeMap[scope.row.adminType]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="所属区域"
          width="300">
        </el-table-column>
        <el-table-column
          label="最近登录时间">
          <template slot-scope="scope">{{scope.row.loginTime||'--'}}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 管理员列表end -->

    <!-- 编辑管理员用户begin -->
    <edit-manager
      :areas="areas"
      :show.sync="view.editManagerShow"
      :curManager="selection[0]"
      :cur-admin-type="curAdminType"
      @update-managers="getManagerList">
    </edit-manager>
    <!-- 编辑管理员用户end -->

    <!-- 新建管理员用户begin -->
    <new-manager
      :areas="areas"
      :show.sync="view.newManagerShow"
      :cur-admin-type="curAdminType"
      @finish-add-managers="finishAddManager">
    </new-manager>
    <!-- 新建管理员用户end -->

    <!-- 管理员权限设置begin -->
    <right-setting
      :show.sync="view.rightSettingShow"
      :roleList="roleList"
      :rightTree="rightTree"
      :curManager="selection[0]"
      :areas="areas"
      :init-view="rightSettingView"
      @update-managers="getManagerList">
    </right-setting>
    <!-- 管理员权限设置end -->
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import util from './../../../assets/js/util'
import loadAreaMixin from './../../../assets/js/loadAreaMixin'
import EditManager from './EditManager'
import NewManager from './NewManager'
import RightSetting from './RightSetting'
import AreaCascader from './../../common/AreaCascader'
export default {
  name: 'managerList',
  mixins: [loadAreaMixin],
  props: {
    areas: {
      type: Array
    },
    rightTree: {
      type: Array
    },
    roleList: {
      type: Array
    },
    userRightList: {
      type: Array
    },
    curAdminType: [Number, String]
  },
  data () {
    return {
      managers: [],
      managersCopy: [],
      selection: [],
      managerTypeMap: util.managerTypeMap,
      filter: {
        areaId: '',
        adminType: '',
        userName: ''
      },
      view: {
        editManagerShow: false,
        newManagerShow: false,
        rightSettingShow: false,
        isNew: true
      },
      rightSettingView: ''
    }
  },
  watch: {
    filter: {
      deep: true,
      handler () {
        this.getManagerList()
      }
    },
    areas: {
      immediate: true,
      handler (areas) {
        if (areas && areas.length > 0) {
          this.filter.areaId = areas[0].id
        }
      }
    }
  },
  computed: {
    listSysUsers () {
      return this.userRightList.includes('listSysUsers')
    }
  },
  components: {
    EditManager,
    NewManager,
    RightSetting,
    AreaCascader
  },
  methods: {
    getManagerList () {
      let { areaId, userName, adminType } = this.filter
      let params = {
        page: 1,
        size: 999
      }
      userName && (params.userName = userName)
      adminType && (params.adminType = adminType)
      areaId && (params.areaId = areaId)

      this.axios.get(API.get_manager_list, { params }).then((data) => {
        this.managers = data.rows
        this.managersCopy = data.rows
      }).catch(() => {
        this.managers = []
        this.managersCopy = []
        this.$message({
          message: '获取管理员列表失败!',
          type: 'error'
        })
      })
    },
    handleChange (selection) {
      this.selection = selection
    },
    newManager () {
      this.view.newManagerShow = true
    },
    editManager () {
      this.view.editManagerShow = true
    },
    confirmDel () {
      var managers = []
      var ids = []
      this.selection.forEach(function (manager) {
        managers.push('"' + manager.userName + '"')
        ids.push(manager.id)
      }, this)
      
      this.$confirm('确认删除管理员:' + managers.join('，') + '?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.delManagers(ids.join(',')).then(() => {
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
    delManagers (ids) {
      return this.axios.delete(API.del_manager, { params: { ids } }).then(() => {
        this.getManagerList()
        this.$message({
          message: '删除成功!',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: '删除失败!',
          type: 'error'
        })
      })
    },
    finishAddManager (data) {
      this.getManagerList()
      if ('' + data.adminType === '3') {
        data = Object.assign({}, data)
        data.roles = []
        data.apps = []
        this.selection = [data]
        this.rightSettingView = 'edit'
        this.rightSetting()
      }
    },
    rightSetting () {
      this.view.rightSettingShow = true
    },
    updateManagerList (val) {
      this.filter.areaId = val[val.length - 1]
    }
  }
}
</script>
<style scoped>
.lh36gray{
  line-height: 36px;
  font-size: 14px;
  color: #7b828c;
  text-align: right;
  padding-right: 10px;
}
.manager-list-btns{
  overflow: hidden;
}
.el-table{
  margin-top: 10px;
}
</style>
<style>
.manager-list-btns .el-button span{
  display: flex;
  align-items: center;
}
</style>

