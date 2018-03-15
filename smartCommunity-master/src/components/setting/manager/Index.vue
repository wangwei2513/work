<template>
  <div class="manager-manage">
    <el-tabs
      v-model="tabsVal"
      type="card"
      @tab-remove="removeTab"
      @tab-click="changeView">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tabs"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
      </el-tab-pane>
    </el-tabs>
    <keep-alive>
      <router-view></router-view>
      <component
        :is="view.curView"
        :rightTree="rightTree"
        :roleList="roleList"
        :areas="areas"
        :user-right-list="userRightList"
        :cur-admin-type="curAdminType"
        @role-setting="roleSetting"
        @update-role-list="getRoleList()"></component>
    </keep-alive>
  </div>
</template>
<script>
import ManagerList from './ManagerList'
import RoleManage from './RoleManage'
import API from './../../../assets/js/api'
import util from './../../../assets/js/util'
import Cookies from './../../../assets/js/cookie'
export default {
  name: 'managerManage',
  props: {
    areas: {
      type: Array
    },
    userRightList: {
      type: Array
    }
  },
  data () {
    return {
      tabsVal: '1',
      tabIndex: '1',
      tabs: [
        {
          title: '后台管理员',
          name: '1',
          closable: false,
          view: 'ManagerList'
        }
      ],
      curAdminType: '',
      rightTree: [],
      roleList: [],
      view: {
        curView: 'ManagerList'
      }
    }
  },
  components: {
    ManagerList,
    RoleManage
  },
  methods: {
    addTab (targetName, view) {
      let newTabName = ++this.tabIndex + ''
      let exist = false
      this.tabs.forEach((tab) => {
        if (tab.view === view) {
          exist = true
          newTabName = tab.name
        }
      })
      if (!exist) {
        this.tabs.push({
          title: targetName,
          name: newTabName,
          view: view,
          closable: true
        })
      }
      this.tabsVal = newTabName
      this.view.curView = view
    },
    removeTab (targetName) {
      let tabs = this.tabs
      let activeName = this.tabsVal
      const self = this
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              self.view.curView = nextTab.view
            }
          }
        })
      }
      this.tabsVal = activeName
      this.tabs = tabs.filter(tab => tab.name !== targetName)
    },
    changeView ($tab) {
      let tabs = this.tabs
      var activeTab = null
      tabs.forEach(function (tab, index) {
        if ($tab.name === tab.name) {
          activeTab = tab
        }
      })
      this.view.curView = activeTab.view
    },
    roleSetting () {
      this.addTab('角色管理', 'RoleManage')
    },
    getRightTree () {
      var self = this
      this.axios.get(API.get_right_list).then(function (data) {
        data.rows.unshift({
          resourceName: '全部',
          id: 0
        })
        self.rightTree = util.list2tree(data.rows, 0, 'resourceName')[0].children
      })
    },
    getRoleList () {
      var self = this
      var params = {
        page: 1,
        size: 999
      }
      this.axios.get(API.get_role_list, { params }).then(function (data) {
        self.roleList = data.rows
      })
    }
  },
  created () {
    this.curAdminType = Cookies.get('adminType')
    this.getRightTree()
    this.getRoleList()
  }
}
</script>
<style scoped>
.manager-manage{
  padding: 20px;
}
</style>

