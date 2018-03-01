const articleModel = require('../models/article')
const draftModel = require('../models/draft')
module.exports = {
  // 添加草稿
  saveDraft(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      draftModel.create(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 添加文章
  saveArticle(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
      articleModel.create(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找全部草稿
  findDraft(data = {} , fields = null , options = {}) {
    return new Promise((resolve, reject) => {
      draftModel.find(data, fields, options, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找全部文章
  findArticle(data = {} , fields = null , options = {}) {
    return new Promise((resolve, reject) => {
      articleModel.find(data, fields, options, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找一篇草稿
  findOneDraft(data) {
    return new Promise((resolve, reject) => {
      draftModel.findOne(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 查找一篇文章
  findOneArticle(data) {
    return new Promise((resolve, reject) => {
      articleModel.findOne(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 通过id查找草稿
  findDraftById(data) {
    return new Promise((resolve, reject) => {
      draftModel.findById(data, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  // 通过id查找文章
  findArticleById(data) {
    return new Promise((resolve, reject) => {
      articleModel.findById(data, (error, doc) => {
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
      draftModel.update(conditions, update, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  updateArticle(conditions, update) {
    return new Promise((resolve, reject) => {
      articleModel.update(conditions, update, (error, doc) => {
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
      draftModel.remove(conditions, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  },
  removeArticle(conditions) {
    return new Promise((resolve, reject) => {
      articleModel.remove(conditions, (error, doc) => {
        if (error) {
          reject(error)
        } else {
          resolve(doc)
        }
      })
    })
  }
}
