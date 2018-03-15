<template>
  <div id="app">
    <div class="sidebar" v-if="!isLogin">
      <div class="sidebar-top">
        <h1>智慧社区管理系统</h1>
      </div>
      <div class="sidebar-menu">
        <el-menu ref="elMenu" @select="handlerNavSelect" :default-active="initPath" :default-openeds="initOpen" unique-opened class="top-menu">
          <el-menu-item index="/home"><i class="ipanel-icon1 ipanel-icon-menu"></i>首页(统计管理)</el-menu-item>
          <el-submenu index="/template" v-if="tempManage">
            <template slot="title">
              <i class="ipanel-icon1 ipanel-icon-template"></i>
              <span slot="title">模板管理</span>
            </template>
            <el-menu-item index="/template/portalTemplate" v-if="curRightList.includes('template')">Portal模板</el-menu-item>
            <el-menu-item index="/template/appTemplate" v-if="curRightList.includes('module')">应用模板</el-menu-item>
          </el-submenu>
          <el-menu-item index="/portal" v-if="curRightList.includes('portal')"><i class="ipanel-icon1 ipanel-icon-portal"></i>Portal管理</el-menu-item>
          <el-menu-item index="/app" v-if="curRightList.includes('app')"><i class="ipanel-icon1 ipanel-icon-app"></i>应用管理</el-menu-item>
          <el-menu-item index="/material" v-if="curRightList.includes('entry')"><i class="ipanel-icon1 ipanel-icon-material"></i>素材管理</el-menu-item>
          <el-menu-item index="/check" v-if="curRightList.includes('audit')"><i class="ipanel-icon1 ipanel-icon-audit-nav"></i>审核管理</el-menu-item>
          <el-submenu index="/setting" v-if="syManage" class="long-list">
            <template slot="title">
              <i class="ipanel-icon1 ipanel-icon-template"></i>
              <span slot="title">系统管理</span>
            </template>
            <div class="list-wp-overflow">
              <el-menu-item index="/setting/areaManage" v-if="curRightList.includes('area')">区域管理</el-menu-item>
              <el-menu-item index="/setting/serverManage" v-if="curRightList.includes('server')">服务器管理</el-menu-item>
              <el-menu-item index="/setting/keyWordManage" v-if="curRightList.includes('keyWord')">关键词管理</el-menu-item>
              <el-menu-item index="/setting/userManage" v-if="curRightList.includes('user')">终端用户</el-menu-item>
              <el-menu-item index="/setting/manager" v-if="curRightList.includes('sysUser')">后台管理员</el-menu-item>
              <el-menu-item index="/setting/systemSetting" v-if="curRightList.includes('sysConfig')">系统设置</el-menu-item>
              <el-menu-item index="/setting/logManage" v-if="curRightList.includes('sysLog')">日志管理</el-menu-item>
            </div>
            <div class="top-box-shadow"></div>
            <div class="bottom-box-shadow"></div>
          </el-submenu>
        </el-menu>
      </div>
      <el-popover
        ref="popover"
        width="94"
        placement="top"
        popper-class="user-opration-wp"
        trigger="hover">
        <div class="user-opration">修改密码</div>
        <div @click="logout" class="user-opration">安全退出</div>
      </el-popover>
      <div v-popover:popover class="sidebar-user">
        <div class="user-headshot">
          <img :src="user.headshot" alt="">
        </div>
        <span class="user-name">{{user.userName}}</span>
      </div>
    </div>
    <div class="main" :class="isLogin ? 'islogin' : ''">
      <router-view
        :areas="areas"
        :servers="servers"
        :sy-setting="sySetting"
        :user-right-list="curRightList"
        :areas-no-root="areasNoRoot"
        @login="afterLogin"
        @update-sy-setting="getSySetting"
        @update-server-list="getServerList">
      </router-view>
    </div>
    <ipanel-footer v-if="!isLogin"></ipanel-footer>
  </div>
</template>

<script>
import API from './assets/js/api.js'
import util from './assets/js/util'
import Cookies from './assets/js/cookie'
import IpanelFooter from './components/Footer'
export default {
  name: 'app',
  data () {
    return {
      user: {
        userName: '',
        headshot: '/static/imgs/head.png',
        id: ''
      },
      initOpen: [],
      areas: [],
      servers: [],
      areasNoRoot: [],
      curRightList: [],
      sySetting: {}
    }
  },
  computed: {
    initPath () {
      let path = this.$route.path
      let result = ''
      if (path.indexOf('template') !== -1) {
        if (this.initOpen.indexOf('/template') === -1) {
          this.initOpen = ['/template']
        }
      } else if (path.indexOf('setting') !== -1) {
        if (this.initOpen.indexOf('/setting') === -1) {
          this.initOpen = ['/setting']
        }
      } else {
        path = '/' + path.split('/')[1]
      }
      result = path === '/' ? '/home' : path
      this.$nextTick(() => {
        this.$refs.elMenu && (this.$refs.elMenu.activeIndex = result)
      })
      return result
    },
    isLogin () {
      var path = this.$route.path
      return path.indexOf('login') !== -1
    },
    tempManage () {
      return this.curRightList.includes('template') || this.curRightList.includes('module')
    },
    syManage () {
      let settings = ['area', 'server', 'keyWord', 'user', 'sysUser', 'sysConfig', 'sysLog']
      let exist = false
      for (let i = 0; i < settings.length; i++) {
        let setting = settings[i]
        if (this.curRightList.includes(setting)) {
          exist = true
          break
        }
      }
      return exist
    }
  },
  components: {
    ipanelFooter: IpanelFooter
  },
  methods: {
    getUser () {
      const self = this
      this.axios.get(API.get_user_info).then(function (data) {
        self.user = data.user
      })
    },
    getAreas () {
      if (this.curRightList.includes('listArea')) {
        this.axios.get(API.get_area_list).then((data) => {
          var area = data.rows
          if (Array.isArray(area) && area.length > 0) {
            var rootId = area[0].rootId
            var areaTree = util.list2tree(area, rootId, 'name')
            var areasNoRoot = util.parent2bro(areaTree)
          }
          this.areas = areaTree
          this.areasNoRoot = areasNoRoot
        })
      }
    },
    getServerList () {
      if (this.curRightList.includes('listServers')) {
        let params = {
          page: 1,
          size: 999
        }
        this.axios.get(API.get_server_list, { params }).then((data) => {
          this.servers = data.rows
        })
      }
    },
    getSySetting () {
      if (this.curRightList.includes('listProperties')) {
        this.axios.get(API.get_sy_setting).then((data) => {
          let sySetting = {}
          data.rows.forEach(function (setting) {
            sySetting[setting.propertyKey] = setting.propertyValue
          }, this)
          this.sySetting = sySetting
        })
      }
    },
    getRightList (fn) {
      let adminType = Cookies.get('adminType')
      let params = {}
      if ('' + adminType === '3') {
        params.id = this.user.id
      }
      this.axios.get(API.get_right_list, { params }).then((data) => {
        let rightList = []
        data.rows.forEach(function (row) {
          rightList.push(row.resourceEnName)
        }, this)
        this.curRightList = rightList
        fn && fn.call(this)
      })
    },
    init () {
      this.curRightList = localStorage.resources.split(',')
      this.user.userName = Cookies.get('userName') || ''
      this.user.id = Cookies.get('userId') || ''
      this.getAreas()
      this.getServerList()
      this.getSySetting()
    },
    logout () {
      this.$router.push('/login')
      if (Cookies.get('rememberMe') !== '1') {
        // 如果没有记住密码,清空密码
        Cookies.remove('passWord')
        Cookies.remove('userName')
      }
      Cookies.remove('userId')
      Cookies.remove('token')
      Cookies.remove('adminType')
      localStorage.resources = ''
      this.areas = []
      this.servers = []
      this.areasNoRoot = []
      this.curRightList = []
      this.sySetting = {}
      this.initOpen = []
      this.user = {
        userName: '',
        headshot: '/static/imgs/head.png',
        id: -1
      }
    },
    afterLogin () {
      this.init()
    },
    handlerNavSelect (index) {
      if (!this.$route.path.startsWith(index)) {
        this.$router.push({path: index})
      }
    }
  },
  created () {
    /** 
     * 全局的数据都需在此进行获取设置.
     * 由于此组件是在进入'/login'之前需加载的,而未登录的请求会显示重复的提示信息.
     * 因此判断是否已登录,再请求全局数据
    */
    if (Cookies.get('token')) {
      this.init()
    }
  }
}
</script>
<style scoped>
  .sidebar-top h1{
    font-size: 20px;
    height: 28px;
    padding-top: 17px;
    color: #fff;
    text-align: center;
  }
  .sidebar{
    width: 172px;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
  }
  .main{
    width: calc(100% - 172px);
    min-width: 1020px;
    height: 100%;
    position: absolute;
    left: 172px;
    top: 0;
  }
  .el-menu{
    border: none;
  }
  .main.islogin{
    width: 100%;
    height: 100%;
    position: static;
  }
  .sidebar-menu{
    margin-top: 30px;
  }
  .user-headshot{
    height: 30px;
    width: 30px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #fff;
  }
  .sidebar-user{
    position: absolute;
    bottom: 30px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    width: 100%;
    box-sizing: border-box;
  }
  .user-name{
    margin-left: 10px;
    color: #fff;
  }
  
  .user-opration{
    text-align: center;
    font-size: 14px;
    color: #324057;
    height: 20px;
    line-height: 20px;
    padding: 5px 0;
    cursor: pointer;
  }
  .user-opration:hover{
    background-color: #D3DCE6;
  }
  .list-wp-overflow{
    max-height: 180px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .list-wp-overflow::-webkit-scrollbar-track{
    background-color: rgb(29, 131, 208);
    box-shadow: inset 0px 0px 2px 1px rgba(27, 95, 146, 0.81);
  }

  .list-wp-overflow::-webkit-scrollbar{
    width: 10px;
    background-color: rgb(32, 160, 255);
  }
  .list-wp-overflow::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: #215a84;
  }
  .top-box-shadow{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    box-shadow: 0 -4px 10px 5px rgba(0, 0, 0, 0.7);
  }
  .bottom-box-shadow{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    box-shadow: 0px 4px 10px 5px rgba(0,0,0,.7);
  }
  @media screen and (max-height: 710px) {
    .el-menu-item, .el-submenu__title{
      height: 40px !important;
    }
  }
</style>
<style>
  body,html,#app{
    height: 100%;
    font-family: 'PingFang-SC-Regular','Microsoft YaHei';
  }
  body{
    min-height: 750px;
    min-width: 1192px;
  }
  
  /* 导航栏begin */
  .sidebar, .top-menu{
    background-color: #20A0FF !important;
  }
  .top-menu .el-menu-item{
    color: #fff !important;
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .top-menu .el-submenu .el-menu-item{
    font-size: 14px;
    color: rgba(255,255,255,.7);
    min-width: 100px;
    padding-left: 60px !important;
  }
  .top-menu .el-submenu .el-menu-item.is-active{
    color: #fff !important;
  }
  .top-menu .el-submenu .el-menu-item:first-child{
    box-shadow: inset 0px 4px 10px -5px rgba(0,0,0,.7);
  }
  .top-menu .el-submenu .el-menu-item:last-child{
    box-shadow: inset 0px -4px 10px -5px rgba(0,0,0,.7);
  }
  .top-menu .el-submenu .el-menu{
    background-color: #20a0ff !important;
  }
  .top-menu .el-submenu .el-submenu__title{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #fff;
    font-size: 16px;
  }
  .top-menu .el-menu-item.is-active{
    background-color: #0B8CEC !important;
  }
  .top-menu .el-menu-item:not(.is-active):hover{
    background-color: #81caff !important;
  }
  .el-submenu__title i{
    font-size: 14px;
    color: #fff;
  }
  .el-submenu__title:hover{
    background-color: #81caff !important;
  }
  .el-table__header .cell {
    font-weight: bold;
  }
  .gray-14{
    font-size: 14px;
    color: #7b828c;
  }
  .user-opration-wp{
    min-width: 94px;
    padding: 5px 0;
    left: 0px;
  }
  .long-list .el-menu{
    overflow: hidden;
  }
  .long-list .el-menu .el-menu-item:last-child{
    box-shadow: none;
  }
  .long-list .el-menu .el-menu-item:first-child{
    box-shadow: none;
  }
  /* 导航栏end */
  
  /*全局图标begin  */
  .iconfont{
    margin-right: 5px;
    font-size: 20px;
  }
  .ipanel-icon1{
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-right: 10px;
    flex-shrink: 0;
    background-image: url(./../static/imgs/icon/sprite.png);
    background-repeat: no-repeat;
  }
  .ipanel-icon2{
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-right: 10px;
    flex-shrink: 0;
    background-image: url(./../static/imgs/icon/sprite2.png);
    background-repeat: no-repeat;
  }
  .ipanel-icon-menu{
    background-position: -163px -100px;
  }
  .ipanel-icon-template{
    background-position: -28px -100px;
  }
  .ipanel-icon-portal{
    background-position: -93px -100px;
  }
  .ipanel-icon-app{
    background-position: -60px -100px;
  }
  .ipanel-icon-material{
    background-position: 0px -100px;
  }
  .ipanel-icon-audit-nav{
    background-position: -128px -100px;
  }
  .ipanel-icon-setting{
    background-position: -200px -100px;
  }
  .ipanel-icon-preview{
    background-position: -53px 3px;
    vertical-align: middle;
    cursor: pointer;
  }
  .ipanel-icon-new{
    background-position: -82px -20px;
  }
  .ipanel-icon-detail{
    background-position: -80px -44px;
  }
  .ipanel-icon-edit{
    background-position: -106px -21px;
  }
  .ipanel-icon-link{
    background-position: -24px -44px;
  }
  .ipanel-icon-temp{
    background-position: -107px -42px;
  }
  .ipanel-icon-del{
    background-position: 2px -21px;
  }
  .ipanel-icon-audit{
    background-position: 3px -43px;
  }
  .ipanel-icon-publish{
    background-position: -55px -20px;
  }
  .ipanel-icon-off{
    background-position: -50px -43px;
  }
  .ipanel-icon-recycle{
    background-position: -82px -20px;
  }
  .ipanel-icon-preview1{
    background-position: -156px -20px;
  }
  .ipanel-icon-send{
    background-position: -26px -20px;
  }
  .ipanel-icon-copy{
    background-position: -131px -20px;
  }
  .ipanel-icon-pass{
    background-position: 2px -21px;
  }
   .ipanel-icon-reject{
    background-position: -26px -20px;
  }
  .ipanel-icon-right{
    background-position: -104px -22px;
  }
  .ipanel-icon-role{
    background-position: -79px -22px;
  }
  .el-button.is-disabled .ipanel-icon-detail,.ipanel-icon-detail.whitebg{
    background-position: -80px -70px;
  }
  .el-button.is-disabled .ipanel-icon-edit,.ipanel-icon-edit.whitebg{
    background-position: -120px -46px;
  }
  .el-button.is-disabled .ipanel-icon-link,.ipanel-icon-link.whitebg{
    background-position: -24px -71px;
  }
  .el-button.is-disabled .ipanel-icon-temp,.ipanel-icon-temp.whitebg{
    background-position: -108px -69px;
  }
  .el-button.is-disabled .ipanel-icon-del,.ipanel-icon-del.whitebg{
    background-position: 2px -46px;
  }
  .el-button.is-disabled .ipanel-icon-audit,.ipanel-icon-audit.whitebg{
    background-position: 3px -70px;
  }
  .el-button.is-disabled .ipanel-icon-publish,.ipanel-icon-publish.whitebg{
    background-position: -58px -46px;
  }
  .el-button.is-disabled .ipanel-icon-off,.ipanel-icon-off.whitebg{
    background-position: -50px -71px;
  }
  .el-button.is-disabled .ipanel-icon-preview1,.ipanel-icon-preview1.whitebg{
    background-position: -180px -46px;
  }
  .el-button.is-disabled .ipanel-icon-send,.ipanel-icon-send.whitebg{
    background-position: -27px -46px;
  }
  .el-button.is-disabled .ipanel-icon-copy,.ipanel-icon-copy.whitebg{
    background-position: -150px -46px;
  }
  .el-button.is-disabled .ipanel-icon-pass,.ipanel-icon-pass.whitebg{
    background-position: 1px 2px;
  }
  .el-button.is-disabled .ipanel-icon-reject,.ipanel-icon-reject.whitebg{
    background-position: -26px 2px;
  }
  .el-button.is-disabled .ipanel-icon-right,.ipanel-icon-right.whitebg{
    background-position: -104px 1px;
  }
  .el-button.is-disabled .ipanel-icon-role,.ipanel-icon-role.whitebg{
    background-position: -79px 1px;
  }
  .icon-staistics{
    display: block;
    cursor: pointer;
    height: 16px;
    width: 20px;
    background: url(./../static/imgs/icon/statistics.png) no-repeat;
  }
  /*全局图标end  */

/* 全局样式begin */

  /* 关闭按钮begin */
  .icon-arrows_remove{
    font-size: 40px;
    height: 34px;
    position: absolute;
    right: 10px;
    top: 10px;
    transition: all .5s;
  }
  .icon-arrows_remove:hover{
    cursor: pointer;
    transform: rotate(180deg);
  }
  /* 关闭按钮end */
  /* 弹窗begin */
  .popup-box{
    width: 590px;
    height: 522px;
    background-color: #fff;
    padding: 20px;
    font-size: 14px;
    border-radius: 5px;
    position: fixed;
    top: calc(50% - 285px);
    left: calc(50% - 261px);
    box-sizing: border-box;
    z-index: 1010;
  }
  .popup-cover{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1009;
  }
  .popup-header{
    font-size: 14px;
    color: #1f2d3d;
    font-weight: bold;
    margin-bottom: 25px;
  }
  .popup-btns{
    width: 100%;
    padding: 5px 0;
    height: 36px;
  }
  /* 弹窗end */

  /* 提示样式begin */
  .error-info{
    font-size: 12px;
    color: #FF4949;
  }
  /* 提示样式begin */
  .placeholder{
    color: #97a8be;
  }
  .el-loading-mask {
    z-index: 999;
  }
  /* scrollbar样式 */
  .i-scollbar::-webkit-scrollbar-track{
  }
  .i-scollbar::-webkit-scrollbar{
    width: 8px;
  }
  .i-scollbar::-webkit-scrollbar-thumb{
    border-radius: 3px;
    background-color: rgba(174, 180, 191, 0.5);
    border-right: 1px solid #fff;
  }
  /* 表格演示begin */
  .el-table th{
    color: #1f2d3d;
    background-color: #eef1f6;
  }
  .el-tree{
    border: thin solid #d1dbe5;
  }
  .el-table__body-wrapper{
    overflow-x: hidden;
    overflow-y: auto;
  }
  .el-table .el-radio__label{
    display: none;
  }
  /* 表格演示end */
  .my-popover-style{
    padding: 6px 0;
  }
  .el-button.top-operate{
    padding: 5px 10px !important;
  }
  .el-pagination__editor .el-input__inner{
    height: 28px;
  }
/* 全局样式end */
</style>
