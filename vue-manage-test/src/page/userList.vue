<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table 
        :data="tableData" 
        highlight-current-row 
        class="height100">
        <el-table-column 
          type="index" 
          width="100">
        </el-table-column>
        <el-table-column 
          label="注册日期" 
          property="register_time" 
          width="220">
        </el-table-column>
        <el-table-column 
          label="用户姓名" 
          property="username" 
          width="220">
        </el-table-column>
        <el-table-column 
          label="注册地址" 
          property="city">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination 
          :total="count" 
          :current-page="currentPage" 
          :page-size="20" 
          @current-change="handleCurrentChange" 
          layout="total,prev,pager,next" 
          @size-change='handleSizeChange'
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Mock from "mockjs";
import headTop from "../components/headTop";
import { getUserList, getUserCount } from "../api/getData";
export default {
  data() {
    return {
      tableData: [
        {
          register_time: "2017/12/12",
          username: "weiHuang",
          city: "机场"
        }
      ],
      currentRow: null,
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
    this.initData();
  },
  methods: {
    async initData() {
      this.mockData();
      try {
        const countData = await getUserCount();
        console.log(countData);
        if (countData.status == 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getUsers();
        console.log(this.getUsers())
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
      this.getUsers();
    },
    async getUsers() {
      const Users = await getUserList(
      //   {
      //   offset: this.offset,
      //   limit: this.limit
      // }
      );
      console.log("users"+Users)
      this.tableData = [];
      Users.data.forEach(item => {
        const tableData = {};
        tableData.username = item.username;
        tableData.register_time = item.register_time;
        tableData.city = item.city;
        this.tableData.push(tableData);
      });
      console.log(this.tableData)
    },
    mockData() {
      Mock.mock("/users/count", "get", {
        status: 1
      });
      Mock.mock("/users/list", "get", {
        data:[
        {
          register_time: "2017/12/12",
          username: "weiHuang",
          city: "机场"
        },
        {
          register_time: "2017/12/13",
          username: "padarker",
          city: "水城"
        },
        {
          register_time: "2017/12/15",
          username: "miaomiaomiaoji",
          city: "hospital"
        },
        {
          register_time: "2017/12/16",
          username: "MC_AWM",
          city: "防空洞"
        },{
          register_time: "2017/12/12",
          username: "weiHuang",
          city: "机场"
        },
        {
          register_time: "2017/12/13",
          username: "padarker",
          city: "水城"
        },
        {
          register_time: "2017/12/15",
          username: "miaomiaomiaoji",
          city: "hospital"
        },
        {
          register_time: "2017/12/16",
          username: "MC_AWM",
          city: "防空洞"
        }
      ]
      });
    }
  }
};
</script>

<style>

</style>
