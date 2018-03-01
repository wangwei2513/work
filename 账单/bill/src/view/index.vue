<template>
  <div class="index">
    <el-row>
      <el-col :span="14" :offset="3" class="title">
        <span>{{name}}的账单</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4">
        <el-menu :default-active="defaultActive" mode="horizontal" router >
          <el-menu-item index="bills">全部账单</el-menu-item>
          <el-menu-item index="addBill">添加账单</el-menu-item>
          <el-menu-item index="detail">明细</el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
    <!-- <el-row>
      <template slot-scope="scope">
        <el-col :span="4" :offset="1">
          <bill :billData="billData[scope.$index]"></bill>
        </el-col>
      </template>
    </el-row> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "me",
      defaultActive:'bills'
    };
  }
};
</script>

<style>
.title {
  text-align: left;
  font-size: 28px;
  margin-top: 1em;
  margin-bottom: 1em; 
}
</style>
