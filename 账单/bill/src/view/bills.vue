<template>
  <div class="bills">
    <el-row>
      <el-col :span="20" :offset="2">
        <bill :billData="billData"></bill>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import bill from "../components/bill";
import { getAll } from "../api/api";
export default {
  data() {
    return {
      billData: []
    };
  },
  components: {
    bill
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        let res = await getAll();
        if (res.success) {
          res.data.forEach(item => {
            let bill = {
              title: item.title,
              message: item.message,
              mode: item.mode,
              number: item.number,
              totle: item.totle,
              date: item.date,
              time: item.time
            };
            this.billData.push(bill);
          });
          console.log(this.billData);
        } else {
          this.$message({
            type: "error",
            message: "获取数据失败！"
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>

</style>
