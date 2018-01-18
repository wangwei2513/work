<template>
  <div class="fillcontain">
    <head-top></head-top>
    <visitor-pie :pieData='pieData'></visitor-pie>
  </div>
</template>

<script>
import headTop from '../components/headTop'
import visitorPie from '../components/visitorPie'
import {getVisiters} from '../api/getData'
import Mock from 'mockjs'
export default {
  data () {
    return {
      pieData:{}
    }
  },
  components: {
    headTop,
    visitorPie
  },
  mounted () {
    this.mockData()
    this.initData()
  },
  methods: {
    async initData() {
      try {
        const result = await getVisiters()
        console.log(result)
        if (result.status === 1) {
          this.pieData = result.cityList;
        } else {
          throw new Error(result)
        }
      } catch (error) {
        console.log('获取数据失败',error)
      }
    },
    mockData() {
      Mock.mock('/users/getVisiters','get',{
        status:1,
        cityList:{
          beijing:222,
          shanghai:134,
          shenzhen:155,
          hangzhou:101,
          qita:54
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../style/mixin.less';
</style>

