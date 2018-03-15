<template>
  <div class="server-manage">
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
    <div class="server-manage-content">
      <div class="server-manage-btns">
        <el-button type="primary" @click="addServer" v-if="userRightList.includes('addServer')" class="top-operate"><i class="ipanel-icon1 ipanel-icon-new"></i>添加</el-button>
        <el-button type="primary" @click="editServer" v-if="userRightList.includes('editServer')" :disabled="selection.length !== 1" class="top-operate"><i class="ipanel-icon1 ipanel-icon-edit"></i>编辑</el-button>
        <el-button type="primary" @click="confirmDel" v-if="userRightList.includes('deleteServer')" :disabled="selection.length === 0" class="top-operate"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
        <el-button type="primary" @click="relateArea" v-if="userRightList.includes('assignServerToArea')" :disabled="selection.length !== 1" class="top-operate"><i class="ipanel-icon2 ipanel-icon-link"></i>关联区域</el-button>
        <div class="filter" v-if="userRightList.includes('listServers')">
          <label class="filter-title">关联区域</label>
          <area-cascader
            lazy
            :load="loadArea"
            :areas="areas"
            :mulitiple="false"
            :clearable="true"
            :default-expanded-keys="initExpand"
            :selected-area="filter.areaId"
            @check-area="filterByArea">
          </area-cascader>
        </div>
      </div>
      <div class="server-manage-table" v-if="userRightList.includes('listServers')">
        <el-table
          :height="479"
          border
          @selection-change="selectionChange"
          :data="serversCopy">
          <el-table-column
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            prop="serverName"
            label="服务器名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="serverIp"
            label="服务器地址"
            width="180">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="serverPort"
            label="端口"
            width="180">
          </el-table-column>
          <el-table-column
            prop="workDir"
            label="工作路径">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <add-server
      v-if="view.addServerShow"
      :show.sync="view.addServerShow"
      :isNew="view.isNew"
      :areas="areas"
      :curServer="selection[0]"
      @edit-server="changeCurServer"
      @update-server-list="$emit('update-server-list')">
    </add-server>
    
    <relate-area
      :show.sync="view.relateAreaShow"
      :curServer="selection[0]"
      :areas="areas"
      @update-server-list="$emit('update-server-list')">
    </relate-area>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import AddServer from './AddServer'
import RelateArea from './RelateArea'
import AreaCascader from './../../common/AreaCascader'
import loadAreaMixin from './../../../assets/js/loadAreaMixin'
export default {
  name: 'serverManage',
  mixins: [loadAreaMixin],
  props: {
    areas: {
      type: Array
    },
    userRightList: {
      type: Array
    },
    servers: {
      type: Array
    }
  },
  data () {
    return {
      tabsVal: '1',
      tabs: [
        {
          title: '服务器管理',
          name: '1',
          closable: false
        }
      ],
      serversCopy: [],
      filter: {
        areaId: ''
      },
      selection: [],
      cascaderProp: {
        value: 'id',
        label: 'label'
      },
      view: {
        addServerShow: false,
        relateAreaShow: false,
        isNew: true
      }
    }
  },
  watch: {
    servers: {
      immediate: true,
      handler (servers) {
        this.serversCopy = servers
      }
    }
  },
  components: {
    AddServer,
    RelateArea,
    AreaCascader
  },
  methods: {
    addServer () {
      this.view.addServerShow = true
      this.view.isNew = true
    },
    editServer () {
      this.view.addServerShow = true
      this.view.isNew = false
    },
    selectionChange (selection) {
      var selectionCopy = $.extend([], selection)
      this.selection = selectionCopy
    },
    confirmDel () {
      var servers = []
      var idArr = []
      this.selection.forEach(function (server) {
        servers.push('"' + server.serverName + '"')
        idArr.push(server.id)
      }, this)
      this.$confirm('确认删除服务器:' + servers.join('，') + '?', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.delServer(idArr).then(() => {
              instance.confirmButtonLoading = false
              done()
            })
          } else {
            instance.confirmButtonLoading = false
            done()
          }
        }
      }).catch(() => {})
    },
    delServer (idArr) {
      return this.axios.delete(API.del_server, { params: { ids: idArr.join(',') } }).then(() => {
        this.$emit('update-server-list')
        this.$message({
          message: '删除成功!',
          type: 'success'
        })
      }).catch((error) => {
        console.log(error)
        this.$message({
          message: '删除失败!',
          type: 'error'
        })
      })
    },
    relateArea () {
      this.view.relateAreaShow = true
    },
    changeCurServer (server) {
      $.extend(this.selection[0], server)
    },
    filterByArea (areaId) {
      if (areaId === '') {
        this.serversCopy = this.servers
      } else {
        this.serversCopy = this.servers.filter(function (server) {
          return '' + areaId === '' + server.areaId
        })
      }
    }
  }
}
</script>
<style scoped>
.server-manage{
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
.server-manage-table{
  margin-top: 20px;
}
.ipanel-cascader{
  float: right;
}
</style>
<style>
.server-manage-btns .el-button span{
  display: flex;
  align-items: center;
}
</style>


