<template>
  <div id="content-inner">
    <div>
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
          ref="tabs"
          :mateData="mateData"
          :appData="appData"
          :appId="appId"
          :areas="areas"
          :servers="servers"
          :user-right-list="userRightList"
          :sy-setting="sySetting"
          @new-edit="newEdit"
          @edit-mate="editMate"
          @close-detail="removeTab(tabsVal)"
          @showMateDetail="showMateDetail"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import elTabMixin from './../../assets/js/elTabMixin.js'
  export default {
    name: 'appIndex',
    mixins: [elTabMixin],
    props: {
      areas: {
        type: Array
      },
      servers: {
        type: Array
      },
      userRightList: {
        type: Array
      },
      sySetting: Object
    },
    data () {
      return {
        /* el-tab-mixin需要的参数begin,谨慎改动 */
        tabsVal: '1',
        tabIndex: '1',
        tabs: [
          {
            name: '1',
            title: '应用列表',
            route: '/app',
            closable: false
          }
          /* 这里可以继续增加tab */
        ],
        /* el-tab-mixin需要的参数end,谨慎改动 */
        mateData: {},
        appData: {},
        appId: ''
      }
    },
    methods: {
      showMateDetail (mate) {
        console.log(mate)
        this.mateData = mate
        this.addTab('素材详情', '/app/metaDetail/' + mate.id)
      },
      newEdit (data) {
        this.appData = data
        this.appId = data.id
        this.addTab('编辑应用', '/app/edit/' + data.id)
      },
      editMate (id) {
        this.addTab('编辑素材', '/app/metaEdit/' + id)
      }
    },
    created () {
    }
  }
</script>
<style scoped>
  #content-inner{
    padding: 21px 22px;
  }
</style>
