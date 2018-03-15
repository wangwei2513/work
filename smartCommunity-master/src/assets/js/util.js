/**
 * 为树形结构的数据添加一个独一无二的有层次的标识符
 * @param {Array} arr 待添加index的数组
 * @param {String} index 父节点的index
 */
function addIndex (arr, index) {
  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i]
    var idx
    if (index === '') {
      idx = '' + i
    } else {
      idx = index + '-' + i
    }
    ele.index = idx
    if (Array.isArray(ele.children)) {
      addIndex(ele.children, idx)
    }
  }
}

/**
 * 将列表结构的数据装换为树形结构的数据
 * @param {Array} list 列表
 * @param {String,Number} rootId 根id
 * @param {String} labelName 节点名的标识符
 */
function list2tree (list, rootId, labelName) {
  var listCopy = Object.assign([], list)
  var result = []
  listCopy.some(function (item) {
    if (item.id === rootId) {
      item.label = item[labelName]
      result.push(item)
      return true
    }
  }, this)
  addChildren(result, listCopy, labelName)
  return result
}
/**
 * 将列表根据父子关系添加到指定节点的后代中
 * @param {Array} parents 需要添加的父数组
 * @param {Array} list 待添加的子列表数组
 * @param {String} labelName 节点名的标识符
 */
function addChildren (parents, list, labelName) {
  parents.forEach(function (parent) {
    var pid = parent.id
    parent.label = parent[labelName]
    list.forEach(function (item, index, arr) {
      if (item.pId === pid) {
        Array.isArray(parent.children) ? parent.children.push(item) : parent.children = [item]
      }
    }, this)
    Array.isArray(parent.children) && addChildren(parent.children, list, labelName)
  }, this)
}

/**
 * 调整树形结构的层级,使顶层移动至其子级同一级
 * a              |-a
 * |-b   ===>     |-b
 * |-c            |-c
 * @param {Array} arr 树形结构数据
 */
function parent2bro (arr) {
  var newArr = $.extend(true, [], arr[0].children)
  var parent = {}
  Object.assign(parent, arr[0])
  parent.children = null
  parent.value = parent.id
  newArr.unshift(parent)
  return newArr
}

/**
 * 将树型数据每一条分支都列出来,返回一个以'-'分割的字符串组成的列表
 * a
 * |-b
 * |-c   ===>     ['a-b', 'a-c', 'a-c-d']
 *   |-d
 * @param {Array} arr 树型数据
 */
function tree2list (arr) {
  var result = []
  arr.forEach(function (item) {
    var childNames = []
    if (Array.isArray(item.children)) {
      childNames = tree2list(item.children)
    }
    if (childNames.length > 0) {
      childNames.forEach(function (childName) {
        result.push(item.name + '-' + childName)
      }, this)
    } else {
      result.push(item.name)
    }
  }, this)
  return result
}

function formatDate (dateLike, format) {
  let date = new Date(dateLike)
  let hours = '' + date.getHours()
  let mins = '' + date.getMinutes()
  let seconds = '' + date.getSeconds()
  let fullYears = '' + date.getFullYear()
  let months = '' + (date.getMonth() + 1)
  let days = '' + date.getDate()
  let years = fullYears.substring(2)
  let result
  format = format || 'YYYY-MM-DD'
  result = format.replace('YYYY', fullYears)
  result = result.replace('YY', years)
  result = result.replace('MM', months.padStart(2, '0'))
  result = result.replace('DD', days.padStart(2, '0'))
  result = result.replace('hh', hours.padStart(2, '0'))
  result = result.replace('mm', mins.padStart(2, '0'))
  result = result.replace('ss', seconds.padStart(2, '0'))
  return result
}

function traUrlQuery (data) {
  let result = '?'
  let query = []
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (error) {
      throw error
    }
  }
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = data[key]
      query.push(key + '=' + encodeURIComponent(value))
    }
  }
  result += query.join('&')
  return result
}

// 终端类型: TV端：1，手机端：2，pc端：3
const deviceMap = {
  '1': 'TV端',
  '2': '手机端',
  '3': 'PC端'
}

// 应用发布状态: 0：未发布，1，正在发布，2：已下架
const appStatusMap = {
  0: '待发布',
  1: '发布中',
  2: '已发布'
}

const moduleTypeMap = {
  '0': '组合模板',
  '2': '独立页模板',
  '3': '内容页模板'
}

const mutiModuleTypeMap = {
  '1': '嵌套页模板',
  '4': '父模板',
  '5': '子模板'
}

const totalModuleTypeMap = {
  '1': '嵌套页模板',
  '2': '独立页模板',
  '3': '内容页模板',
  '4': '父模板',
  '5': '子模板'
}


// 1：保存，2：提交，3：审核通过，4：驳回
const entryStatusMap = {
  1: '已保存',
  2: '待审核',
  3: '审核通过',
  4: '已驳回'
}

const portalProMap = {
  '-1': '全部',
  '0': '自建portal',
  '1': '上级下发'
}

const terminalMap = {
  '1': '标清盒子',
  '2': '高清盒子',
  '3': '4K盒子',
  '4': '手机'
}

// 0可编译，1审核驳回，2待审核，3审核通过，4已发布，5提交待审核
const portalStatusMap = {
  0: '可编译',
  1: '已驳回',
  2: '待审核',
  3: '审核通过',
  4: '已发布',
  5: '已保存'
}

const managerTypeMap = {
  1: '系统管理员',
  2: '区域管理员',
  3: '普通管理员'
}

const quickTimeMap = {
  1: '今天',
  2: '昨天',
  3: '最近7天',
  4: '最近30天'
}

const visitTypeMap = {
  'pv': '访问量',
  'uv': '访客量'
}

const SITEROOT = 'http://localhost:8090/'

export default {
  SITEROOT,
  addIndex,
  list2tree,
  parent2bro,
  tree2list,
  traUrlQuery,
  deviceMap,
  terminalMap,
  appStatusMap,
  moduleTypeMap,
  mutiModuleTypeMap,
  totalModuleTypeMap,
  entryStatusMap,
  formatDate,
  portalProMap,
  portalStatusMap,
  managerTypeMap,
  quickTimeMap,
  visitTypeMap
}
