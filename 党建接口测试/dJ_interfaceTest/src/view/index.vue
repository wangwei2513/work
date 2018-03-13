<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-menu 
          default-active="defaultActive" 
          router 
          class="min_height"  
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>第一书记</span>
            </template>
            <el-menu-item index="">第一书记详情数据</el-menu-item>
            <el-menu-item index="">第一书记姓名职务</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>党组织信息</span>
            </template>
            <el-menu-item index="">查询党员所在组织的信息</el-menu-item>
            <el-menu-item index="">查询党员的权限角色类型及所管理员的组织ID</el-menu-item>
            <el-menu-item index="">查询平级的党组织信息</el-menu-item>
            <el-menu-item index="">查询该组织的党员信息</el-menu-item>
            <el-menu-item index="">搜索平级的党组织的党员</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>党员活动</span>
            </template>
            <el-menu-item index="">查询组织下的党员活动数据</el-menu-item>
            <el-menu-item index="">查询党员活动详情数据</el-menu-item>
            <el-menu-item index="">党员活动报名</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>通讯录</span>
            </template>
            <el-menu-item index="">查询组织</el-menu-item>
            <el-menu-item index="">查询指定组织下党员信息</el-menu-item>
            <el-menu-item index="">查询指定党员的详细数据</el-menu-item>
            <el-menu-item index="">查询具有管理权限的党委数据</el-menu-item>
            <el-menu-item index="">查询具有管理权限的支部数据</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>留言反馈</span>
            </template>
            <el-menu-item index="">提交党员留言(不要使用，测试OK)</el-menu-item>
            <el-menu-item index="">提交党员留言(新版,测试OK)</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>留言反馈查询</span>
            </template>
            <el-menu-item index="">查询留言反馈数据</el-menu-item>
            <el-menu-item index="">查询留言回复的数据</el-menu-item>
            <el-menu-item index="">提交回复</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>安排学习</span>
            </template>
            <el-menu-item index="">查询学习排行数据</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>学习课件</span>
            </template>
            <el-menu-item index="">返回用户学习的课件编号</el-menu-item>
            <el-menu-item index="">返回用户学习的课程数据</el-menu-item>
            <el-menu-item index="">返回用户学习的进度</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>通知公告</span>
            </template>
            <el-menu-item index="">返回用户的通知公告code</el-menu-item>
            <el-menu-item index="">设置通知公告已阅读</el-menu-item>
            <el-menu-item index="">查询提醒信息(通知公告没有阅读，则可以有提示信息提示进行阅读)</el-menu-item>
            <el-menu-item index="">查询通知公告阅读/处理人员的数据(已编码)(暂停使用)</el-menu-item>
            <el-menu-item index="">查询通知公告的状态</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>登录</span>
            </template>
            <el-menu-item index="">验证是否是党员</el-menu-item>
            <el-menu-item index="">登陆验证是否党员及同步数据至homed</el-menu-item>
            <el-menu-item index="">根据身份证号查询党员数据</el-menu-item>
            <el-menu-item index="">loginKG 接口</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>课程管理</span>
            </template>
            <el-menu-item index="">课件学习数据采集</el-menu-item>
            <el-menu-item index="">查询已学习完成的课件标识</el-menu-item>
            <el-menu-item index="">查询已学习完成的课件详情</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>互动交流</span>
            </template>
            <el-menu-item index="">新增互动交流</el-menu-item>
            <el-menu-item index="">查询互动交流</el-menu-item>
            <el-menu-item index="">互动交流点赞</el-menu-item>
            <el-menu-item index="">互动交流浏览</el-menu-item>
            <el-menu-item index="">新增互动交流的评论</el-menu-item>
            <el-menu-item index="">查询某条互动交流详细数据</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>智慧地图</span>
            </template>
            <el-menu-item index="">查询组织</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="">查询组织下的党员数量</el-menu-item>
            <el-menu-item index="">查询学习统计</el-menu-item>
            <el-menu-item index="">查询个人学习数据</el-menu-item>
            <el-menu-item index="">互动交流浏览</el-menu-item>
            <el-menu-item index="">新增互动交流的评论</el-menu-item>
            <el-menu-item index="">查询某条互动交流详细数据</el-menu-item>
            <el-menu-item index="">新增互动交流</el-menu-item>
            <el-menu-item index="">查询互动交流</el-menu-item>
            <el-menu-item index="">互动交流点赞</el-menu-item>
            <el-menu-item index="">互动交流浏览</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultActive:''
    }
  }
};
</script>

<style>

</style>
