<template>
  <div class="visitor-pie">
    <div id="line1" class="line1"></div>
  </div>
  
</template>

<script>
import echarts from "echarts/lib/echarts";
//引入柱状图
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
export default {
  mounted() {
    this.myChart = echarts.init(document.getElementById("line1"));
    this.initData();
  },
  props: ["pieData"],
  methods: {
    initData() {
      console.log(this.pieData);
      const option = {
        title: {
          text: "用户分布",
          subtext: "",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["北京", "上海", "深圳", "杭州", "其他"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "75%",
            center: ["50%", "60%"],
            data: [
              { value: this.pieData.beijing, name: "北京" },
              { value: this.pieData.shanghai, name: "上海" },
              { value: this.pieData.shenzhen, name: "深圳" },
              { value: this.pieData.hangzhou, name: "杭州" },
              { value: this.pieData.qita, name: "其他" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.myChart.setOption(option);
    }
  },
  watch: {
    pieData: function() {
      this.initData();
    }
  }
};
</script>

<style>
.visitor-pie {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.line1 {
  width: 90%;
  height: 450px;
}
</style>
