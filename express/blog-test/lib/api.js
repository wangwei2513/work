const UserModel = require('../models/user')
const draft = require('../models/draft')
module.exports = {
  /**
   * 添加草稿
   * @param  {[type]} data 需要保存的数据对象
   */
  saveDraft(data) {
    return new Promise((resolve, reject) => {
      // model.create(保存的对象,callback)
      draft.create(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  /**
   * 添加数据
   * @param  {[type]} data 需要保存的数据对象
   */
  save(data) {
    return new Promise((resolve, reject) => {
      // model.create(保存的对象,callback)
      UserModel.create(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  findDraft(data = {} , fields = null , options = {}) {
    return new Promise((resolve, reject) => {
      // model.find(需要查找的对象(如果为空，则查找到所有数据), 属性过滤对象[可选参数], options[可选参数], callback)
      draft.find(data, fields, options, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  find(data = {} , fields = null , options = {}) {
    return new Promise((resolve, reject) => {
      // model.find(需要查找的对象(如果为空，则查找到所有数据), 属性过滤对象[可选参数], options[可选参数], callback)
      UserModel.find(data, fields, options, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 获取一篇草稿
  findOneDraft(data) {
    return new Promise((resolve, reject) => {
      // model.findOne(需要查找的对象,callback)
      draft.findOne(data, (error, doc) => {
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
      // model.findOne(需要查找的对象,callback)
      UserModel.findOne(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 
  findDraftById(data) {
    return new Promise((resolve, reject) => {
      // model.findById(需要查找的id对象 ,callback)
      draft.findById(data, (error, doc) => {
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
      // model.findById(需要查找的id对象 ,callback)
      UserModel.findById(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  updateDraft(conditions, update) {
    return new Promise((resolve, reject) => {
      // model.update(查询条件,更新对象,callback)
      draft.update(conditions, update, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  update(conditions, update) {
    return new Promise((resolve, reject) => {
      // model.update(查询条件,更新对象,callback)
      UserModel.update(conditions, update, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  removeDraft(conditions) {
    return new Promise((resolve, reject) => {
      // model.update(查询条件,callback)
      UserModel.remove(conditions, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  remove(conditions) {
    return new Promise((resolve, reject) => {
      // model.update(查询条件,callback)
      UserModel.remove(conditions, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  }
}
