<template>
  <div class="iframe-preview" v-show="show">
    <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
    <div class="vue-ip-head">{{title}}</div>
    <iframe :src="previewUrl" frameborder="0" class="vue-ip-content"></iframe>
  </div>
</template>
<script>
  export default {
    name: 'iframePreview',
    props: {
      show: Boolean,
      url: String,
      title: String
    },
    data () {
      return {
        previewUrl: ''
      }
    },
    watch: {
      show (show) {
        if (show) {
          setTimeout(() => {
            let url = ''
            let newUrl = this.url
            if (newUrl && typeof newUrl === 'string') {
              url = newUrl.startsWith('http') ? newUrl : 'http://' + newUrl
            }
            this.previewUrl = url
          }, 0)
        } else {
          this.previewUrl = ''
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
      }
    },
    mounted () {
      this.$nextTick(() => {
        if ($(window).height() < 800) {
          $('.vue-ip-content').css({
            transform: 'scale(.9)'
          })
        }
      })
    }
  }
</script>
<style scoped>
  .iframe-preview{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    z-index: 1019;
    color: #fff;
  }
  .vue-ip-head{
    height: 80px;
    text-align: center;
    line-height: 80px;
  }
  .vue-ip-content{
    display: block;
    height: 720px;
    width: 1280px;
    margin: 0 auto;
    background-color: #fff;
    transform-origin: top;
  }
</style>
