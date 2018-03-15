<template>
  <div id="content-inner">
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
          :mate-data="mate"
          :isCheck="true"
          :update-list.sync="update"
          :user-right-list="userRightList"
          @pass="passMate"
          @preview="previewMate"
          @reject="rejectMate"
          @show-detail="showDetail"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import API from './../../assets/js/api'
  import elTabMixin from './../../assets/js/elTabMixin'
  export default {
    name: 'check',
    mixins: [elTabMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      sySetting: Object,
      userRightList: Array
    },
    data () {
      return {
        tabsVal: '2',
        tabIndex: '2',
        mate: {
          title: '',
          subtitle: '',
          abstract: '',
          content: '',
          datetime: Date.now(),
          poster: [],
          imgs: [],
          isLocalVideo: 1,
          isLocalAudio: 1,
          video: [],
          audio: [],
          videoSrc: '',
          audioSrc: '',
          customFields: []
        },
        update: false,
        editData: null,
        view: {
        }
      }
    },
    computed: {
      auditable () {
        return this.userRightList.includes('updateEntryStatus') && this.sySetting.auditEntryType === 'manual'
      },
      tabs () {
        let tabs = [{
          name: '2',
          title: 'Portal审核',
          route: '/check/portal',
          closable: false
        }]
        if (this.auditable) {
          tabs.unshift({
            name: '1',
            title: '素材审核',
            route: '/check/material',
            closable: false
          })
          this.tabsVal = '1'
        }
        return tabs
      }
    },
    methods: {
      showDetail (mate) {
        this.addTab('素材详情', '/check/detail/' + mate.id)
      },
      passMate (mates) {
        this.$confirm('审核通过后,素材将被发布至终端可见,请谨慎操作!', '提示', {
          confirmButtonText: '通过',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateEntryStatus(mates, 3)
        }).catch(() => {})
      },
      previewMate (mate) {},
      rejectMate (mates) {
        this.$prompt('请填写驳回理由', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          this.updateEntryStatus(mates, 4, value)
        }).catch(() => {})
      },
      updateEntryStatus (mates, status, msg) {
        let params = new URLSearchParams()
        let ids = []
        let action = {
          3: '通过',
          4: '驳回'
        }
        mates.forEach(function (mate) {
          ids.push(mate.id)
        }, this)
        params.append('ids', ids.join(','))
        params.append('entryStatus', status)
        status === 4 && params.append('rejectTxt', msg)
        this.axios.patch(API.audit_entry_status, params).then(() => {
          this.update = true
          this.$message({
            message: '成功' + action[status] + '素材!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: action[status] + '素材失败!',
            type: 'error'
          })
        })
      }
    },
    beforeRouteEnter: (to, from, next) => {
      next((vm) => {
        setTimeout(function () {
          // 需要在下一轮事件中执行才能确定tabs已经判断完毕
          let route = ''        
          vm.tabs.some((tab) => {
            if (tab.name === vm.tabsVal) {
              route = tab.route
              return true
            }
          })
          vm.$router.push({path: route})
        }, 0)
      })
    }
  }
</script>
<style scoped>
  #content-inner{
    padding: 21px 22px;
  }
</style>
