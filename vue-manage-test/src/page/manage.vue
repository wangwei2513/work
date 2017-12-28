<template>
  <div class="manage_page fillcontain">
    <el-row class="height_100">
      <el-col :span="4" class="left_menu" style="height: 100%;">
        <el-menu default-active="default_active" router class="min_height"  text-color="#fff" background-color="#324057">
          <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
          <el-submenu index="2" class="li_background">
            <template slot="title"><i class="el-icon-document"></i>数据管理</template>
            <el-menu-item index="userList">用户列表</el-menu-item>
            <el-menu-item index="shopList">商家列表</el-menu-item>
            <el-menu-item index="foodList">食品列表</el-menu-item>
            <el-menu-item index="orderList">订单列表</el-menu-item>
            <el-menu-item index="adminList">管理员列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3" class="li_background">
            <template slot="title"><i class="el-icon-plus"></i>添加数据</template>
            <el-menu-item index="addShop">添加商铺</el-menu-item>
            <el-menu-item index="addGoods">添加商品</el-menu-item>
          </el-submenu>
          <el-submenu index="4" class="li_background">
            <template slot="title"><i class="el-icon-star-off"></i>图表</template>
            <el-menu-item index="visitor">用户分布</el-menu-item>
          </el-submenu>
          <el-submenu index="5" class="li_background">
            <template slot="title"><i class="el-icon-edit"></i>编辑</template>
            <el-menu-item index="vueEdit">文本编辑</el-menu-item>
          </el-submenu>
          <el-submenu index="6" class="li_background">
            <template slot="title"><i class="el-icon-setting"></i>设置</template>
            <el-menu-item index="adminSet">管理员设置</el-menu-item>
          </el-submenu>
          <el-submenu index="7" class="li_background">
            <template slot="title"><i class="el-icon-warning"></i>说明</template>
            <el-menu-item index="explain">说明</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" class="right_content">
				<keep-alive>
				    <router-view></router-view>
				</keep-alive>
			</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    default_active: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin.less";
.left_menu {
  min-height: 100%;
  background-color: #324057;
}
.min_height {
  min-height: 100%;
}
.height_100 {
  height: 100%;
}
.right_content {
  height: 100%;
  overflow: auto;
}
.el-submenu .el-menu-item {
  background-color: #24334a;
}
</style>

