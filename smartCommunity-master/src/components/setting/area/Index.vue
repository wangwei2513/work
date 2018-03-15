<template>
  <div class="area-manage">
    <el-tabs v-model="tabsVal" type="card">
      <el-tab-pane
        :key="item.name"
        v-for="(item, id) in tabs"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="area-manage-tree">
      <el-tree
        node-key="id"
        :props="{label: 'name', children: 'children'}"
        :data="_areas"
        :default-expanded-keys="expandedCst"
        :indent="24"
        :render-content="renderTreeNode"
        :auto-expand-parent= "false"
        @node-click="areaNodeClick"
        @node-expand="(data)=>{addExpandedCst(data.id)}"
        @node-collapse="(data)=>{removeExpandedCst(data.id)}">
      </el-tree>
    </div>
  </div>
</template>
<script>
// TODO 栏目的拖动修改层级功能
import API from './../../../assets/js/api'
export default {
  name: 'areaManage',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      tabsVal: '1',
      tabs: [
        {
          title: '区域管理',
          name: '1',
          closable: false
        }
      ],
      expandedCst: [],
      curVal: '',
      curId: ''
    }
  },
  computed: {
    _areas: {
      get () {
        return $.extend(true, [], this.areas)
      },
      set (val) {}
    },
    topAreaId () {
      let id = -1
      if (this.areas && this.areas.length > 0) {
        id = this.areas[0].id
      }
      return id
    }
  },
  watch: {
    areas: {
      immediate: true,
      handler (areas) {
        if (Array.isArray(areas) && areas.length > 0) {
          let expandedCst = []
          expandedCst = [areas[0].id]
          Array.isArray(areas[0].children) && areas[0].children.forEach(function (topArea) {
            topArea.id && expandedCst.push(topArea.id)
          }, this)
          this.expandedCst = expandedCst
        }
      }
    }
  },
  methods: {
    loadArea (node, resolve) {
      if (node.level === 0) {
        return resolve(this._areas.length > 0 && this._areas[0].children || [])
      }
      if (node.level === 1 || node.level === 2) {
        return resolve(node.data.children || [])
      }
      if (node.level > 2) {
        let params = {
          pId: node.data.id
        }
        this.axios.get(API.get_area_list, { params }).then((data) => {
          resolve(data.rows)
        })
      }
    },
    renderTreeNode (h, { node, data }) {
      const self = this
      this.$set(data, 'submiting', false)
      var wrapperClass = data.isNew ? 'tree-node-conent in-rename' : 'tree-node-conent'
      var ctrs = [
        h('span', {
          'class': 'ipanel-icon1 tree-node-addChild',
          on: {
            click: function (e) {
              e.stopPropagation()
              self.addChild(e, node, data)
            }
          },
          attrs: {
            title: '添加子节点'
          }
        }),
        h('span', {
          'class': 'ipanel-icon1 tree-node-rename',
          on: {
            click: function (e) {
              e.stopPropagation()
              self.beforeRename(e.target, node, data)
            }
          },
          attrs: {
            title: '重命名'
          }
        }),
        h('a', {
          'class': ['ipanel-icon1 tree-node-renameok', self.curVal === '' ? 'disabled' : ''],
          style: {
            display: self.curId !== data.id || data.submiting ? 'none' : 'inline-block'
          },
          on: {
            click: function (e) {
              e.stopPropagation()
              self.curVal !== '' && self.rename(e, node, data)
            }
          },
          attrs: {
            title: '确认'
          }
        }),
        h('span', {
          'class': 'ipanel-icon1 tree-node-renameno',
          style: {
            display: self.curId !== data.id || data.submiting ? 'none' : 'inline-block'
          },
          on: {
            click: function (e) {
              e.stopPropagation()
              self.cancelRename(e, node, data)
            }
          },
          attrs: {
            title: '取消'
          }
        }),
        h('i', {
          'class': 'el-icon-loading',
          style: {
            display: self.curId === data.id && data.submiting ? 'inline-block' : 'none'
          }
        })
      ]
      /* 根节点不支持删除 */
      if (this.topAreaId !== data.id) {
        ctrs.push(h('span', {
          'class': 'ipanel-icon1 tree-node-del',
          on: {
            click: function (e) {
              e.stopPropagation()
              self.confirmDel(e, node, data)
            }
          },
          attrs: {
            title: '删除节点'
          }
        }))
      }
      return h('span', {'class': [wrapperClass, self.curId === data.id ? 'in-rename' : '']}, [
        /* 当该节点拥有子节点,但是还没被请求加载出来时,需要给用户提示该节点下含有子节点,可展开 */
        h('span', {
          'class': {
            'el-tree-node__expand-icon': data.isLeaf === 0 && (!data.children || data.children.length === 0)
          },
          /* 为了统一element-ui样式 */
          style: {
            position: 'relative',
            left: '-24px',
            marginRight: '-16px',
            display: data.isLeaf === 0 && (!data.children || data.children.length === 0) ? 'inline-block' : 'none'
          }
        }),
        h('span', {
          'class': 'tree-node-label'}, node.label || data.name),
        h('input', {
          'class': 'tree-node-input',
          domProps: {
            value: self.curVal
          },
          on: {
            click: function (e) { e.stopPropagation() },
            input (e) {
              let val = e.target.value
              let result = val.match(/([\u4e00-\u9fa5]|\w)+/g)
              result = result ? result.join('') : ''
              e.target.value = result
              self.curVal = result
            },
            keyup (e) {
              if (e.keyCode === 13 && self.curVal !== '') {
                self.rename(e, node, data)
              }
            }
          },
          attrs: {
            placeholder: '请设置区域名',
            maxlength: 10
          }
        }),
        h('span', {'class': 'tree-node-ctr'}, ctrs)
      ])
    },
    beforeRename (el, node, data) {
      if ($('.in-rename').length === 0) {
        this.curVal = data.name
        this.curId = data.id
      } else {
        this.$message({
          message: '请先执行完当前的修改操作!',
          type: 'warning'
        })
      }
    },
    /**
     * 重命名区域节点的名称,新建区域时,也会用到该方法,逻辑是新建一个子节点,设置子节点的isNew属性为true,在render
     * 树节点的content的过程中,通过判断节点的isNew属性来确认该节点是否初始显示输入框来输入节点名称.
     * 编辑区域时,通过设置curId属性来匹配当前编辑的节点,如果节点的id等于了curId,那该节点的编辑框就会显示出来,用户可以进行重命名操作.
     */
    rename (e, node, data) {
      let id = data.isNew ? undefined : data.id
      let name = this.curVal
      var $treeNode = $('.in-rename').eq(0)
      data.submiting = true
      if (name) {
        // 检测是否存在相同的区域名
        this.axios.get(API.check_area_exist, { params: { areaName: name, pId: data.pId, id } }).then(() => {
          if (data.isNew) {
            // 新建区域
            this.axios.post(API.add_area, { name, pId: data.pId }).then((res) => {
              data.name = name
              data.id = res.id
              data.isNew = false
              data.submiting = false
              this.curVal = ''
              this.curId = ''
              $treeNode.removeClass('in-rename')
              this.changeArea()
              this.$message({
                message: '添加成功!',
                type: 'success'
              })
            }).catch(() => {
              this.curVal = ''
              data.submiting = false
              this.$message({
                message: '添加失败!',
                type: 'error'
              })
            })
          } else {
            // 编辑区域
            this.axios.put(API.edit_area, { name, id }).then(() => {
              data.name = name
              data.submiting = false
              this.curVal = ''
              this.curId = ''
              $treeNode.removeClass('in-rename')
              this.changeArea()
              this.$message({
                message: '修改成功!',
                type: 'success'
              })
            }).catch(() => {
              this.curVal = ''
              data.submiting = false
              this.$message({
                message: '修改失败!',
                type: 'error'
              })
            })
          }
        }).catch((error) => {
          data.submiting = false
          this.$message({
            message: error.code === '201' ? '存在重复的区域名,请重新命名!' : '区域名查重失败!',
            type: 'warning'
          })
        })
      } else {
        this.cancelRename(e, node, data)
      }
    },
    cancelRename (e, node, data) {
      this.curVal = ''
      this.curId = ''
      if (data.isNew) {
        /* 取消新加的子节点 */
        this.removeChildren(e, node, data)
      }
    },
    addChild (e, node, data) {
      var self = this
      if ($('.in-rename').length === 0) {
        let id = data.id
        let newId = id + '-' + 1
        let newArea = {
          id: newId,
          name: '',
          isNew: true, // 为了识别重命名是编辑还是新建的时候发生的
          pId: data.id,
          isLeaf: 1
        }
        this.curId = newId
        
        /* 连续添加子节点时设置default-expanded-keys会失效,所以直接设置node的属性 */
        node.expanded = true
        this.addExpandedCst(id)

        if (data.isLeaf === 0 && (!data.children || data.children.length === 0)) {
          /* 当节点含有子节点但是并没有加载出来时,先将其子节点加载出来 */
          let params = {
            pId: data.id
          }
          this.axios.get(API.get_area_list, { params }).then((res) => {
            self.$set(data, 'children', res.rows.concat(newArea))
          })
        } else if (data.children && data.children.length > 0) {
          data.children.push(newArea)
        } else {
          self.$set(data, 'children', [newArea])
        }
      } else {
        this.$message({
          message: '请先执行完当前的修改操作!',
          type: 'warning'
        })
      }
    },
    confirmDel (e, node, data) {
      const self = this
      this.$confirm('区域删除后,该区域下的Portal与应用数据将被清空,是否继续?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $(e.target).removeClass('ipanel-icon1 tree-node-del').addClass('el-icon-loading')
        self.axios.delete(API.del_area, { params: { ids: data.id } }).then(function () {
          self.removeChildren(e, node, data)
          self.$message({
            type: 'success',
            message: '删除成功!'
          })
          $(e.target).addClass('ipanel-icon1 tree-node-del').removeClass('el-icon-loading')
        }).catch(function () {
          self.$message({
            type: 'error',
            message: '删除失败!'
          })
          $(e.target).addClass('ipanel-icon1 tree-node-del').removeClass('el-icon-loading')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    removeChildren (e, node, data) {
      let id = data.id
      let pData = node.parent.data
      let brothers = pData.children // 父节点的子节点数组
      for (let i = 0; i < brothers.length; i++) {
        let brother = brothers[i]
        if (brother.id === id) {
          if (brothers.length === 1) {
            this.removeExpandedCst(data.pId)
            pData.isLeaf = 1
          }
          this.removeExpandedCst(id)
          brothers.splice(i, 1)
          break
        }
      }
    },
    /**
     * 记录节点的展开状态,意图在于当局部刷新数据的时候,能及时的反映其展开状态
     */
    removeExpandedCst (key) {
      let idx = this.expandedCst.indexOf(key)
      this.expandedCst.includes(key) && this.expandedCst.splice(idx, 1)
    },
    addExpandedCst (key) {
      this.$nextTick(() => {
        !this.expandedCst.includes(key) && this.expandedCst.push(key)
      })
    },
    areaNodeClick (data, node) {
      if (data.isLeaf === 0 && (!data.children || data.children.length === 0)) {
        let params = {
          pId: data.id
        }
        this.axios.get(API.get_area_list, { params }).then((res) => {
          this.addExpandedCst(data.id)
          let children = res.rows.filter((ele) => {
            return ele.pId === data.id
          })
          if (data.children) {
            data.children = children
          } else {
            this.$set(data, 'children', children)
          }
        })
      }
    },
    changeArea () {
      this.$emit('update-area')
    }
  },
  created () {
  }
}
</script>
<style scoped>
.area-manage{
  padding: 20px;
  margin-bottom: 40px;
}
</style>
<style>
  .area-manage .tree-node-label{
    font-size: 14px;
    line-height: 36px;
    color: #475669;
    display: inline-block;
    vertical-align: middle;
  }
  .area-manage .tree-node-ctr{
    width: 80px;
    height: 36px;
    margin-left: 10px;
    display: none;
    align-items: center;
    justify-content: space-around;
  }
  .area-manage .el-tree-node__content{
    height: 36px;
    position: relative;
    cursor: default;
  }
  .area-manage .el-tree-node__content:hover .tree-node-conent:not(.in-rename) .tree-node-ctr{
    display: inline-flex;
    vertical-align: top;
  }
  .area-manage .tree-node-conent.in-rename .tree-node-ctr{
    width: 60px;
    display: inline-flex;
    vertical-align: top;
  }
  .area-manage .in-rename .tree-node-renameok,.area-manage .in-rename .tree-node-renameno{
    display: block;
  }
  .area-manage .in-rename .tree-node-del,.area-manage .in-rename .tree-node-rename,.area-manage .in-rename .tree-node-addChild{
    display: none;
  }
  .area-manage .in-rename .tree-node-input{
    display: inline-block;
    font-size: 14px;
  }
  .area-manage .tree-node-input:hover {
    border-color: #8391a5;
  }
  .area-manage .tree-node-input:focus {
    outline: 0;
    border-color: #20a0ff;
  }
  .area-manage .in-rename .tree-node-label{
    display: none;
  }
  .area-manage .ipanel-icon{
    display: inline-block;
    width: 18px;
    height: 18px;
  }
  .area-manage-tree .el-icon-loading{
    font-size: 16px;
    color: #717171;
    font-weight: bold;
  }
  .area-manage .tree-node-input{
    display: none;
    width: 100px;
    height: 30px;
    font-size: inherit;
    line-height: 1;
    outline: 0;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    background-color: #fff;
    padding: 3px 5px;
    margin-top: 3px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .area-manage .tree-node-input::-webkit-input-placeholder{
    font-size: 12px;
    line-height: 30px;
  }
  .area-manage .ipanel-icon:hover{
    cursor: pointer;
  }
  .area-manage .tree-node-rename{
    background-position-x: -23px;
    background-position-y: -71px;
  }
  .area-manage .tree-node-del{
    background-position-x: -185px;
    background-position-y: -72px;
  }
  .area-manage .tree-node-layout{
    background-position-x: -83px;
    background-position-y: -71px;
  }
  .area-manage .tree-node-renameok{
    display: none;
    background-position-x: -150px;
    background-position-y: -72px;
  }
  .area-manage .tree-node-renameno{
    display: none;
    background-position-x: -185px;
    background-position-y: -72px;
  }
  .area-manage .tree-node-addChild{
    background-position-x: -117px;
    background-position-y: -72px;
  }
  .area-manage .tree-node-renameok.disabled{
    cursor: no-drop;
  }
</style>

