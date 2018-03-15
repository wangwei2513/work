// const root = 'http://192.168.20.82:8888/community_shanddong'
const root = 'http://192.168.18.66:8888/community_shanddong'
// const portalRoot = 'http://192.168.20.157:8081/portal_cms_sc'
const portalRoot = 'http://192.168.41.124:8081/portal_cms_sc'

export default {

  /* denghy接口 */
  // portal编辑
  add_portal: portalRoot + '/portalController/addPortal',
  del_portal: portalRoot + '/portalController/deletePortal',
  get_portal_list: portalRoot + '/portalController/queryPortal',
  get_portal_info: portalRoot + '/portalController/queryPortalInfo',
  get_portal_preview: portalRoot + '/portalController/previewPortal',

  // portal菜单编辑
  get_portal_menu: portalRoot + '/portalController/getPortalMenuData',
  add_portal_menu: portalRoot + '/portalController/addSubMenu',
  del_portal_menu: portalRoot + '/portalController/deleteNode',
  change_portal_menu_name: portalRoot + '/portalController/updateMenuName',
  update_portal_menu_info: portalRoot + '/portalController/updateMenuInfo',
  // portal栅格编辑
  get_portal_menu_grid: portalRoot + '/portalController/getMenuGridInfo',
  merge_portal_menu_grid: portalRoot + '/portalController/mergeGrid',
  release_portal_menu_grid: portalRoot + '/portalController/releaseGrid',
  // 模板
  get_portal_temp_list: portalRoot + '/templateController/queryTemplate',
  add_portal_temp: portalRoot + '/templateController/addTemplate',
  edit_portal_temp: portalRoot + '/templateController/updateTemplate',
  del_portal_temp: portalRoot + '/templateController/deleteTemplate',
  get_portal_temp_preview: portalRoot + '/templateController/previewTemplate',
  // 权限
  get_portal_menu_auth: portalRoot + '/portalController/getPortalMenuDataAuth',
  get_portal_menu_auth_area: portalRoot + '/areaController/queryAuthArea',
  get_portal_menu_old_area: portalRoot + '/areaController/queryOldArea',
  anth_portal_menu: portalRoot + '/authController/addAuth',
  // portal内容编辑
  add_portal_menu_field: portalRoot + '/portalController/addMenuExtend',
  del_portal_menu_field: portalRoot + '/portalController/deleteMenuExtend',
  edit_portal_menu_field: portalRoot + '/portalController/updateMenuExtend',
  get_portal_menu_field: portalRoot + '/portalController/queryMenuExtend',
  add_portal_grid_field: portalRoot + '/portalController/addGridExtend',
  edit_portal_grid_field: portalRoot + '/portalController/updateGridExtend',
  del_portal_grid_field: portalRoot + '/portalController/deleteGridExtend',
  get_portal_grid_field: portalRoot + '/portalController/queryGridExtend',
  edit_portal_grid_info: portalRoot + '/portalController/updateGridInfo',
  // 审核
  check_portal: portalRoot + '/portalController/publishExam',
  pass_portal_check: portalRoot + '/portalController/passPortal',
  reject_portal_check: portalRoot + '/portalController/unpassPortal',
  get_check_portal_list: portalRoot + '/portalController/queryExamPortal',
  // 版本
  release_portal: portalRoot + '/portalController/publishVersion',
  get_portal_version: portalRoot + '/portalController/queryVersion',
  preview_portal_version: portalRoot + '/portalController/previewVersionPortal',
  get_portal_version_download_url: portalRoot + '/portalController/downVersion',

  /* fangg接口 */
  // 登录
  login: root + '/community_auth/loginSubmit',
  logout: root + '/community_auth/logout',
  check_session_valid: root + '/community_auth/checkSession',
  // 区域
  add_area: root + '/area/addArea',
  del_area: root + '/area/deleteArea',
  edit_area: root + '/area/editArea',
  get_area_list: root + '/area/listAreas',
  check_area_exist: root + '/area/isExistAreaName',
  // 服务器
  add_server: root + '/server/addServer',
  del_server: root + '/server/deleteServer',
  edit_server: root + '/server/editServer',
  get_server_list: root + '/server/listServers',
  check_srever_exist: root + '/server/isExistServerIp',
  server_link_area: root + '/server/assignServerToArea',
  // 系统用户
  manager_sign_up: root + '/sysUser/register',
  del_manager: root + '/sysUser/delSysUser',
  edit_manager: root + '/sysUser/editSysUser',
  get_manager_list: root + '/sysUser/listSysUsers',
  check_manager_exist: root + '/sysUser/isExistSysUserName',
  manager_link_area: root + '/sysUser/assignServerToArea',
  manager_link_role: root + '/sysUser/assignRoleToSysUser',
  manager_link_app: root + '/sysUser/assignAppToSysUser',
  // 系统日志
  del_log: root + '/sysLog/delLogs',
  get_log_list: root + '/sysLog/listLogs',
  download_log: root + '/sysLog/downloadLog',
  // 模板
  get_temp_list: root + '/module/listModules',
  get_sub_temp_list: root + '/module/listSubModules',
  add_temp: root + '/module/addModule',
  edit_temp: root + '/module/editModule',
  del_temp: root + '/module/deleteModule',
  check_temp_exist: root + '/module/isExistModuleName',
  get_temp_preview_url: root + '/module/previewModule',
  temp_link_area: root + '/module/assignModuleToArea',
  // 应用
  add_app: root + '/app/addApp',
  del_app: root + '/app/deleteApp',
  edit_app: root + '/app/editApp',
  get_app_list: root + '/app/listApps',
  check_app_exist: root + '/app/isExistAppName',
  app_link_area: root + '/app/assignAppToArea',
  app_link_servers: root + '/app/assignAppToServer',
  publish_app: root + '/app/publishApp',
  get_app_versions: root + '/app/listHisVersions',
  get_app_publish_server: root + '/app/listAppPublishedServers',
  get_app_preview_url: root + '/app/previewApp',
  get_app_his_preview_url: root + '/app/previewHisApp',
  download_app: root + '/app/downloadApp',
  download_his_app: root + '/app/downloadHisApp',
  // 角色
  add_role: root + '/role/addRole',
  del_role: root + '/role/deleteRole',
  edit_role: root + '/role/editRole',
  get_role_list: root + '/role/listRoles',
  check_role_exist: root + '/role/isExistRoleName',
  role_link_right: root + '/role/assignResourcesToRole',
  get_right_list: root + '/role/listResources',
  update_password: root + '/sysUser/updatePassword',
  // 栏目
  get_node_list: root + '/nodeApi/listNodes',
  add_node: root + '/nodeApi/addNode',
  del_node: root + '/nodeApi/deleteNode',
  edit_node: root + '/nodeApi/editNode',
  check_node_exist: root + '/nodeApi/isExistNodeName',
  get_node_info: root + '/nodeApi/getNodeDetail',
  change_node_status: root + '/nodeApi/updateNodeStatus',
  change_node_module: root + '/nodeApi/selectNodeModule',
  get_node_prview_url: root + '/nodeApi/previewNode',
  sort_node: root + '/nodeApi/updateNodeSort',
  // 素材
  get_entry_list: root + '/entry/listEntrys',
  add_entry: root + '/entry/addEntry',
  del_entry: root + '/entry/deleteEntry',
  edit_entry: root + '/entry/editEntry',
  get_entry_info: root + '/entry/getEntryDetail',
  prview_entry: root + '/entry/previewEntry',
  update_entry_status: root + '/entry/updateEntryStatus',
  entry_link_node: root + '/entry/assignEntryToNode',
  change_entry_sort: root + '/entry/updateEntrySort',
  get_recycle_entry: root + '/entry/listAbandonedEntrys',
  // 系统设置
  get_sy_setting: root + '/sysConfig/listProperties',
  set_sy_setting: root + '/sysConfig/updateProValue',
  // 审核
  audit_entry_status: root + '/audit/updateEntryStatus',
  // 首页统计
  get_app_month_pv: root + '/appStata/getMonthPv',
  get_app_month_uv: root + '/appStata/getMonthUV',
  get_app_period_pv: root + '/appStata/getPeriodPv',
  get_app_period_uv: root + '/appStata/getPeriodUV',
  get_app_total_pv: root + '/appStata/getTotalPv',
  get_app_total_uv: root + '/appStata/getTotalUV',
  get_statistics_entrys: root + '/appStata/listEntrys',
  get_statistics_nodes: root + '/appStata/listNodes'
}
