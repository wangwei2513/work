import fecth from '../config/fetch'
// 登录
export const login = data => fecth('./admin/login',data,'POST')
// 获取用户信息
export const getAdminInfo = () => fetch('/admin/info');
// 退出登录
export const signOut = () => fetch('/admin/signout')