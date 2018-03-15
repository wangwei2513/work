<template>
  <div class="left_menu">
    <el-row>
      <el-col :span="6" class="left_menu">
        <div class="left_menu">
        <el-menu 
          default-active="defaultActive" 
          router 
          class="min_height"  
          text-color="#fff" 
          background-color="#324057"
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
          <el-submenu index="4">
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
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>留言反馈</span>
            </template>
            <el-menu-item index="">提交党员留言(不要使用，测试OK)</el-menu-item>
            <el-menu-item index="">提交党员留言(新版,测试OK)</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>留言反馈查询</span>
            </template>
            <el-menu-item index="">查询留言反馈数据</el-menu-item>
            <el-menu-item index="">查询留言回复的数据</el-menu-item>
            <el-menu-item index="">提交回复</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>安排学习</span>
            </template>
            <el-menu-item index="">查询学习排行数据</el-menu-item>
          </el-submenu>
          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>学习课件</span>
            </template>
            <el-menu-item index="">返回用户学习的课件编号</el-menu-item>
            <el-menu-item index="">返回用户学习的课程数据</el-menu-item>
            <el-menu-item index="">返回用户学习的进度</el-menu-item>
          </el-submenu>
          <el-submenu index="9">
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
          <el-submenu index="10">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>登录</span>
            </template>
            <el-menu-item index="">验证是否是党员</el-menu-item>
            <el-menu-item index="">登陆验证是否党员及同步数据至homed</el-menu-item>
            <el-menu-item index="">根据身份证号查询党员数据</el-menu-item>
            <el-menu-item index="">loginKG 接口</el-menu-item>
          </el-submenu>
          <el-submenu index="11">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>课程管理</span>
            </template>
            <el-menu-item index="">课件学习数据采集</el-menu-item>
            <el-menu-item index="">查询已学习完成的课件标识</el-menu-item>
            <el-menu-item index="">查询已学习完成的课件详情</el-menu-item>
          </el-submenu>
          <el-submenu index="12">
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
          <el-submenu index="13">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>智慧地图</span>
            </template>
            <el-menu-item index="">查询组织</el-menu-item>
          </el-submenu>
          <el-submenu index="14">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="">查询组织下的党员数量</el-menu-item>
            <el-menu-item index="">查询学习统计</el-menu-item>
            <el-menu-item index="">查询个人学习数据</el-menu-item>
            <el-menu-item index="">查询课件排行统计</el-menu-item>
            <el-menu-item index="">查询课程排行统计</el-menu-item>
            <el-menu-item index="">查询通知公告排行统计</el-menu-item>
            <el-menu-item index="">查询通知阅读及办理详情</el-menu-item>
            <el-menu-item index="">查询组织的活动统计</el-menu-item>
            <el-menu-item index="">查询一事一记的发布统计数据</el-menu-item>
          </el-submenu>
          <el-submenu index="15">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>一事一记</span>
            </template>
            <el-menu-item index="">查询一事一记类别</el-menu-item>
            <el-menu-item index="">新增一事一记</el-menu-item>
            <el-menu-item index="">查询已发布的一事一记数据</el-menu-item>
            <el-menu-item index="">按区域查询已发布的一事一记数据</el-menu-item>
            <el-menu-item index="">设置一事一记已阅读</el-menu-item>
          </el-submenu>
          <el-submenu index="16">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>任务</span>
            </template>
            <el-menu-item index="">发布任务</el-menu-item>
            <el-menu-item index="">编辑已发布的任务</el-menu-item>
            <el-menu-item index="">查询本组织及下级组织里的党员数据</el-menu-item>
            <el-menu-item index="">查询书记和管理员可以向其指派任务的组织数据</el-menu-item>
            <el-menu-item index="">查询指定组织下的书记和管理员数据</el-menu-item>
            <el-menu-item index="">查询我执行的任务列表数据</el-menu-item>
            <el-menu-item index="">我执行的任务的详情</el-menu-item>
            <el-menu-item index="">查询我发表的任务列表数据</el-menu-item>
            <el-menu-item index="">我发布的任务详情</el-menu-item>
            <el-menu-item index="">设置任务为完成状态</el-menu-item>
            <el-menu-item index="">新增任务的反馈信息</el-menu-item>
            <el-menu-item index="">任务提醒(</el-menu-item>
          </el-submenu>
          <el-submenu index="17">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>签到</span>
            </template>
            <el-menu-item index="">新增签到</el-menu-item>
            <el-menu-item index="">查询签到</el-menu-item>
            <el-menu-item index="">查询用户签到地点及考勤相关配置</el-menu-item>
            <el-menu-item index="">查询用户当日工作考勤签到数据</el-menu-item>
          </el-submenu>
          <el-submenu index="18">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>组织换届</span>
            </template>
            <el-menu-item index="">换届申请</el-menu-item>
            <el-menu-item index="">查询已提交的换届申请</el-menu-item>
            <el-menu-item index="">查询保存为草稿的换届申请</el-menu-item>
            <el-menu-item index="">换届申请的草稿数据的编辑(已提交的申请数据不可修改，仅草稿数据可以修改)</el-menu-item>
            <el-menu-item index="">审批换届申请</el-menu-item>
            <el-menu-item index="">上传换届选举批复文件</el-menu-item>
            <el-menu-item index="">查询保存为草稿的换届选举批复文件</el-menu-item>
            <el-menu-item index="">查询已提交的换届选举批复文件</el-menu-item>
            <el-menu-item index="">换届选举批复文件草稿数据的编辑(已提交的数据不可修改，仅草稿数据可以修改)</el-menu-item>
            <el-menu-item index="">审批换届选举批复文件</el-menu-item>
            <el-menu-item index="">录入届次、差额人选名单信息</el-menu-item>
            <el-menu-item index="">查询保存为草稿的届次、差额人选名单信息</el-menu-item>
            <el-menu-item index="">查询已提交的届次、差额人选名单信息</el-menu-item>
            <el-menu-item index="">审批差额人选名单信息</el-menu-item>
            <el-menu-item index="">上传选举结果文件</el-menu-item>
            <el-menu-item index="">查询保存为草稿的选举结果文件</el-menu-item>
            <el-menu-item index="">查询已提交的选举结果文件</el-menu-item>
            <el-menu-item index="">选举结果文件草稿数据的编辑</el-menu-item>
            <el-menu-item index="">审批选举结果文件</el-menu-item>
            <el-menu-item index="">录入换届结果名单信息</el-menu-item>
            <el-menu-item index="">查询已提交的结果名单信息</el-menu-item>
            <el-menu-item index="">审批结果名单信息</el-menu-item>
            <el-menu-item index="">查询换届的整体流程数据</el-menu-item>
            <el-menu-item index="">查询当前正在换届的届次等相关信息</el-menu-item>
            <el-menu-item index="">查询所管理的组织 正在换届的委员会的届次和组织id</el-menu-item>
            <el-menu-item index="">编辑差额名单信息</el-menu-item>
            <el-menu-item index="">编辑录入结果</el-menu-item>
            <el-menu-item index="">查看换届结果草稿</el-menu-item>
          </el-submenu>
          <el-submenu index="19">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>党员资料库</span>
            </template>
            <el-menu-item index="">查询党员资料库</el-menu-item>
          </el-submenu>
          <el-submenu index="20">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>发展党员</span>
            </template>
            <el-menu-item index="">书面申请发展成党员</el-menu-item>
          </el-submenu>
        </el-menu>
        </div>   
      </el-col>
      <el-col :span="18">

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: ""
    };
  }
};
</script>
<style>
.left_menu {
  max-height: 1270px;
  overflow: hidden;
}
</style>

<style>
@import "../style/manage.css";
</style>
