<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
          <div class="manage_tip">
          <p>ele后台管理系统</p>  
          </div>
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名"><span>dadaas</span></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
            </el-form-item>
          </el-form>
          <p class="tip">温馨提示：</p>
          <p class="tip">为登录过的新用户，登录自动注册</p>
          <p class="tip">已注册的用户、凭账号密码登录</p>
      </section>
    </transition>
  </div>
</template>

<script>
import { login, getAdminInfo } from "../api/getData";
import { mapActions, mapState } from "vuex";
import Mock from "mockjs";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, meesage: "请输入密码", trigger: "blur" }]
      },
      showLogin: false
    };
  },
  mounted() {
    this.showLogin = true;
    this.MockData()
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async submitForm(formName) {
      
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // login();
          const res = await login(
            // {
            // user_name: this.loginForm.username,
            // password: this.loginForm.password
            // }
          );
          console.log(res)
          if (res.status === 1) {
            this.$message({
              message: "登录成功",
              type: "success"
            });
            this.$router.push("manage");
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100
          });
        }
        return false;
      });
    },
    MockData() {
      Mock.mock("/admin/login", "post", {
        status: 1
      });
      Mock.mock("/admin/info", "get", {
        status: 1,
        data:{
          id:'weihuang',
          avatar:'logo.png'
        }
      });
    }
  },
  watch: {
    adminInfo: function(newValue) {
      if (newValue.id) {
        this.$message({
          type: "success",
          message: "检测您之前登陆过，将自动登录"
        });
        this.$router.push("manage");
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../style/mixin.less";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 210px);
  .ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>