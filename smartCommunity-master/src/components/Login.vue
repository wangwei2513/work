<template>
  <div class="login-wp">
    <div id="login">
      <h1>智慧社区管理系统</h1>
      <span class="tip top-tip" :class="success?'success':''">{{topMsg}}</span>
      <div class="input-wp">
        <label for="username"  class="input-label">账号</label>
        <el-input v-model="data.username" placeholder="请输入账号" autofocus></el-input>
        <span v-show="!usernameValid" class="tip username-tip">{{usernameMsg}}</span>
      </div>
      <div class="input-wp input-passwd">
        <label for="password"  class="input-label">密码</label>
        <el-input v-model="data.password" type="password" placeholder="请输入密码"></el-input>
        <span v-show="!pwValid" class="tip password-tip">{{pwMsg}}</span>
      </div>
      <div class="remember-me">
        <el-switch
          v-model="data.rememberMe">
        </el-switch>
        <label for="" class="remember-me-label">记住密码</label>
      </div>
      <el-button class="btn" @click="login" type="primary" :loading="submiting">登录</el-button>
    </div>
    <div id="particles-js"></div>
    <footer id="right-footer">
      <div>版权所有 © 1999-<span class="right-year"></span> 深圳市茁壮网络股份有限公司　粤ICP备12069260</div>
      <div>Copyright © 1999-<span class="right-year"></span> iPanel.TV Inc.,All Rights Reserved</div>
    </footer>
  </div>
</template>
<script>
import API from './../assets/js/api'
import Cookies from './../assets/js/cookie'
import md5 from 'blueimp-md5'
import 'particles.js'
export default {
  name: 'login',
  data () {
    return {
      data: {
        username: '',
        password: '',
        rememberMe: ''
      },
      pwMsg: '密码不能为空!',
      usernameMsg: '账号不能为空!',
      pwValid: true,
      usernameValid: true,
      topMsg: '',
      success: false,
      submiting: false
    }
  },
  methods: {
    login () {
      this.submiting = true
      this.pwValid = this.data.password !== ''
      this.usernameValid = this.data.username !== ''
      if (this.pwValid && this.usernameValid) {
        console.log(md5(this.data.password))
        this.axios.get(API.login, { params: this.data }).then((data) => {
          Cookies.set('token', data.token)
          // 是否记住密码,记住时间为7天
          if (this.data.rememberMe) {
            Cookies.set('rememberMe', 1, { expires: 7 })
            Cookies.set('passWord', data.loginUser.passWord, { expires: 7 })
            Cookies.set('userName', data.loginUser.userName, { expires: 7 })
            Cookies.set('userId', data.loginUser.id, { expires: 7 })
            Cookies.set('adminType', data.loginUser.adminType, { expires: 7 })
          } else {
            Cookies.remove('rememberMe')
            Cookies.remove('passWord')
            Cookies.set('userName', data.loginUser.userName)
            Cookies.set('userId', data.loginUser.id)
            Cookies.set('adminType', data.loginUser.adminType)
          }
          localStorage.resources = data.loginUser.resources
          this.submiting = false
          this.success = true
          this.topMsg = '登录成功!'
          this.$router.push({path: '/home'})
          this.$emit('login', data)
        }).catch((error) => {
          this.submiting = false
          this.success = false
          this.topMsg = error.msg
        })
      } else {
        this.submiting = false
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    /* 粒子效果 */
    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    /* eslint-disable no-undef */
    particlesJS.load('particles-js', '/static/js/particlesjs-config.json')
    next((vm) => {
      if (Cookies.get('rememberMe') === '1') {
        vm.data.password = Cookies.get('passWord')
        vm.data.username = Cookies.get('userName')
        vm.data.rememberMe = true
      }
      $(document).on('keyup.enterLogin', function (e) {
        if (e.keyCode === 13) {
          vm.login()
        }
      })
    })
  },
  beforeRouteUpdate (to, from, next) {
    particlesJS.load('particles-js', '/static/js/particlesjs-config.json')
    $(document).off('.enterLogin').on('keyup.enterLogin', function (e) {
      if (e.keyCode === 13) {
        vm.login()
      }
    })
    next()
  },
  beforeRouteLeave (to, from, next) {
    $(document).off('.enterLogin')
    next()
  }
}
</script>
<style scoped>
  .login-wp{
    height: 100%;
    width: 100%;
  }
  #login{
    position: relative;
    height: 320px;
    width: 400px;
    top: calc(50% - 220px);
    left: calc(50% - 200px);
    text-align: center;
  }
  #login h1{
    color: #20A0FF;
    font-size: 2em;
    font-weight: bold;
    letter-spacing: 0.2em;
  }
  .btn{
    height: 44px;
    width: 240px;
  }
  #right-footer{
    position: absolute;
    bottom: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100% ;
    height: 38px;
    font-size: 12px;
    z-index: 1;
    color: #646464;
  }
  .input-wp{
    height: 44px;
    width: 240px;
    margin-left: 80px;
    box-sizing: border-box;
    position: relative;
  }
  .input-passwd{
    margin-top: 5px;
  }
  .input-label{
    position: absolute;
    top: 0;
    left: 0;
    color: #646464;
    font-size: 18px;
    line-height: 42px;
    margin-left: 16px;
  }
  .input{
    height: 100%;
    width: 100%;
    color: #1F2D3D;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    font-size: 18px;
    outline: none;
    padding: 0 0 0 60px;
    box-sizing: border-box;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .input:hover{
    border-color: #8391a5;
  }
  .input:focus{
    border-color: #20a0ff;
  }
  .input::-webkit-input-placeholder{
    color: #D6DBDF;
    font-size: 16px;
  }
  .remember-me{
    height: 40px;
    margin-top: 10px;
    font-size: 14px;
    color: #646464;
    display: flex;
    justify-content: center;
  }
  .remember-me-label{
    height: 22px;
    line-height: 22px;
    vertical-align: top;
    margin-left: 10px;
  }
  .checkbox-wp{
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
  }
  .checkbox-show-outer{
    display: block;
    height: 20px;
    width: 20px;
    line-height: 20px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color .15s cubic-bezier(.71,-.46,.88,.6);
  }
  .checkbox-show-outer:hover{
    border-color: #20a0ff;
  }
  #rememberMe{
    display: none;
  }
  .checkbox-show-outer.checked{
    background-color: #20a0ff;
    border-color: #20a0ff;
  }
  .checkbox-show-outer.checked .iconfont{
    transform: scaleY(1);
  }
  .tip{
    font-size: 12px;
    position: absolute;
    top: 14px;
    left: 250px;
    display: block;
    height: 16px;
    width: 200px;
    text-align: left;
    line-height: 16px;
    color: #FF4949;
  }
  .top-tip{
    position: initial;
    margin-top: 70px;
    margin-bottom: 5px;
    width: 400px;
    text-align: center;
  }
  .top-tip.success{
    color: #13CE66;
  }
  #particles-js{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
</style>