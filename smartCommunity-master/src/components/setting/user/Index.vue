<template>
  <div class="user-manage">
    <el-tabs v-model="tabsVal" type="card">
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
      <component :areas="areas" :is="view.curView"></component>
    </keep-alive>
  </div>
</template>
<script>
import UserList from './UserList'
export default {
  name: 'userManage',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      tabsVal: '1',
      tabs: [
        {
          title: '终端用户管理',
          name: '1',
          closable: false
        }
      ],
      view: {
        curView: 'UserList'
      }
    }
  },
  components: {
    UserList
  },
  methods: {
    addTab (targetName, route) {
      let newTabName = ++this.tabIndex + ''
      this.tabs.push({
        title: targetName,
        name: newTabName,
        route: route,
        closable: true
      })
      this.tabsVal = newTabName
      this.$router.push({path: route})
    },
    removeTab (targetName) {
      let tabs = this.tabs
      let activeName = this.tabsVal
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.$router.push({path: nextTab.route})
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
      this.$router.push({path: activeTab.route})
    }
  },
  created () {
  }
}
</script>
<style scoped>
.user-manage{
  padding: 20px;
}
</style>

