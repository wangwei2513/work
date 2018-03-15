<template>
  <div class="key-manage">
    <el-tabs v-model="tabsVal" type="card">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tabs"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="key-manage-content">
      <div class="key-manage-btns">
        <el-button type="primary" @click="importKey"><i class="ipanel-icon1 ipanel-icon-new"></i>导入</el-button>
        <el-button type="primary" @click="addKey"><i class="ipanel-icon2 ipanel-icon-link"></i>添加</el-button>
        <el-button type="primary" @click="editKey" :disabled="selection.length !== 1"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
        <el-button type="primary" @click="confirmDel" :disabled="selection.length === 0"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
        <div class="filter">
          <el-input icon="search" placeholder="请输入关键词"></el-input>
        </div>
      </div>
      <div class="key-manage-table">
        <el-table
          :height="479"
          @selection-change="selectionChange"
          :data="keys">
          <el-table-column
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            prop="label"
            label="关键词">
          </el-table-column>
        </el-table>
      </div>
      <add-keys
        :show.sync="view.addKeyShow"
        :isNew="view.isNew"
        :curKey="selection[0]"></add-keys>
    </div>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import AddKeys from './AddKeys'
export default {
  name: 'keyWordManage',
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
          title: '关键词管理',
          name: '1',
          closable: false
        }
      ],
      keys: [],
      filter: {
        area: []
      },
      selection: [],
      cascaderProp: {
        value: 'label',
        label: 'label'
      },
      view: {
        addKeyShow: false,
        isNew: true
      }
    }
  },
  components: {
    AddKeys
  },
  methods: {
    getKeyList () {
      var self = this
      this.$http.get(API.get_key_list).then(function (res) {
        var resbody = res.body
        if (resbody.ret === 0) {
          self.keys = resbody.keys
        }
      })
    },
    addKey () {
      this.view.addKeyShow = true
      this.view.isNew = true
    },
    editKey () {
      this.view.addKeyShow = true
      this.view.isNew = false
    },
    selectionChange (selection) {
      this.selection = selection
    },
    confirmDel () {
      var keys = []
      this.selection.forEach(function (key) {
        keys.push('"' + key.label + '"')
      }, this)
      this.$confirm('确认删除关键词:' + keys.join('，') + '?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }).catch(() => {})
    },
    importKey () {}
  },
  created () {
    this.getKeyList()
  }
}
</script>
<style scoped>
.key-manage{
  padding: 20px;
}
.filter{
  float: right;
  height: 36px;
  line-height: 36px;
}
.filter-title{
  font-size: 14px;
  color: #7b828c;
  margin-right: 10px;
}
.key-manage-table{
  margin-top: 20px;
}
/* 图标begin */
.ipanel-icon{
  display: inline-block;
  height: 20px;
  width: 20px;
  margin-right: 5px;
  flex-shrink: 0;
}
.ipanel-icon-new{
  background: url(../../../assets/imgs/icon/sprite.png) -82px -20px no-repeat;
}
.ipanel-icon-edit{
  background: url(../../../assets/imgs/icon/sprite.png) -106px -21px no-repeat;
}
.ipanel-icon-link{
  background: url(../../../assets/imgs/icon/sprite2.png) -24px -44px no-repeat;
}
.ipanel-icon-del{
  background: url(../../../assets/imgs/icon/sprite.png) 2px -21px no-repeat;
}
.el-button.is-disabled .ipanel-icon-edit{
  background: url(../../../assets/imgs/icon/sprite.png) -120px -46px no-repeat;
}
.el-button.is-disabled .ipanel-icon-link{
  background: url(../../../assets/imgs/icon/sprite2.png) -24px -71px no-repeat;
}
.el-button.is-disabled .ipanel-icon-del{
  background: url(../../../assets/imgs/icon/sprite.png) 2px -46px no-repeat;
}
/* 图标end */
</style>
<style>
.key-manage-btns .el-button span{
  display: flex;
  align-items: center;
}
</style>


