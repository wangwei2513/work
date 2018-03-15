<template>
  <div class="portal-statistics">
    <div class="filters">
      <el-col :span="1" class="filters-title">终端</el-col>
      <el-col :span="3">
        <el-select v-model="filter.terminal" placeholder="请选择">
          <el-option label="TV端" value="tv"></el-option>
          <el-option label="PC端" value="pc"></el-option>
          <el-option label="手机端" value="phone"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3" :offset="1">
        <el-select v-model="filter.subterminal" placeholder="请选择">
          <el-option label="标清盒子" value="720p"></el-option>
          <el-option label="高清盒子" value="1080p"></el-option>
          <el-option label="4K盒子" value="4k"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1" :offset="1" class="filters-title">区域</el-col>
      <el-col :span="3">
        <el-cascader
          :props="props"
          :options="areas"
          v-model="filter.area">
        </el-cascader>
      </el-col>
      <el-col :span="1" :offset="1" class="filters-title">Portal</el-col>
      <el-col :span="3">
        <el-select v-model="filter.terminal" placeholder="请选择">
          <el-option label="TV端" value="tv"></el-option>
          <el-option label="PC端" value="pc"></el-option>
          <el-option label="手机端" value="phone"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="filters">
      <el-col :span="1" class="filters-title">时间</el-col>
      <el-col :span="7">
        <div class="quick-select">
          <span @click="changeTime(1)" class="quick-select-item" :class="filter.quickTime === 1?'is-active':''">今天</span>
          <span @click="changeTime(-1)" class="quick-select-item" :class="filter.quickTime === -1?'is-active':''">昨天</span>
          <span @click="changeTime(7)" class="quick-select-item" :class="filter.quickTime === 7?'is-active':''">最近7天</span>
          <span @click="changeTime(30)" class="quick-select-item" :class="filter.quickTime === 30?'is-active':''">最近30天</span>
          <span class="quick-select__tri"><i class="icon-tri-up"></i></span>
        </div>
      </el-col>
      <el-col :span="4" :offset="1">
        <el-date-picker
          v-model="filter.timePeriod"
          type="datetimerange"
          placeholder="选择时间范围">
        </el-date-picker>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select v-model="filter.type" @change="changeFilter" placeholder="请选择">
          <el-option label="访问量" value="pv"></el-option>
          <el-option label="访客数" value="uv"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="graph">
      <div class="graph-total">
        <div><span class="font18">截至</span><span class="font18blue">{{flow.time}}</span></div>
        <div class="total-flow">{{flow.total}}</div>
        <div class="font14blue">访问量</div>
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
        <div class="portal-column">
          <h5>Portal栏目</h5>
          <el-tree :data="portalCol"></el-tree>
        </div>
        <div class="flow-graph">
          <div class="flow-graph-chart">
            <line-chart
            :chart-data="totalVisitData"
            :options="totalChartOptions"
            :width="780"
            :height="234"></line-chart>
            <el-button type="primary" class="flow-graph-btn">查看应用统计</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import API from './../../../assets/js/api'
import LineChart from './../../common/LineChart'
export default {
  name: 'portalStatistics',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      filter: {
        terminal: 'tv',
        subterminal: '1080p',
        area: [],
        timePeriod: '',
        quickTime: 1,
        type: 'pv'
      },
      portalCol: [],
      flow: {
        time: '2018/8/20 10:00:00',
        total: 12345
      },
      totalVisitData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: '访问量',
            backgroundColor: 'rgba(32, 160, 255, .3)',
            data: [40, 39, 10, 40, 39, 80, 40]
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
      props: {
        value: 'label',
        label: 'label'
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
      this.$nextTick(function () {
        this.transform($('.quick-select-item.is-active'), $('.portal-statistics .quick-select__tri'))
      })
    },
    getPortalConstruction () {
    },
    changeFilter () {
      this.totalVisitData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: this.filter.type,
            backgroundColor: 'rgba(32, 160, 255, .3)',
            data: [20, 39, 40, 0, 3, 20, 12]
          }
        ]
      }
    }
  },
  created () {
    this.$nextTick(function () {
      this.transform($('.quick-select-item.is-active'), $('.portal-statistics .quick-select__tri'))
    })
    this.getPortalConstruction()
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
  display: flex;
  overflow-x: auto;
  justify-content: space-around;
  align-items: center;
}
.graph-total{
  float: left;
  height: 234px;
  flex-shrink: 0;
  vertical-align: top;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.graph-chart{
  float: left;
  width: 740px;
  height: 250px;
  padding-top: 16px; 
  flex-shrink: 0;
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
.portal-column{
  float: left;
  height: 100%;
  width: 198px;
  box-sizing: border-box;
  border-right: thin solid #d6dbdf;
}
.flow-graph{
  float: left;
  width: calc(100% - 198px);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.portal-column h5{
  height: 42px;
  line-height: 42px;
  font-size: 14px;
  text-align: center;
  color: #1f2d3d;
  font-weight: bold;
  border-bottom: thin solid #d6dbdf;
  background-color: #eff2f7;
}
.portal-column .el-tree{
  border: none;
}
.flow-graph-chart{
  width: 780px;
  height: 250px;
  padding-top: 16px; 
  position: relative;
  box-sizing: border-box;
}
.flow-graph-btn{
  position: absolute;
  right: 0px;
  top: -50px;
}
</style>
