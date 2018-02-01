const userModel = require('../models/users')
module.exports = {
  // 添加数据、data需要保存的数据
  save(data) {
    return new Promise((resolve, reject) => {
      // model.create(保存对象，callback)
      userModel.create(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  find(data = {} , fields = null , option = {}) {
    return new Promise((resolve, reject) => {
      // model.find(需要查找的对象(如果为空，则查找到所有数据), 属性过滤对象[可选参数], options[可选参数], callback)
      userModel.find(data, fields, option, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  findOne(data) {
    return new Promise((resolve, reject) => {
      // model.findone(需要查找的对象)
      userModel.findOne(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  findById(data) {
    return new Promise((resolve, reject) => {
      // model.findById(需要查找的id对象，callback)
      userModel.findById(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  update(conditions,update){
    return new Promise((resolve,reject) => {
      // model.update(查询条件、更新对象、callback)
      userModel.update(conditions,update,(error,doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  remove(conditions){
    return new Promise((resolve,reject) => {
      // model.remove(查询条件，callback)
      userModel.remove(conditions,(error,doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  }
}
