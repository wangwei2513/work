<template>
  <div class="_temp-manage">
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
    <div class="_temp-manage-content">
    </div>
  </div>
</template>
<script>
export default {
  name: '_tempManage',
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
          title: '区域管理',
          name: '1',
          closable: false
        }
      ]
    }
  },
  methods: {},
  created () {
  }
}
</script>
<style scoped>
._temp-manage{
  padding: 20px;
}
</style>

