<template>
  <div class="edit-role" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">{{isNew?'添加角色':'编辑角色'}}</div>
      <div class="edit-role-content">
        <el-form label-width="100px" :model="role">
          <el-form-item label="角色名称">
            <el-col :span="12">
              <count-input
                v-model="role.roleName"
                :total="20"
                regType="cn"
                placeholder="请输入角色名称">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="操作权限">
            <el-col :span="24" class="edit-role-right-list-wp">
              <el-tree
                ref="rightSelect"
                node-key="id"
                show-checkbox
                check-strictly
                :data="rightTree"
                :props="{ label: 'label', children: 'children'}"
                :default-expanded-keys="[]"
                :render-content="renderContent"
                :default-checked-keys="defaultCheckedKeys"
                @check-change="rightChange">
              </el-tree>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btn">
        <el-button @click="submit" type="primary" :disabled="!submitDis">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import API from './../../../assets/js/api'
  import CountInput from './../../common/CountInput.vue'
  export default {
    name: 'editRole',
    props: {
      show: {
        type: Boolean
      },
      isNew: {
        type: Boolean
      },
      curRole: {
        type: Object
      },
      rightTree: {
        type: Array
      }
    },
    data () {
      return {
        role: {
          roleName: '',
          resources: []
        }
      }
    },
    components: {
      CountInput
    },
    computed: {
      defaultCheckedKeys () {
        var ids = []
        var rightInfos = this.role.resources
        Array.isArray(rightInfos) && rightInfos.forEach(function (right) {
          ids.push(right.id)
        })
        return ids
      },
      submitDis () {
        let role = this.role
        return !!(role.roleName && role.resources.length > 0)
      }
    },
    watch: {
      curRole: {
        immediate: true,
        handler (curRole) {
          curRole && Object.assign(this.role, curRole)
        }
      },
      isNew: {
        handler (isNew) {
          isNew ? this.role = {
            roleName: '',
            resourceIds: '',
            resources: []
          } : this.role = Object.assign(this.role, this.curRole)
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.isNew && (this.role = {
          roleName: '',
          resourceIds: '',
          resources: []
        })
      },
      changeArea (area) {
        this.role.areaId = area
      },
      rightChange (node, checked) {
        if (checked) {
          this.$refs.rightSelect.setChecked(node.pId, true)
        } else {
          this.setChildrenChecked(node, false)
        }
        this.role.resources = this.$refs.rightSelect.getCheckedNodes()
      },
      setChildrenChecked (data, checked) {
        this.$refs.rightSelect.setChecked(data.id, checked)
        Array.isArray(data.children) && data.children.forEach(function (child) {
          this.$refs.rightSelect.setChecked(child.id, checked)
        }, this)
      },
      renderContent (h, {node, data}) {
        var self = this
        return h('span', null, [
          h('span', {
            style: {
              fontSize: '16px',
              verticalAlign: 'middle'
            },
            domProps: {
              innerHTML: data.label
            }
          }),
          h('span', {
            'class': {
              'iconfont': true,
              'icon-quanjuxuanzhong16': true
            },
            style: {
              display: Array.isArray(data.children) && data.children.length > 0 ? '' : 'none'
            },
            on: {
              click (e) {
                e.stopPropagation()
                self.setChildrenChecked(data, true)
              }
            },
            domProps: {
              title: '全选子节点'
            }
          }),
          h('span', {
            'class': {
              'iconfont': true,
              'icon-quxiaoquanxuan': true
            },
            style: {
              display: Array.isArray(data.children) && data.children.length > 0 ? '' : 'none'
            },
            on: {
              click (e) {
                e.stopPropagation()
                self.setChildrenChecked(data, false)
              }
            },
            domProps: {
              title: '全不选'
            }
          })
        ])
      },
      submit () {
        var self = this
        this.axios.get(API.check_role_exist, { params: {roleName: this.role.roleName, id: this.role.id} }).then(function () {
          var checkedNodes = self.$refs.rightSelect.getCheckedNodes()
          var resourceIds = []
          checkedNodes.forEach(function (node) {
            typeof node.id !== 'undefined' && resourceIds.push(node.id)
          })
          resourceIds = resourceIds.join(',')
          self.editManager(resourceIds, self.isNew)
        }).catch(function () {
          self.$message({
            message: '角色名查重失败!',
            type: 'error'
          })
        })
      },
      editManager (resourceIds, isNew) {
        var self = this
        var meta = isNew ? {
          data: {
            roleName: this.role.roleName,
            resourceIds: resourceIds
          },
          url: API.add_role,
          method: 'post',
          okMsg: '新增角色成功!',
          failMag: '新增角色失败!'
        } : {
          data: {
            roleName: this.role.roleName,
            resourceIds: resourceIds,
            id: this.role.id
          },
          url: API.edit_role,
          method: 'put',
          okMsg: '编辑角色成功!',
          failMag: '编辑角色失败!'
        }
        this.axios({
          method: meta.method,
          url: meta.url,
          data: meta.data
        }).then(function () {
          self.close()
          self.$emit('update-role-list')
          self.$message({
            message: meta.okMsg,
            type: 'success'
          })
        }).catch(function () {
          self.$message({
            message: meta.failMag,
            type: 'error'
          })
        })
      },
      recursiveOperate (arr, callback) {
        for (var i = 0; i < arr.length; i++) {
          var node = arr[i]
          const flag = callback(node, arr, i)
          if (flag) {
            return
          } else {
            if (Array.isArray(node.children)) {
              this.recursiveOperate(node.children, callback)
            }
          }
        }
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
  .edit-role-content{
    height: 380px;
    padding: 0 20px;
    overflow: hidden;
  }
  .edit-role-content .el-row{
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
  .edit-role-right-list-wp{
    max-height: 320px;
    overflow: auto;
    border: 1px solid #bfcbd9;
  }
  .el-tree{
    border: none;
  }
</style>
<style>
.edit-role .el-tree .iconfont{
  font-size: 16px;
  vertical-align: middle;
  line-height: 16px;
  margin-left: 10px;
}
.edit-role .el-tree-node:hover>.el-tree-node__content .icon-quanjuxuanzhong16, .edit-role .el-tree-node:hover>.el-tree-node__content .icon-quxiaoquanxuan{
  display: inline;
}
.edit-role .icon-quanjuxuanzhong16{
  color: #20A0FF;
  display: none;
}
.edit-role .icon-quanjuxuanzhong16:hover{
  color: #58B7FF;
}
.edit-role .icon-quxiaoquanxuan{
  color: #475669;
  display: none;
}
.edit-role .icon-quxiaoquanxuan:hover{
  color: #99A9BF;
}
</style>
