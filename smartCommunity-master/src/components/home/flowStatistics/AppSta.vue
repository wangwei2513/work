<template>
  <div class="app-statistics">
    <div class="filters">
      <el-col :span="1" class="filters-title">终端</el-col>
      <el-col :span="3">
        <el-select v-model="filter.terminal" @change="getAppList" placeholder="请选择">
          <el-option v-for="(val,key) in deviceMap" :label="val" :key="key" :value="key"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1" :offset="1" class="filters-title">区域</el-col>
      <el-col :span="3">
        <area-cascader
          lazy
          :value="filter.areaIds"
          :load="loadArea"
          :areas="areas"
          :mulitiple="false"
          :area-props="{label:'name',children:'children'}"
          :default-expanded-keys="initExpand"
          :selected-area="filter.areaIds"
          @check-area="checkArea">
        </area-cascader>
      </el-col>
      <el-col :span="1" :offset="1" class="filters-title">应用</el-col>
      <el-col :span="3">
        <el-select v-model="filter.appId" placeholder="请选择">
          <el-option v-for="app in appList" :label="app.appName" :key="app.id" :value="app.id"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="filters">
      <el-col :span="1" class="filters-title">时间</el-col>
      <el-col :span="7">
        <div class="quick-select">
          <span 
            v-for="(val, key) in quickTimeMap"
            @click="changeTime(key)"
            class="quick-select-item"
            :key="key"
            :class="filter.quickTime === key?'is-active':''">
            {{val}}
          </span>
          <span class="quick-select__tri" v-show="Object.keys(quickTimeMap).includes(filter.quickTime)"><i class="icon-tri-up"></i></span>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <el-date-picker
          v-model="filter.pastMonth"
          type="month"
          format="yyyy-MM"
          placeholder="选择年月"
          @change="changePeriod"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="3" :offset="5">
        <el-select v-model="filter.type" placeholder="请选择">
          <el-option v-for="(val, key) in visitTypeMap" :label="val" :value="key" :key="key"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="graph">
      <div class="graph-total">
        <div><span class="font18">截至</span><span class="font18blue">{{flow.time}}</span></div>
        <div class="total-flow">
          <num-change :value="flow.total"></num-change>
        </div>
        <div class="font14blue">{{visitTypeMap[filter.type]}}</div>
      </div>
      <div class="graph-chart">
        <line-chart
        :chart-data="totalVisitData"
        :options="totalChartOptions"
        :width="740"
        :height="234"></line-chart>
      </div>
    </div>
    <div class="flow-detail">
      <h4>访问明细</h4>
      <div class="flow-detail-inner">
        <div class="app-column">
          <h5>应用栏目</h5>
          <div class="app-column-nodes i-scollbar">
            <el-tree
              lazy
              ref="nodeTree"
              node-key="id"
              highlight-current
              :data="appNodes"
              :load="loadNode"
              :props="{label:'title',children:'children',isLeaf (data) {return data.isLeaf === 1}}"
              :expand-on-click-node="false"
              :render-content="renderNodeLabel"
              :default-expanded-keys="nodesExpand"
              @current-change="currentChange"></el-tree>
          </div>
        </div>
        <div class="flow-graph">
          <div class="flow-graph-title"><h5>素材</h5><div class="flow-graph-node-name" :title="colSelect.join(' - ') || '无'">所属栏目:{{colSelect.join(' - ') || '无'}}</div></div>
          <div class="flow-graph-table">
            <el-table
              :data="nodeEntrys"
              :height="410"
              border>
              <el-table-column
                prop="title"
                label="素材标题"
                width="360">
              </el-table-column>
              <el-table-column
                :prop="filter.type"
                :label="visitTypeMap[filter.type]"
                sortable
                width="260">
              </el-table-column>
              <el-table-column
                label="历史趋势">
                <template slot-scope="scope">
                  <span
                    class="icon-staistics"
                    @click="$emit('history-trend', {type: 'entry', title: scope.row.title, id: scope.row.id})">
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import util from './../../../assets/js/util'
import loadAreaMixin from './../../../assets/js/loadAreaMixin'
import AreaCascader from './../../common/AreaCascader'
import NumChange from './../../common/NumChange'
import LineChart from './../../common/LineChart'
export default {
  name: 'appStatistics',
  mixins: [loadAreaMixin],
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      filter: {
        terminal: '1',
        areaIds: '',
        appId: '',
        area: [],
        pastMonth: '',
        quickTime: '1',
        type: 'pv'
      },
      quickTimeMap: util.quickTimeMap,
      deviceMap: util.deviceMap,
      visitTypeMap: util.visitTypeMap,
      totalStaUrlMap: {
        'pv': API.get_app_total_pv,
        'uv': API.get_app_total_uv
      },
      periodStaUrlMap: {
        'pv': API.get_app_period_pv,
        'uv': API.get_app_period_uv
      },
      monthStaUrlMap: {
        'pv': API.get_app_month_pv,
        'uv': API.get_app_month_uv
      },
      colSelect: [],
      appList: [],
      appNodes: [],
      nodeCurKey: '',
      nodeEntrys: [],
      pickerOptions: {
        disabledDate (date) {
          let now = new Date().getTime()
          let target = new Date(date).getTime()
          return now < target
        }
      },
      totalVisitData: {
        labels: [],
        datasets: [
          {
            label: '访问量',
            backgroundColor: 'rgba(32, 160, 255, .3)',
            data: []
          }
        ]
      },
      totalChartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom'
        }
      },
      flow: {
        time: '',
        total: 0
      },
      props: {
        value: 'label',
        label: 'label'
      }
    }
  },
  components: {
    LineChart,
    AreaCascader,
    NumChange
  },
  computed: {
    initExpand () {
      var expand = []
      if (this.areas.length > 0) {
        expand.push(this.areas[0].id)
      }
      return expand
    },
    nodesExpand () {
      var expand = []
      if (this.appNodes.length > 0) {
        expand.push(this.appNodes[0].id)
      }
      return expand
    }
  },
  watch: {
    areas: {
      immediate: true,
      handler (areas) {
        if (areas.length > 0) {
          /* 初始化首选区域,以及首选区域下的应用列表 */
          this.filter.areaIds = areas[0].id + ''
          this.getAppList()
        }
      }
    },
    filter: {
      immediate: true,
      deep: true,
      handler (filter) {
        if (filter.appId) {
          this.getTotalSta()
          this.getAppConstruction()
          var url = ''
          var params = {}
          var { quickTime: period, pastMonth: date, appId } = filter
          if (filter.quickTime) {
            url = this.periodStaUrlMap[filter.type]
            params = {
              period,
              appId
            }
          } else {
            url = this.monthStaUrlMap[filter.type]
            params = {
              date: util.formatDate(date, 'YYYY-MM'),
              appId
            }
          }
          this.getAppStatics(url, params)
        }
      }
    },
    nodeCurKey: {
      handler (newKey) {
        this.$refs.nodeTree.setCurrentKey(newKey)
        if (newKey) {
          this.getNodeEntery()
        }
      }
    }
  },
  methods: {
    transform ($parent, $el) {
      var w = $parent.innerWidth()
      var position = $parent.position()
      if (typeof w !== 'undefined' && typeof position.left !== 'undefined') {
        $el.css({
          width: w,
          transform: 'translateX(' + position.left + 'px)'
        })
      }
    },
    changeTime (day) {
      this.filter.quickTime = day
      this.filter.pastMonth = ''
      this.$nextTick(function () {
        this.transform($('.quick-select-item.is-active'), $('.app-statistics .quick-select__tri'))
      })
    },
    changePeriod (val) {
      if (val) {
        this.filter.quickTime = ''
      }
    },
    getAppList () {
      let { terminal, areaIds } = this.filter
      let params = {
        deviceId: terminal,
        areaId: areaIds,
        page: 1,
        size: 999
      }
      this.axios.get(API.get_app_list, { params }).then((data) => {
        this.appList = data.rows
        this.filter.appId = data.rows.length > 0 ? data.rows[0].id : ''
      }).catch(() => {
        this.$message({
          message: '获取应用列表失败!',
          type: 'error'
        })
      })
    },
    getTotalSta () {
      this.flow.time = util.formatDate(new Date(), 'YYYY/MM/DD hh:mm:ss')
      let visitType = this.filter.type
      let url = this.totalStaUrlMap[visitType]
      let params = {
        appId: this.filter.appId
      }
      this.axios.get(url, { params }).then((data) => {
        this.flow.total = data.totalRate || 0
      }).catch(() => {
        this.$message({
          message: '获取应用总' + this.visitTypeMap[visitType] + '失败!',
          type: 'error'
        })
      })
    },
    getAppStatics (url, params) {
      let visitType = this.visitTypeMap[this.filter.type]
      this.axios.get(url, { params }).then((data) => {
        let keys = []
        let vals = []
        for (var key in data.timeDataMap) {
          if (data.timeDataMap.hasOwnProperty(key)) {
            var val = data.timeDataMap[key]
            keys.push(key)
            vals.push(val || 0)
          }
        }
        this.totalVisitData = {
          labels: keys,
          datasets: [
            {
              label: visitType,
              backgroundColor: 'rgba(32, 160, 255, .3)',
              data: vals
            }
          ]
        }
      }).catch(() => {
        this.$message({
          message: '获取应用' + visitType + '失败!',
          type: 'error'
        })
      })
    },
    getAppConstruction () {
      let params = {
        appId: this.filter.appId
      }
      this.axios.get(API.get_statistics_nodes, { params }).then((data) => {
        let rootId = 0
        data.rows.forEach(function (node) {
          node.pv = node.pv || 0
          node.uv = node.uv || 0
          if (node.pId === 0) {
            rootId = node.id
          }
        }, this)
        /* 将获取的列表数据结构转换为树型结构 */
        let nodeTree = util.list2tree(data.rows, rootId, 'title')
        this.appNodes = nodeTree
        this.nodeCurKey = nodeTree.length > 0 ? nodeTree[0].id : ''
        this.colSelect = nodeTree.length > 0 ? [nodeTree[0].title] : []
      }).catch(() => {
        this.$message({
          message: '获取应用栏目列表失败!',
          type: 'error'
        })
      })
    },
    getNodeEntery () {
      let params = {
        nodeId: this.nodeCurKey
      }
      this.axios.get(API.get_statistics_entrys, { params }).then((data) => {
        data.rows.forEach(function (entry) {
          entry.pv = entry.pv || 0
          entry.uv = entry.uv || 0
        }, this)
        this.nodeEntrys = data.rows
        this.total = data.total
      }).catch(() => {
        this.$message({
          message: '获取栏目关联素材失败!',
          type: 'error'
        })
      })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(node.data.key ? [node.data] : [])
      }
      if (node.level === 1 || node.level === 2) {
        return resolve(node.data.children || [])
      }
      if (node.level > 2) {
        let params = {
          pId: node.data.id,
          page: 1,
          size: 999
        }
        this.axios.get(API.get_node_list, { params }).then((res) => {
          res.rows.forEach(function (row) {
            row.tempId = null
          }, this)
          resolve(res.rows)
        }).catch(() => {
          resolve([])
          this.$message({
            message: '获取子栏目失败!',
            type: 'error'
          })
        })
      }
    },
    renderNodeLabel (h, { data }) {
      var self = this
      return h('span', {
        style: {
          fontSize: '14px'
        },
        attrs: {
          title: this.visitTypeMap[this.filter.type] + '：' + (data[this.filter.type] || 0)
        }
      }, [data.title + '（' + (data[this.filter.type] || 0) + '）', h('span', {
        class: ['icon-staistics'],
        attrs: {
          title: '查看历史趋势'
        },
        on: {
          click () {
            self.$emit('history-trend', {type: 'node', appTitle: data.appName, id: data.id, nodeName: data.title})
          }
        }
      }, [])])
    },
    currentChange (data, node) {
      this.nodeCurKey = data.id
      this.colSelect = this.getNodeParentName(node)
    },
    getNodeParentName (node) {
      var name = [node.label]
      if (node.parent && node.parent.level !== 0) {
        name = this.getNodeParentName(node.parent).concat(name)
      }
      return name
    },
    checkArea (areaIds) {
      this.filter.areaIds = areaIds
      this.getAppList()
    }
  },
  created () {
    this.$nextTick(function () {
      this.transform($('.quick-select-item.is-active'), $('.app-statistics .quick-select__tri'))
    })
  }
}
</script>
<style scoped>
.filters{
  line-height: 36px;
  margin-top: 20px;
  height: 40px;
}
.filters-title{
  font-size: 14px;
  color: #7b828c;
  text-align: right;
  padding-right: 10px;
}
.quick-select{
  position: relative;
  display: inline-block;
  text-align: center;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.quick-select:hover{
  border-color: #8391a5;
}
.quick-select-item{
  font-size: 14px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  box-sizing: border-box;
  color: #8391a5;
  padding: 0 10px;
  cursor: pointer;
  transition: color .2s cubic-bezier(.645,.045,.355,1);
}
.quick-select-item.is-active{
  color: #20a0ff;
}
.quick-select-item:not(.is-active):hover{
  color: #000;
}
.quick-select__tri{
  position: absolute;
  height: 6px;
  left: 0px;
  bottom: 0px;
  transition: all .3s cubic-bezier(.645,.045,.355,1)
}
.icon-tri-up{
  width: 0;
  height: 0;
  border-top: none;
  display: block;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 6px solid #20a0ff;
  margin-left: calc(50% - 4px);
}
.graph{
  width: 100%;
  height: 260px;
  margin: 25px 0;
  border-radius: 3px;
  box-sizing: border-box;
  border: thin solid #d6dbdf;
  overflow-x: auto;
}
.graph-total{
  float: left;
  height: 234px;
  width: calc(100% - 740px);
  vertical-align: top;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.graph-chart{
  float: right;
  width: 740px;
  height: 250px;
  padding-top: 20px;
  box-sizing: border-box;
}
.font18{
  color: #233141;
  font-size: 18px;
}
.font18blue{
  color: #20a0ff;
  font-size: 18px;
  margin-left: 16px;
}
.total-flow{
  font-size: 72px;
  width: 100%;
  text-align: center;
  color: #20a0ff;
}
.font14blue{
  color: #20a0ff;
  font-size: 14px;
  width: 100%;
  text-align: center;
}
.flow-detail-inner{
  height: 500px;
  width: 100%;
  border-radius: 3px;
  margin-bottom: 50px;
  border: thin solid #d6dbdf;
  box-sizing: border-box;
}
.flow-detail h4{
  font-size: 18px;
  font-weight: bold;
  color: #3f4f61;
  padding: 10px 0;
}
.app-column{
  float: left;
  height: 100%;
  width: 198px;
  box-sizing: border-box;
  border-right: thin solid #d6dbdf;
}
.app-column-nodes{
  height: calc(100% - 43px);
  width: 100%;
  overflow: auto;
}
.flow-graph{
  float: left;
  width: calc(100% - 198px);
  height: 100%;
}
.flow-graph-title{
  position: relative;
}
.flow-graph-node-name{
  position: absolute;
  top: 0;
  right: 20px;
  height: 100%;
  line-height: 42px;
  font-size: 14px;
  right: 20px;
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.app-column h5,.flow-graph h5{
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  text-align: center;
  color: #1f2d3d;
  font-weight: bold;
  border-bottom: thin solid #d6dbdf;
  background-color: #eff2f7;
}
.flow-graph h5 span{
  float: right;
  font-weight: normal;
  margin-right: 20px;
}
.app-column .el-tree{
  border: none;
}
.flow-graph-table{
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
}
.el-pagination{
  text-align: right;
  margin-top: 5px;
}
.popover-p{
  margin: 10px 0;
}
.relate-column-item{
  font-size: 12px;
  line-height: 14px;
}
@media screen and (max-width: 1220px)  {
.total-flow{
  font-size: 40px;
}
.graph-total{
  max-width: 220px;
}
}
@media screen and (min-width: 1220px) and (max-width: 1400px)  {
.total-flow{
  font-size: 60px;
}
}
</style>
<style>
.app-statistics .el-tree-node .icon-staistics{
  display: none;
  position: absolute;
  width: 42px;
  height: 100%;
  right: 0;
  top: 0;
  background-position: 10px 5px;
  background-color: rgba(178, 210, 234, 0.6);
}
.app-statistics .el-tree-node__content{
  position: relative;
}
.app-statistics .el-tree-node__content:hover .icon-staistics{
  display: inline-block;
}
.app-statistics .el-tree-node.is-current>.el-tree-node__content {
  background-color: #d3dce6 !important;
}
</style>
