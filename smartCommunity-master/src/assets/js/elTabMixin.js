export default {
  methods: {
    addTab (targetName, route) {
      var existTab = false
      var sameTab = false
      var existIdx = -1
      this.tabs.forEach(function (tab, index) {
        if (tab.title === targetName) {
          existTab = true
          existIdx = index
          if (tab.route === route) {
            sameTab = true
          }
        }
      })
      if (sameTab) {
        this.tabsVal = this.tabs[existIdx].name
        this.$router.push({path: route})
      } else {
        if (!existTab) {
          let newTabName = ++this.tabIndex + ''
          this.tabs.push({
            title: targetName,
            name: newTabName,
            route: route,
            closable: true
          })
          this.tabsVal = newTabName
          this.$router.push({path: route})
        } else {
          this.$msgbox({
            title: '提示',
            message: '此操作将替换已存在的标签页,是否继续?',
            showCancelButton: true,
            confirmButtonText: '继续',
            cancelButtonText: '取消'
          }).then(action => {
            this.tabs[existIdx].route = route
            this.tabsVal = this.tabs[existIdx].name
            this.$router.push({path: route})
          }).catch(() => {})
        }
      }
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
  }
}
