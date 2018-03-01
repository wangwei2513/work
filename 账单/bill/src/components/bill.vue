<template>
  <div class="bill">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24" v-for="item in billData" :key="item.id">
        <div class="bill-one">
          <el-row>
            <el-col :span="4" :offset="1">
              {{item.date}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="1">
              {{item.time}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="number-font">
              {{item.number}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4" :offset="20">
              {{item.title}}
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
      
  </div>
</template>

<script>
export default {
  props:['billData'],
  data () {
    return {
      
    }
  },
  mounted () {
    console.log(this.billData)
  }
}
</script>

<style>
.number-font{
  font-size: 1.8em;
}
.bill-one{
  background: #ccc;
  margin-top: 0.9em;
}
</style>
