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
          :update="updateMateList"
          :sy-setting="sySetting"
          :user-right-list="userRightList"
          @new-mate="newMate"
          @edit-mate="editMate"
          @show-mate="showMate"
          @close-current="removeTab(tabsVal)"
          @go-recycle="goRecycle"
          @update-mate-list="(status) => {updateMateList = status}"></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
  import elTabMixin from './../../assets/js/elTabMixin'
  export default {
    name: 'materialIndex',
    mixins: [elTabMixin],
    props: {
      areas: {
        type: Array,
        required: true
      },
      sySetting: {
        type: Object
      },
      userRightList: {
        type: Array
      }
    },
    data () {
      return {
        tabsVal: '1',
        tabIndex: '1',
        tabs: [
          {
            name: '1',
            title: '素材列表',
            route: '/material',
            closable: false
          }
        ],
        mate: {},
        updateMateList: false,
        editData: null,
        view: {
          isNew: true
        }
      }
    },
    methods: {
      newMate () {
        this.view.isNew = true
        this.mate = {
          title: '',
          titleEnName: '',
          subTitle: '',
          description: '',
          content: '',
          plainTxt: '',
          createTime: '',
          entryDate: Date.now(),
          entryImageFile: [],
          albumFiles: [],
          videoUploadType: 1,
          backgroundMusicUploadType: 1,
          videoFile: [],
          backgroundMusicFile: [],
          videoUrl: '',
          backgroundMusicUrl: '',
          customFields: [],
          nodes: []
        }
        this.addTab('新建素材', '/material/new')
      },
      editMate (id) {
        this.view.isNew = false
        this.mate.id = id
        this.addTab('编辑素材', '/material/edit/' + id)
      },
      showMate (id) {
        this.view.isNew = false
        this.mate.id = id
        this.addTab('素材详情', '/material/detail/' + id)
      },
      goRecycle () {
        this.addTab('回收站', '/material/recycle')
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
