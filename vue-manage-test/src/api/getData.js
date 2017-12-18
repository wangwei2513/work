import fecth from '../config/fetch'
// 登录
export const login = data => fecth('./admin/login',data,'POST')
// 获取用户信息
export const getAdminInfo = data => fetch('./admin/info')