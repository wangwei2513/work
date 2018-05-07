<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="data_section_title">数据统计</header>
      <el-row :gutter="20" class="mar_b_10">
        <el-col :span="5"><div class="data_list today_head"><span class="data_num head">当日数据：</span></div></el-col>
				<el-col :span="5"><div class="data_list"><span class="data_num">{{apiCount}}</span> API请求量</div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{userCount}}</span> 新增用户</div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{orderCount}}</span> 新增订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{adminCount}}</span> 新增管理员</div></el-col>
			</el-row>
      <el-row :gutter="20" >
        <el-col :span="5"><div class="data_list all_head"><span class="data_num head">全部数据:</span></div></el-col>
        <el-col :span="5"><div class="data_list">
            <span class="data_num">{{allApiCount}}
              <span class="wan" v-show="allApiCount > 10000">万</span>
            </span>api请求量
          </div>
        </el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allUserCount}}</span>注册用户</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allOrderCount}}</span>订单</div></el-col>
        <el-col :span="4"><div class="data_list"><span class="data_num">{{allAdminCount}}</span>注册管理员</div></el-col>
      </el-row>
    </section>
    <tendency :sevenDate="sevenDate" :sevenDay="sevenDay"></tendency>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import tendency from "../components/tendency";
import dtime from "time-formater";
import Mock from "mockjs";
import {
  apiCount,
  userCount,
  orderCount,
  adminCount,
  allApiCount,
  allUserCount,
  allOrderCount,
  allAdminCount
} from "../api/getData";
export default {
  data() {
    return {
      apiCount: null,
      userCount: null,
      orderCount: null,
      adminCount: null,
      allApiCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], [], []]
    };
  },
  components: {
    headTop,
    tendency
  },
  mounted() {
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      this.sevenDay.push(date);
    }
    this.MockData();
    this.initData();
    this.getSevenData();
  },
  methods: {
    async initData() {
      const today = dtime().format("YYYY-MM-DD");
      Promise.all([
        apiCount(today),
        userCount(today),
        orderCount(today),
        adminCount(today),
        allApiCount(),
        allUserCount(),
        allOrderCount(),
        allAdminCount()
      ])
        .then(res => {
          this.apiCount = res[0].count;
          this.userCount = res[1].count;
          this.orderCount = res[2].count;
          this.adminCount = res[3].count;
          this.allApiCount = res[4].count;
          this.allUserCount = res[5].count;
          this.allOrderCount = res[6].count;
          this.allAdminCount = res[7].count;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async getSevenData() {
      const apiArr = [[], [], [], []];
      this.sevenDay.forEach(item => {
        apiArr[0].push(apiCount(item));
        apiArr[1].push(userCount(item));
        apiArr[2].push(orderCount(item));
        apiArr[3].push(adminCount(item));
      });
      
      const promiseArr = [
        ...apiArr[0],
        ...apiArr[1],
        ...apiArr[2],
        ...apiArr[3]
      ];
      Promise.all(promiseArr)
        .then(res => {
          const resArr = [[], [], [], []];
          res.forEach((item, index) => {
            if (item.status == 1) {
              resArr[Math.floor(index / 7)].push(item.count);
            }
          });
          this.sevenDate = resArr;
          console.log(resArr);
        })
        .catch(error => {
          console.log(error);
        });
    },
    MockData() {
      Mock.mock("/users/apiCount", "get", {
        count: 23
      });
      Mock.mock("/users/userCount", "get", {
        count: 13
      });
      Mock.mock("/users/orderCount", "get", {
        count: 33
      });
      Mock.mock("/users/adminCount", "get", {
        count: 43
      });
      for (var i = 0; i < 7; i++) {
        console.log(this.sevenDay[i])
        console.log("/users/apiCount/"+this.sevenDay[i])
        Mock.mock("/users/apiCount/"+this.sevenDay[i], "get", {
          status:1,
          count: Math.floor(Math.random() * 200) + 5
        });
        Mock.mock("/users/userCount/"+this.sevenDay[i], "get", {
          status:1,
          count: Math.floor(Math.random() * 200) + 5
        });
        Mock.mock("/users/orderCount/"+this.sevenDay[i], "get", {
          status:1,
          count: Math.floor(Math.random() * 200) + 5
        });
        Mock.mock("/users/adminCount/"+this.sevenDay[i], "get", {
          status:1,
          count: Math.floor(Math.random() * 200) + 5
        });
      }
      Mock.mock("/users/allApiCount", "get", {
        count: 59
      });
      Mock.mock("/users/allUserCount", "get", {
        count: 73
      });
      Mock.mock("/users/allOrderCount", "get", {
        count: 83
      });
      Mock.mock("/users/allAdminCount", "get", {
        count: 93
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin.less";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .data_section_title {
    width: 100%;
    text-align: center;
    font-size: 36px;
    margin-bottom: 20px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    // line-height: 100%;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 24px;
      padding: 0 10px;
      color: #fff;
    }
  }
  .mar_b_10 {
    margin-bottom: 10px;
  }
  .today_head {
    background: orange;
  }
  .all_head {
    background: lightblue;
  }
}
</style>

