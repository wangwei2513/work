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
    <tendency :sevenDate="sevenDate" :sevenDay="sevenDate"></tendency>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import tendency from "../components/tendency";
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
      sevenDate: [],
      sevenDate: [[], [], [], []]
    };
  },
  components: {
    headTop,
    tendency
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
  .today_head{
    background: orange;
  }
  .all_head{
    background: lightblue;
  }
}
</style>

