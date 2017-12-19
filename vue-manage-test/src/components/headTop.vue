<template>
  <div class="header_container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{path:'/manage'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" key='index'>{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown @command="handleCommand" menu-align="start">
      <img :src="baseImgPath + adminInfo.avatar" class="avatar">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="signOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {signOut} from "../api/getData"
import {baseImgPath} from "../config/env"
import {mapActions,mapState} from 'vuex'
export default {
  data () {
    return {
      baseImgPath
    }
  },
  created(){
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
  },
  computed: {
    ...mapState(['adminInfo'])
  },
  methods: {
    ...mapActions(['getAdminData']),
    async handleCommand(command){
      if (command === 'home') {
        this.$router.push('/manage')
      } else if(command === 'signOut'){
        const res = await signOut();
        if (res.status === 1) {
          this.$message({
            type:'seccess',
            message:'退出成功'
          })
          this.$router.push('/')
        } else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '../style/mixin.less';
.header_container{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  background-color:#eee; 
}
.avatar{
  .wh(36px,36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item{
  text-align: center;
}
</style>

