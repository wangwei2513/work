<template>
  <div class="portal-temp">
    <el-tabs v-model="curTab" type="card">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tabs"
        :label="item.title"
        :name="item.name">
      </el-tab-pane>
    </el-tabs>
    <component 
    :areas="areas"
    :user-right-list="userRightList"
    :is="view.curView"></component>
  </div>
</template>
<script>
  import PortalTempManage from './PortalTempManage.vue'
  export default {
    name: 'portalTemp',
    props: {
      areas: {
        type: Array,
        required: true
      },
      userRightList: Array
    },
    data () {
      return {
        tabs: [
          {
            title: 'Portal模板',
            name: '1',
            view: 'PortalTempManage'
          }
        ],
        curTab: '1',
        view: {
          curView: 'PortalTempManage'
        }
      }
    },
    components: {
      PortalTempManage
    }
  }
</script>
<style scoped>
  .portal-temp{
    padding: 21px 22px;
  }
</style>
