import getData from '../config/getData'
// 登录
export const login = data => getData('/admin/login', data , 'post')
// 获取用户信息
export const getAdminInfo = () => getData('/admin/info')
// 退出登录
export const signOut = () => getData('/admin/signout')
/**
 * 获取用户列表
 */

export const getUserList = data => getData('/users/list', data)

/**
 * 获取用户数量
 */

export const getUserCount = data => getData('/users/count', data)

// api数量
export const apiCount = (data) => getData('/users/apiCount' + '/' + data)
// 用户数
export const userCount = (data) => getData('/users/userCount' + '/' + data)
// 订单量
export const orderCount = (data) => getData('/users/orderCount' + '/' + data)
// 管理员数
export const adminCount = (data) => getData('/users/adminCount' + '/' + data)
// 全部api
export const allApiCount = () => getData('/users/allApiCount')
// 全部用户
export const allUserCount = () => getData('/users/allUserCount')
// 全部订单
export const allOrderCount = () => getData('/users/allOrderCount')
// 全部管理员
export const allAdminCount = () => getData('/users/allAdminCount')
// 
export const getFoods = () => getData('/users/getFoods')
// 
export const getFoodsCount = () => getData('/users/getFoodsCount')
// 
export const getMenu = () => getData('/users/getMenu')
// 
export const updateFood = () => getData('/users/updateFood')
// 
export const deleteFood = () => getData('/users/deleteFood')
// 
export const getRestaurantDetail = () => getData('/users/getRestaurantDetail')
// 
export const getMenuById = () => getData('/users/getMenuById')
// 
export const getOrder = () => getData('/users/getOrder')
export const getOrderData = () => getData('/users/getOrderData')
// 
// 
export const getUserInfo = () => getData('/users/getUserInfo')
export const getAddressInfo = () => getData('/users/getAddressInfo')
// 获取用户数据
export const getAdminCount = () => getData('/users/getAdminCount')
export const getAdminList = () => getData('/users/getAdminList')
// getCity, getCategories, searchPlace, addShop
export const getCity = () => getData('/users/getCity')
export const getCategories = () => getData('/users/getCategories')
export const searchPlace = () => getData('/users/searchPlace')
export const addShop = () => getData('/users/addShop')
// getCategories,addCategory,addFood
export const addCategory = () => getData('/users/addCategory')
export const addFood = () => getData('/users/addFood')