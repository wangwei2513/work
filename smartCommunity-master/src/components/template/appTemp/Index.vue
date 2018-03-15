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
      :areas-no-root="areasNoRoot"
      :user-right-list="userRightList"
      :is="view.curView"></component>
    </div>
  </template>
  <script>
    import AppTempManage from './AppTempManage.vue'
    export default {
      name: 'appTemp',
      props: {
        areas: {
          type: Array,
          required: true
        },
        areasNoRoot: {
          type: Array,
          required: true
        },
        userRightList: {
          type: Array
        }
      },
      data () {
        return {
          tabs: [
            {
              title: '应用模板',
              name: '1',
              view: 'AppTempManage'
            }
          ],
          curTab: '1',
          view: {
            curView: 'AppTempManage'
          }
        }
      },
      components: {
        AppTempManage
      }
    }
  </script>
  <style scoped>
    .portal-temp{
      padding: 21px 22px;
    }
  </style>
  