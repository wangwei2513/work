import Vue from 'vue'
import Router from 'vue-router'

// 按需加载
const Login = () => import(/* webpackChunkName: "assist" */'./../components/Login.vue')
const ServerError = () => import(/* webpackChunkName: "assist" */'./../components/ServerError.vue')
const Home = () => import(/* webpackChunkName: "home" */'./../components/home/Index.vue')
const FlowStatistics = () => import(/* webpackChunkName: "home" */'./../components/home/flowStatistics/Index.vue')
const HistoryTrend = () => import(/* webpackChunkName: "home" */'./../components/home/historyTrend/Index.vue')
const PortalIndex = () => import(/* webpackChunkName: "portal" */'./../components/portal/Index.vue')
const PortalList = () => import(/* webpackChunkName: "portal" */'./../components/portal/portalList/List.vue')
const PortalEdit = () => import(/* webpackChunkName: "portal" */'./../components/portal/portalEdit/Edit.vue')
const App = () => import(/* webpackChunkName: "app" */'./../components/app/Index.vue')
const AppList = () => import(/* webpackChunkName: "app" */'./../components/app/appList/List.vue')
const AppEdit = () => import(/* webpackChunkName: "app" */'./../components/app/appEdit/Edit.vue')
const AppTemp = () => import(/* webpackChunkName: "template" */'./../components/template/appTemp/Index.vue')
const PortalTemp = () => import(/* webpackChunkName: "template" */'./../components/template/portalTemp/Index.vue')
const Material = () => import(/* webpackChunkName: "material" */'./../components/material/Index.vue')
const MaterialList = () => import(/* webpackChunkName: "material" */'./../components/material/mateList/List.vue')
const MaterialEdit = () => import(/* webpackChunkName: "material" */'./../components/material/mateEdit/EditMate.vue')
const MaterialNew = () => import(/* webpackChunkName: "material" */'./../components/material/mateEdit/NewMate.vue')
const MateDetail = () => import(/* webpackChunkName: "materialDetail" */'./../components/material/mateEdit/MateDetail.vue')
const MaterialRecycle = () => import(/* webpackChunkName: "material" */'./../components/material/mateRecycle/recycle.vue')
const Check = () => import(/* webpackChunkName: "check" */'./../components/check/Index.vue')
const CheckMate = () => import(/* webpackChunkName: "check" */'./../components/check/mateCheck/List.vue')
const PortalCheck = () => import(/* webpackChunkName: "check" */'./../components/check/portalCheck/List.vue')
const AreaManage = () => import(/* webpackChunkName: "setting" */'./../components/setting/area/Index.vue')
const ServerManage = () => import(/* webpackChunkName: "setting" */'./../components/setting/server/Index.vue')
const KeyWordManage = () => import(/* webpackChunkName: "setting" */'./../components/setting/keyWord/Index.vue')
const UserManage = () => import(/* webpackChunkName: "setting" */'./../components/setting/user/Index.vue')
const SystemSetting = () => import(/* webpackChunkName: "setting" */'./../components/setting/system/Index.vue')
const LogManage = () => import(/* webpackChunkName: "setting" */'./../components/setting/log/Index.vue')
const Manager = () => import(/* webpackChunkName: "setting" */'./../components/setting/manager/Index.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
      meta: { noAuth: true }
    },
    {
      path: '/error',
      component: ServerError,
      meta: { noAuth: true }
    },
    {
      path: '',
      redirect: '/home'
    },
    {
      path: '/home',
      component: Home,
      children: [
        {path: '', component: FlowStatistics},
        {path: 'flowStatistics', component: FlowStatistics},
        {path: 'historyTrend/:id', component: HistoryTrend}
      ]
    },
    {
      path: '/portal',
      component: PortalIndex,
      children: [
        {path: '', component: PortalList},
        {path: 'list', component: PortalList},
        {path: 'edit/:groupId/:id', component: PortalEdit}
      ]
    },
    {
      path: '/app',
      component: App,
      children: [
        {path: '', component: AppList},
        {path: 'list', component: AppList},
        {path: 'edit/:id', component: AppEdit},
        {path: 'metaDetail/:id', component: MateDetail},
        {path: 'metaEdit/:id', component: MaterialEdit}
      ]
    },
    {
      path: '/template/appTemplate',
      component: AppTemp
    },
    {
      path: '/template/portalTemplate',
      component: PortalTemp
    },
    {
      path: '/material',
      component: Material,
      children: [
        {path: '', component: MaterialList},
        {path: 'list', component: MaterialList},
        {path: 'edit/:id', component: MaterialEdit},
        {path: 'detail/:id', component: MateDetail},
        {path: 'new', component: MaterialNew},
        {path: 'recycle', component: MaterialRecycle}
      ]
    },
    {
      path: '/check',
      component: Check,
      children: [
        {path: '', component: CheckMate},
        {path: 'material', component: CheckMate},
        {path: 'portal', component: PortalCheck},
        {path: 'detail/:id', component: MateDetail}
      ]
    },
    {
      path: '/setting/areaManage',
      component: AreaManage
    },
    {
      path: '/setting/serverManage',
      component: ServerManage
    },
    {
      path: '/setting/keyWordManage',
      component: KeyWordManage
    },
    {
      path: '/setting/userManage',
      component: UserManage
    },
    {
      path: '/setting/systemSetting',
      component: SystemSetting
    },
    {
      path: '/setting/logManage',
      component: LogManage
    },
    {
      path: '/setting/manager',
      component: Manager
    }
  ]
})
