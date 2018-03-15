<template>
  <div class="item-statistics">
    <div class="filters" v-if="item.type === 'node'">
      <el-col :span="2" class="filters-title">应用名称</el-col>
      <el-col :span="4" :title="item.appTitle" class="font14dark">
      {{item.appTitle}}
      </el-col>
      <el-col :span="2" :offset="1" class="filters-title">一级栏目</el-col>
      <el-col :span="14" :title="item.nodeName" class="font14dark">
      {{item.nodeName}}
      </el-col>
    </div>
    <div class="filters" v-else>
      <el-col :span="2" class="filters-title">素材名称</el-col>
      <el-col :span="22" :title="item.title" class="font14dark">
        {{item.title}}
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
      <el-col :span="4" :offset="1">
        <el-date-picker
          v-model="filter.pastMonth"
          type="month"
          format="yyyy-MM"
          placeholder="选择年月"
          @change="changePeriod"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select v-model="filter.type" placeholder="请选择">
          <el-option v-for="(val, key) in visitTypeMap" :label="val" :value="key" :key="key"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="graph">
      <div class="graph-chart">
        <line-chart
        :chart-data="totalVisitData"
        :options="totalChartOptions"
        :width="960"
        :height="300"></line-chart>
      </div>
    </div>
  </div>
</template>
<script>
import LineChart from './../../common/LineChart'
import API from './../../../assets/js/api'
import util from './../../../assets/js/util'
export default {
  name: 'historyTrend',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      filter: {
        pastMonth: '',
        quickTime: '1',
        type: 'pv'
      },
      quickTimeMap: util.quickTimeMap,
      visitTypeMap: util.visitTypeMap,
      periodStaUrlMap: {
        'pv': API.get_app_period_pv,
        'uv': API.get_app_period_uv
      },
      monthStaUrlMap: {
        'pv': API.get_app_month_pv,
        'uv': API.get_app_month_uv
      },
      portalCol: [],
      totalVisitData: {
        labels: [],
        datasets: [
          {
            label: '',
            backgroundColor: 'rgba(32, 160, 255, .3)',
            data: []
          }
        ]
      },
      pickerOptions: {
        disabledDate (date) {
          let now = new Date().getTime()
          let target = new Date(date).getTime()
          return now < target
        }
      },
      totalChartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          position: 'bottom'
        }
      }
    }
  },
  computed: {
    itemId () {
      return this.$route.params.id
    }
  },
  watch: {
    filter: {
      immediate: true,
      deep: true,
      handler (filter) {
        var url = ''
        var params = {}
        var { type: itemType, id } = this.item
        var { quickTime: period, pastMonth: date, type } = filter
        if (period) {
          url = this.periodStaUrlMap[type]
          params = {
            period,
            [itemType + 'Id']: id
          }
        } else {
          url = this.monthStaUrlMap[type]
          params = {
            date: util.formatDate(date, 'YYYY-MM'),
            [itemType + 'Id']: id
          }
        }
        this.getItemStatics(url, params)
      }
    }
  },
  components: {
    LineChart
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
        this.transform($('.quick-select-item.is-active'), $('.item-statistics .quick-select__tri'))
      })
    },
    changePeriod (val) {
      if (val) {
        this.filter.quickTime = ''
      }
    },
    getItemStatics (url, params) {
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
          message: '获取' + visitType + '失败!',
          type: 'error'
        })
      })
    }
  },
  created () {
    this.$nextTick(function () {
      this.transform($('.quick-select-item.is-active'), $('.item-statistics .quick-select__tri'))
    })
  }
}
</script>
<style scoped>
.filters{
  line-height: 36px;
  margin-top: 20px;
  overflow: hidden;
}
.filters-title{
  font-size: 14px;
  color: #7b828c;
  max-width: 80px;
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
  height: 437px;
  margin: 25px 0;
  border-radius: 3px;
  box-sizing: border-box;
  border: thin solid #d6dbdf;
  display: flex;
  overflow-x: auto;
  justify-content: space-around;
  align-items: center;
}
.graph-chart{
  float: left;
  width: 960px;
  height: 300px;
  flex-shrink: 0;
  box-sizing: border-box;
}
.font14dark{
  font-size: 14px;
  color: #1f2d3d;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
