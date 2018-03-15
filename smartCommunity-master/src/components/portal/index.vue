<template>
  <div id="content-inner">
    <div class="portal-oprate">
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
        :servers="servers"
        :edit-data="editData"
        :user-right-list="userRightList"
        @newEdit="newEdit"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import elTabMixin from '../../assets/js/elTabMixin'
  export default {
    name: 'portalIndex',
    mixins: [elTabMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      servers: Array,
      userRightList: Array
    },
    data () {
      return {
        tabsVal: '1',
        tabs: [
          {
            name: '1',
            title: 'Portal列表',
            route: '/portal',
            closable: false
          }
        ],
        tabIndex: '1',
        editData: null
      }
    },
    methods: {
      newEdit (data) {
        this.editData = data
        this.addTab('编辑Portal', '/portal/edit/' + data.groupId + '/' + data.id)
      }
    }
  }
</script>
<style scoped>
  #content-inner{
    padding: 21px 22px;
  }
</style>
