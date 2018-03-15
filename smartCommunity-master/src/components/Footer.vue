<template>
  <footer id="right-footer">
    <div>版权所有 © 1999-{{year}} 深圳市茁壮网络股份有限公司　粤ICP备12069260</div>
    <div>Copyright © 1999-{{year}} iPanel.TV Inc.,All Rights Reserved</div>
  </footer>
</template>
<script>
  export default {
    name: 'footer',
    data () {
      const year = new Date().getFullYear()
      return {
        year
      }
    }
  }
</script>
<style scoped>
  #right-footer{
    position: fixed;
    bottom: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100% ;
    height: 38px;
    padding-top: 7px;
    font-size: 12px;
    z-index: 1000;
    color: #646464;
    border-top: thin solid #ccc;
    background-color: #fff;
  }
</style>
