<template>
  <div class="right-setting" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">{{manager.userName+' > 权限设置'}}</div>
      <div class="right-setting-content">
        <el-form label-width="100px" :model="manager">
          <div v-if="view === 'check'" class="right-setting-form">
            <label>角色</label>
            <div v-if="manager.roles && manager.roles.length > 0" class="role-selected-wp">
              <span
                v-for="role in manager.roles"
                :class="{'is-current': curRole == role.id}"
                :key="role.id"
                @click="curRole = curRole == role.id ? '' : role.id">
                {{role.roleName}}
              </span>
            </div>
            <div v-else class="role-selected-wp" style="line-height:32px;">无</div>
          </div>
          <el-form-item label="角色" v-if="view === 'edit'">
            <el-col :span="24">
              <el-select v-model="manager.roleIds" multiple placeholder="请选择角色">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="Portal权限">
            <el-col :span="24" v-if="view === 'check'">
              {{manager.type}}
            </el-col>
            <el-col :span="24" v-if="view === 'edit'">
              <el-select v-model="manager.portalIds" :disabled="!portalCtr" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in portalList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="应用权限">
            <el-col :span="24" v-if="view === 'check' && manager && manager.apps.length > 0">
              <el-tag size="mini" type="info" v-for="item in manager.apps" :key="item.id">{{item.appName}}</el-tag>
            </el-col>
            <el-col :span="24" v-if="view === 'check' && manager && manager.apps.length === 0">
              <span calss="placeholder">暂无分配应用权限</span>
            </el-col>
            <el-col :span="24" v-if="view === 'edit'">
              <el-select v-model="manager.appIds" :disabled="!appCtr" multiple filterable placeholder="请选择">
                <el-option
                  v-for="item in appList"
                  :key="item.id"
                  :label="item.appName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="权限查看">
            <div class="role-selected-wp" v-if="view === 'edit' && manager.roleIds.length > 0">
              <span
                v-for="roleId in manager.roleIds"
                :class="{'is-current': curRole == roleId}"
                :key="roleId"
                @click="curRole = curRole == roleId ? '' : roleId">
                {{roleNameMap[roleId]}}
              </span>
            </div>
            <el-col :span="16" v-if="curRole" class="el-tree-wp i-scollbar">
              <el-tree
                ref="rightChcek"
                :data="curRightTree"
                :props="treeProps"
                node-key="id">
              </el-tree>
            </el-col>
            <el-col :span="24" v-else class="placeholder">{{manager.roleIds.length>0 || manager.roles.length>0?'请选择以上角色以查看权限':'请先选择角色'}}</el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btn">
        <el-button type="primary" v-if="view === 'check'" @click="changeToEdit">修改</el-button>
        <el-button type="primary" v-if="view === 'edit'" :loading="submiting" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import util from './../../../assets/js/util.js'
  import API from './../../../assets/js/api.js'
  export default {
    name: 'rightSetting',
    props: {
      show: {
        type: Boolean
      },
      curManager: {
        type: Object
      },
      roleList: {
        type: Array
      },
      areas: {
        type: Array
      },
      initView: String
    },
    data () {
      return {
        manager: {
          roleIds: [],
          appIds: [],
          portalIds: []
        },
        curRole: '',
        curRightTree: [],
        appList: [],
        portalList: [],
        treeProps: {
          label: 'label',
          children: 'children'
        },
        portalCtr: false,
        appCtr: false,
        view: 'check',
        submiting: false
      }
    },
    watch: {
      curManager: {
        immediate: true,
        handler (curManager) {
          if (curManager) {
            Object.assign(this.manager, curManager)
            if (Array.isArray(curManager.apps)) {
              this.manager.appIds = curManager.apps.map(function (app) {
                return app.id
              }, this)
            }
          }
        }
      },
      initView: {
        handler (view) {
          if (view) {
            this.view = view
          }
        }
      },
      'manager.roleIds': {
        handler (newVal) {
          let portalCtrRouters = ['portal']
          let appCtrRouters = ['app', 'module', 'entry']
          this.portalCtr = false
          this.appCtr = false
          this.roleList.forEach(function (role) {
            if (newVal.includes(role.id)) {
              let resources = role.resources
              resources.some((resource) => {
                if (portalCtrRouters.includes(resource.resourceEnName)) {
                  this.portalCtr = true
                }
                if (appCtrRouters.includes(resource.resourceEnName)) {
                  this.appCtr = true
                }
                return this.appCtr && this.portalCtr
              }, this)
            }
          }, this)
        }
      },
      curRole: {
        handler (newRole) {
          for (let i = 0; i < this.roleList.length; i++) {
            let role = this.roleList[i]
            if (role.id === newRole) {
              let resources = $.extend(true, [], role.resources)
              resources.unshift({
                resourceName: '全部',
                id: 0
              })
              this.curRightTree = util.list2tree(resources, 0, 'resourceName')[0].children
              break
            }
          }
        }
      },
      show: {
        immediate: true,
        handler (show) {
          if (this.areas && this.areas.length > 0) {
            this.appList.length === 0 && this.getAppList()
          }
        }
      }
    },
    computed: {
      submitDis () {
        return false
      },
      roleNameMap () {
        let map = {}
        this.roleList.forEach(function (role) {
          map[role.id] = role.roleName
        }, this)
        return map
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.view = 'check'
        this.curRole = ''
        this.curRightTree = []
        this.manager.roleIds = []
      },
      submit () {
        this.submiting = true
        Promise.all([this.linkRole(), this.linkApp()])
        .then((resArr) => {
          this.submiting = false
          this.close()
          this.$emit('update-managers')
          this.$message({
            message: '权限设置成功!',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: '权限设置失败!',
            type: 'error'
          })
        })
      },
      linkRole () {
        let params = new URLSearchParams()
        params.append('id', this.curManager.id)
        params.append('roleIds', this.manager.roleIds.join(','))
        return this.axios.patch(API.manager_link_role, params)
        .catch(() => {
          this.$message({
            message: '授权角色失败!',
            type: 'error'
          })
        })
      },
      linkApp () {
        let params = new URLSearchParams()
        params.append('id', this.curManager.id)
        params.append('appIds', this.manager.appIds.join(','))
        return this.axios.patch(API.manager_link_app, params)
        .catch(() => {
          this.$message({
            message: '授权应用失败!',
            type: 'error'
          })
        })
      },
      changeToEdit () {
        this.view = 'edit'
        this.curRole = ''
        this.curRightTree = []
        if (Array.isArray(this.curManager.roles)) {
          this.curManager.roles.forEach(function (role) {
            this.manager.roleIds.push(role.id)
          }, this)
        }
      },
      getAppList () {
        let params = {
          page: 1,
          size: 999,
          areaId: this.areas[0].id
        }
        this.axios.get(API.get_app_list, { params }).then((data) => {
          this.appList = data.rows
        }).catch(() => {
          this.$message({
            message: '获取区域下应用失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    height: 560px;
    width: 590px;
    top: calc(50% - 280px);
    left: calc(50% - 285px);
  }
  .right-setting-content{
    height: 450px;
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .right-setting-content .el-row{
    padding: 20px 0;
  }
  .popup-btn{
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .custom-type{
    color: #7b828c;
    text-align: right;
  }
  .el-form-item{
    margin-bottom: 15px;
  }
  .el-tree-wp{
    max-height: 200px;
    border: 1px solid #bfcbd9;
    border-radius: 4px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-tree{
    border: 1px solid transparent;
  }
  .role-selected-wp{
    margin-bottom: 15px;
    height: 32px;
  }
  .right-setting-form .role-selected-wp{
    padding-left: 100px;
  }
  .role-selected-wp span{
    display: inline-block;
    box-sizing: border-box;
    height: 100%;
    line-height: 32px;
    margin-right: 8px;
    padding: 0px 12px;
    border: 1px solid hsla(220,8%,56%,.2);
    border-radius: 4px;
    color: #878d99;
    background-color: hsla(220,8%,56%,.1);
    cursor: pointer;
  }
  .role-selected-wp span:hover, .role-selected-wp span.is-current{
    border-color: rgba(64,158,255,.2);
    background-color: rgba(64,158,255,.1);
    color: #409eff;
  }
  .el-tree{
    line-height: 26px;
  }
  .right-setting-form{
    position: relative;
  }
  .right-setting-form label{
    position: absolute;
    display: block;
    top: 0px;
    text-align: right;
    width: 100px;
    height: 100%;
    padding-right: 12px;
    box-sizing: border-box;
    line-height: 32px;
    color: #5a5e66;
  }
  .el-tag+.el-tag{
    margin-left: 5px;
  }
</style>

