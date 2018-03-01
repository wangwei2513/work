const billModel = require('../models/billModel')
module.exports = {
  // 添加账单
  saveBill(data) {
    return new Promise((resolve, reject) => {
      billModel.create(data, (doc, error) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找全部账单
  findBill(data = {} , fields = null , options = {}) {
    return new Promise((resolve, reject) => {
      billModel.find(data, fields, options, (doc, error) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找单个账单
  findOneBill(data) {
    return new Promise((resolve, reject) => {
      billModel.findOne(data, (doc, error) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 更新账单
  updateBill(conditions, update) {
    return new Promise((resolve, reject) => {
      billModel.update(conditions, update, (doc, error) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 删除账单
  removeBill(conditions) {
    return new Promise((resolve, reject) => {
      billModel.remove(conditions, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  }
}
