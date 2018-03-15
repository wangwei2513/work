<template>
  <div class="server-error">
    <div class="server-error-content">
      <span class="error-wp">
        <i class="iconfont icon-arrows_remove"></i>
      </span>
      <span class="error-text">服务器可能出了一点问题，请稍后进行访问或者联系系统维护人员。</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'serverError'
}
</script>
<style scoped>
.server-error{
  height: 100%;
}
.server-error-content{
  height: 60px;
  position: relative;
  top: calc(50% - 53px);
  text-align: center;
}
.icon-arrows_remove{
  position: static;
  cursor: initial;
  color: #fff;
  font-weight: bold;
  line-height: 46px;
}
.error-wp{
  display: inline-block;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #FF4949;
  vertical-align: middle;
}
.error-text{
  vertical-align: middle;
  margin-left: 10px;
}
</style>
