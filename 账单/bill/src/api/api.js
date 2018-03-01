import getData from '../api/getData'
// 保存账单
export const addBill = (data) => getData('/addBill', data, 'post')
export const updateBill = (data) => getData('/updateBill', data, 'post')
export const getAll = () => getData('/getAllBill')