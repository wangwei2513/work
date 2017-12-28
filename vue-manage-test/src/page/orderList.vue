<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-table 
      :data="tableData"
      @expand-change="expandChange"
      :expand-row-keys="expandRow"
      :row-key="row => row.index"
      style="width:100%">
      <el-table-column type='expand'>
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名">
              <span>{{props.row.user_name}}</span>
            </el-form-item>
            <el-form-item label="店铺名称">
              <span>{{props.row.restaurant_name}}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span>{{props.row.address}}</span>
            </el-form-item>
            <el-form-item label="店铺ID">
              <span>{{props.row.restaurant_id}}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{props.row.restaurant_address}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column 
        label="订单ID"
        prop='id'>
      </el-table-column>
      <el-table-column 
        label="总价格"
        prop='totle_count'>
      </el-table-column>
      <el-table-column 
        label="订单状态"
        prop='status'>
      </el-table-column>
    </el-table>
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
import Mock from "mockjs";
import {
  getOrder,
  getOrderData,
  getRestaurantDetail,
  getUserInfo,
  getAddressInfo
} from "../api/getData";
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
      expandRow: []
    };
  },
  components: {
    headTop
  },
  created() {
    this.mockData();
    this.restaurant_id = this.$route.query.restaurant_id;
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const contentData = await getOrderData({
          restaurant_id: this.restaurant_id
        });
        if (contentData.status === 1) {
          this.count = contentData.count;
        } else {
          throw new Error("获取数据失败！");
        }
        this.getOrder();
      } catch (error) {
        console.log("获取数据失败！", error);
      }
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getOrder();
    },
    async getOrder() {
      const orders = await getOrder({
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id
      });
      this.tableData = [];
      orders.data.forEach((item, index) => {
        const tableData = {};
        tableData.id = item.id;
        tableData.totle_count = item.totle_count;
        tableData.status = item.status;
        tableData.user_id = item.user_id;
        tableData.restaurant_id = item.restaurant_id;
        tableData.address_id = item.address_id;
        tableData.index = index;
        this.tableData.push(tableData);
      });
      console.log(this.tableData);
    },
    async expandChange(row) {
      console.log("status" + this.expandRow);
      if (this.expandRow.length === 0) {
        const restaurant = await getRestaurantDetail(row.restaurant_id);
        const userInfo = await getUserInfo(row.user_id);
        const addressInfo = await getAddressInfo(row.address_id);
        this.tableData.splice(row.index, 1, {
          ...row,
          ...{
            restaurant_name: restaurant.name,
            restaurant_address: restaurant.address,
            address: addressInfo.address,
            user_name: userInfo.name
          }
        });
        // console.log(this.tableData)
        this.$nextTick(() => {
          this.expandRow.push(row.index);
        });
      } else {
        const index = this.expandRow.indexOf(row.index);
        this.expandRow.splice(index, 1);
      }
    },
    mockData() {
      Mock.mock("/users/getOrderData", "get", {
        status: 1,
        count: 233
      });
      Mock.mock("/users/getRestaurantDetail", "get", {
        name: "沙县大酒店",
        address: "福建沙县"
      });
      Mock.mock("/users/getAddressInfo", "get", {
        address: "福建沙县"
      });
      Mock.mock("/users/getUserInfo", "get", {
        name: "捞翔"
      });
      Mock.mock("/users/getOrder", "get", {
        data: [
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurant_id: 21,
            address_id: 23
          },
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurant_id: 21,
            address_id: 23
          },
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurant_id: 21,
            address_id: 23
          },
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurant_id: 21,
            address_id: 23
          },
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurent_id: 21,
            address_id: 23
          },
          {
            id: 1,
            totle_count: 2113,
            status: "支付超时",
            user_id: "weiHuang",
            restaurant_id: 21,
            address_id: 23
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  width: 50%;
  margin-right: 0;
  margin-bottom: 0;
}
</style>

