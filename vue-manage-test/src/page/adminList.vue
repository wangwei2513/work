<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table-container">
      <el-table 
        :data="tableData"
        class="width_100"
        header-cell-style="background:#eee"
      >
        <el-table-column
         label="姓名"
         prop="user_name"
         width="180">
        </el-table-column>
        <el-table-column
         label="注册日期"
         prop="register_time"
         width="180">
        </el-table-column>
        <el-table-column
         label="地址"
         prop="address"
         width="180">
        </el-table-column>
        <el-table-column
         label="权限"
         prop="admin"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
       :total="count" 
       :current-page="currentPage" 
       :page-size="20" 
       @current-change="handleCurrentChange"
       @size-change="handleSizeChange" 
       layout="total,prev,pager,next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { getAdminCount, getAdminList } from "../api/getData";
import Mock from "mockjs";
export default {
  data() {
    return {
      tableData: [],
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1
    };
  },
  components: {
    headTop
  },
  created() {
    this.mockData();
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const countData = await getAdminCount();
        console.log(countData);
        if (countData.status === 1) {
          this.count = countData.count;
        } else {
          this.$message.error("获取数据失败！");
        }
        this.getAdminList();
      } catch (error) {
        console.log("获取数据失败", error);
      }
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getAdminList();
    },
    async getAdminList() {
      try {
        const admins = await getAdminList();
        if (admins.status === 1) {
          this.tableData = []
          admins.data.forEach(item => {
            const tableData = {};
            tableData.user_name = item.user_name;
            tableData.register_time = item.register_time;
            tableData.address = item.address;
            tableData.admin = item.admin;
            this.tableData.push(tableData);
          });
        } else {
          throw new Error(admins.message);
        }
      } catch (error) {
        console.log("获取数据失败！", error);
      }
    },
    mockData() {
      Mock.mock("/users/getAdminCount", "get", {
        status: 1,
        count: 1231
      });
      Mock.mock("/users/getAdminList", "get", {
        status: 1,
        data: [
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          },
          {
            user_name: "weihuang",
            register_time: "2017/8/20",
            address: "深圳",
            admin: "管理员"
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin.less";
.width_100 {
  width: 100%;
}
.table-container {
  padding: 20px;
}
.background_cell_head{
  background-color: #ccc
}
</style>
