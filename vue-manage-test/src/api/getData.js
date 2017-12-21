import getData from '../config/getData'
// 登录
export const login = () => getData('./admin/login', data, 'POST')
// 获取用户信息
export const getAdminInfo = () => getData('/admin/info')
// 退出登录
export const signOut = () => getData('/admin/signout')
/**
 * 获取用户列表
 */

export const getUserList = data => getData('/users/list', data);

/**
 * 获取用户数量
 */

export const getUserCount = data => getData('/users/count', data);
