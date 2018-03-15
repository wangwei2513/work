<template>
  <div class="home-page">
    <div class="material-oprate">
      <el-tabs v-model="tabsVal" type="card" @tab-remove="removeTab" @tab-click="changeView">
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
        <router-view
          :areas="areas"
          :item="itemSelect"
          @history-trend="historyTrend"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import elTabMixin from './../../assets/js/elTabMixin'
export default {
  name: 'homePage',
  /* el-tab切换处理的mixin */
  mixins: [elTabMixin],
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      tabsVal: '1',
      tabIndex: '1',
      itemSelect: [],
      tabs: [
        {
          name: '1',
          title: '流量统计',
          route: '/home',
          closable: false
        }
      ]
    }
  },
  methods: {
    historyTrend (entry) {
      this.itemSelect = entry
      this.addTab('历史趋势', '/home/historyTrend/' + entry.id)
    }
  }
}
</script>
<style scoped>
.home-page{
  padding: 20px;
}
</style>
