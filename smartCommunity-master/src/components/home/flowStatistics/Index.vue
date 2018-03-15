<template>
  <div>
    <i-tabs
     :tabs="tabs"
     :activeTab="activeTab"
     @active-change="changeView">
    </i-tabs>
    <keep-alive>
      <component
        :key="view.curView"
        :is="view.curView"
        :areas="areas"
        @history-trend="historyTrend"></component>
    </keep-alive>
  </div>
</template>
<script>
import ITabs from './../../common/ITabs'
import PortalSta from './PortalSta'
import AppSta from './AppSta'
export default {
  name: 'flowStatistics',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      activeTab: '1',
      tabs: [
        {
          label: 'Portal统计',
          view: 'PortalSta',
          id: '1'
        },
        {
          label: '应用统计',
          view: 'AppSta',
          id: '2'
        }
      ],
      view: {
        curView: 'PortalSta'
      }
    }
  },
  components: {
    ITabs,
    PortalSta,
    AppSta
  },
  methods: {
    changeView (tab) {
      console.log(tab)
      this.view.curView = tab.view
    },
    historyTrend (item) {
      this.$emit('history-trend', item)
    }
  }
}
</script>
<style scoped>
</style>
