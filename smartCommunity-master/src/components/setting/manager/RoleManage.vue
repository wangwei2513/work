<template>
  <div class="role-manage">
    <div class="role-manage-btns">
      <el-button @click="newRole" class="top-operate" type="primary"><i class="ipanel-icon1 ipanel-icon-new"></i>添加</el-button>
      <el-button @click="editRole" :disabled="selection.length !== 1" class="top-operate" type="primary"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
      <el-button @click="confirmDel" :disabled="selection.length === 0" class="top-operate" type="primary"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
    </div>
    <div class="role-manage-table">
      <el-table
        :data="roleList"
        :height="501"
        border
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作权限">
          <template slot-scope="scope">
            <div v-if="Object.keys(scope.row.rightName).length>0">
              <div v-for="(value,key,index) in scope.row.rightName" :key="index" class="right-row">
                <span class="right-p">{{key}}</span>:<span v-if="value.length > 0"><span v-for="item in value" :key="item" class="right-c">{{item}}</span></span>
                <span v-else class="right-c">无</span>
              </div>
            </div>
            <div v-else class="right-row">无</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <edit-role
      :isNew="view.isNew"
      :show.sync="view.editRoleShow"
      :rightTree="rightTree"
      :curRole="selection[0]"
      @update-role-list="$emit('update-role-list')"></edit-role>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import EditRole from './EditRole'
export default {
  name: 'roleManage',
  props: {
    rightTree: {
      type: Array
    },
    roleList: {
      type: Array
    }
  },
  data () {
    return {
      selection: [],
      view: {
        isNew: false,
        editRoleShow: false
      }
    }
  },
  components: {
    EditRole
  },
  watch: {
    roleList: {
      immediate: true,
      handler () {
        this.getRightName(this.roleList)
      }
    }
  },
  methods: {
    handleSelectionChange (selection) {
      this.selection = selection
    },
    getRightName (roleList) {
      roleList.forEach(function (role) {
        var rightName = {}
        var rightInfos = role.resources
        if (Array.isArray(rightInfos) && rightInfos.length > 0) {
          rightInfos.forEach(function (right) {
            if (right && right.pId === 0) {
              rightName[right.resourceName] = []
              var pid = right.id
              rightInfos.forEach(function (ele) {
                ele.pId === pid && (rightName[right.resourceName].push(ele.resourceName))
              }, this)
            }
          }, this)
        }
        role.rightName = rightName
      }, this)
    },
    newRole () {
      this.view.isNew = true
      this.view.editRoleShow = true
    },
    editRole () {
      this.view.isNew = false
      this.view.editRoleShow = true
    },
    confirmDel () {
      var roles = []
      var ids = []
      var self = this
      this.selection.forEach(function (role) {
        roles.push('“' + role.roleName + '”')
        ids.push(role.id)
      }, this)
      this.$confirm('角色删除后，已分配该角色的用户将失去从该角色获取的操作权限。是否确认删除角色：' + roles.join('，') + '?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.delRoles(ids.join(','))
      }).catch(() => {})
    },
    delRoles (ids) {
      var self = this
      this.axios.delete(API.del_role, { params: { ids } }).then(function () {
        self.$emit('update-role-list')
        self.$message({
          message: '删除成功!',
          type: 'success'
        })
      }).catch(function () {
        self.$message({
          message: '删除失败!',
          type: 'error'
        })
      })
    }
  },
  created () {
  }
}
</script>
<style scoped>
.role-manage-table{
  margin-top: 10px;
}
.right-p{
  font-weight: bold;
}
.right-c{
  margin: 0 10px;
}
.right-row{
  margin: 10px 0;
}
</style>
<style>
.role-manage-btns .el-button span{
  display: flex;
  align-items: center;
}
.role-manage-table td{
  vertical-align: text-top
}
</style>
