<template>
  <div class="ipanel-cascader">
    <el-input
      :class="focus?'focus':''"
      v-model="area"
      placeholder="请选择"
      suffix-icon="el-icon-caret-bottom">
    </el-input>
    <span class="ipanel-cascader-label" :class="disabled?'disabled':''" @click="toggleCascader"></span>
    <i @click="clearInput" v-show="clearable && area" class="el-input__icon el-icon-circle-close"></i>
    <transition :name="transitionDir">
      <div class="area-cascader-wp i-scollbar" v-show="focus">
        <el-tree
          ref="areaTree"
          node-key="id"
          check-strictly
          :data="areas"
          :lazy="lazy"
          :load="load"
          :props="areaProps"
          :default-checked-keys="checkedNode"
          :show-checkbox="mulitiple"
          :highlight-current="!mulitiple"
          :expand-on-click-node="mulitiple"
          :default-expanded-keys="defaultExpandedKeys"
          @current-change="currentChange"
          @check-change="(data, checked, childChecked) => {checkChange(false, data, checked, childChecked)}"
          >
        </el-tree>
      </div>
    </transition>
  </div>
</template>
<script>
  import bus from './../../assets/js/bus.js'
  export default {
    name: 'areaCascader',
    props: {
      selectedArea: [String, Number],
      areas: Array,
      disabled: Boolean,
      mulitiple: {
        type: Boolean,
        default () {
          return true
        }
      },
      lazy: Boolean,
      load: Function,
      areaProps: {
        type: Object,
        default () {
          return {
            label: 'name',
            children: 'children',
            isLeaf (data) {
              return data.isLeaf === 1
            }
          }
        }
      },
      defaultExpandedKeys: Array,
      clearable: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        area: '',
        checkedNode: [],
        focus: false,
        transitionDir: 'el-zoom-in-top',
        view: {
        }
      }
    },
    watch: {
      selectedArea: {
        immediate: true,
        handler (newVal) {
          if (this.mulitiple) {
            if (newVal || newVal === 0) {
              this.checkedNode = ('' + newVal).split(',')
              this.$refs.areaTree && this.$refs.areaTree.setCheckedKeys(this.checkedNode)
              this.$nextTick(function () {
                this.checkChange(true)
              })
            } else {
              this.checkedNode = []
              this.$refs.areaTree && this.$refs.areaTree.setCheckedKeys(this.checkedNode)
            }
          } else {
            this.$nextTick(() => {
              if (newVal === '') {
                this.$refs.areaTree.setCurrentKey('')
                this.$refs.areaTree.setCurrentNode({})
                this.area = ''
              } else {
                this.$refs.areaTree.setCurrentKey(newVal)
                let node = this.$refs.areaTree.getCurrentNode()
                if (node) {
                  this.area = node.name
                }
              }
            })
          }
        }
      },
      focus (val) {
        if (val) {
          var parentP = $(this.$el).offset()
          var windowH = window.innerHeight
          var top = 0
          if (windowH < parentP.top + 42 + 202) {
            top = parentP.top - 204
            this.transitionDir = 'el-zoom-in-bottom'
          } else {
            top = parentP.top + 42
            this.transitionDir = 'el-zoom-in-top'
          }
          $('.area-cascader-wp').css({
            top
          })
        }
      }
    },
    methods: {
      toggleCascader () {
        if (!this.disabled) {
          this.focus = !this.focus
        }
      },
      checkChange (isInit, data, checked, childChecked) {
        if (typeof data !== 'undefined') {
          if (checked) {
            // 如果该节点含有父节点,则父节点也需要选中,但是不需要处理其祖先节点,因为会自动触发check-change事件
            this.$refs.areaTree.setChecked(data.pId, true)
          } else {
            // 如果该节点含有子节点,则子节点需要取消选中,但是不需要处理其孙子节点,因为会自动触发check-change事件
            Array.isArray(data.children) && data.children.forEach(function (child) {
              this.$refs.areaTree.setChecked(child.id, false)
            }, this)
          }
        }
        var areas = this.$refs.areaTree.getCheckedNodes()
        var areaIds = []
        var areaName = []
        areas.forEach(function (area) {
          let id = area.id
          areaIds.push(id)
          areaName.push(area.name)
        }, this)
        this.area = areaName.join(',')
        !isInit && this.$emit('check-area', areaIds.join(','))
      },
      currentChange (data, node) {
        if (!this.mulitiple) {
          this.area = data.name
          this.$emit('check-area', '' + data.id)
          this.focus = false
        }
      },
      clearInput () {
        this.$refs.areaTree.store.setCurrentNode({})
        this.$emit('check-area', '')
        this.area = ''
      }
    },
    created () {
      const self = this
      bus.$on('hideCascader', function () {
        self.focus = false
      })
    }
  }
</script>
<style scoped>
  .ipanel-cascader{
    position: relative;
  }
  .ipanel-cascader-label{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .ipanel-cascader-label:hover{
    cursor: pointer;
  }
  .ipanel-cascader-label.disabled:hover{
    cursor: no-drop;
  }
  .area-cascader-wp{
    height: 180px;
    width: 200px;
    padding: 10px 0;
    z-index: 2;
    border: 1px solid #d1dbe5;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    position: fixed;
    top: 40px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #fff;
  }
  .el-tree{
    border: none;
  }
  .el-icon-circle-close{
    position: absolute;
    right: 25px;
    top: 0px;
    color: #b4bcce;
    cursor: pointer;
    font-size: 14px;
    line-height: 14px;
  }
</style>
<style>
  .ipanel-cascader .el-icon-caret-bottom{
    transition: all .5s timing-function delay;
  }
  .ipanel-cascader .focus .el-icon-caret-bottom{
    transform: rotate(180deg) !important;
  }
  .ipanel-cascader .el-tree .el-tree-node.is-current>.el-tree-node__content{
    background-color: #20a0ff !important;
    color: #fff;
  }
  .ipanel-cascader .el-tree .el-tree-node.is-current>.el-tree-node__content:hover{
    background-color: #1c8de0 !important;
  }
  .ipanel-cascader .el-tree-node__content {
    line-height: 23px;
    height: 24px;
    cursor: pointer;
  }
</style>
