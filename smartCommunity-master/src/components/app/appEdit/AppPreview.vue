<template>
  <div class="app-preview">
    <div v-if="!!curNodeTempUrl" class="has-temp app-preview-temp">
      <iframe :src="curNodeTempUrl" frameborder="0" :onload="this.scaleIframe()" id="nodeTempPreveiw" name="nodeTempPreveiw" class="temp-preview"></iframe>
      <!-- <img src="http://dummyimage.com/640x360" alt="" class="temp-preview"> -->
    </div>
    <div v-else class="no-temp app-preview-temp" @dblclick="handleDblclick">
      {{text}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'appPreview',
    props: {
      curNodeTempUrl: String,
      curNode: Object,
      selectNodeModule: Boolean,
      reload: Boolean
    },
    data () {
      return {
        scale: 1
      }
    },
    computed: {
      text () {
        let text = '双击选择模板！'
        if (this.curNode) {
          if (!this.curNode.pModule) {
            text = '请您先选择父模板！'
          } else if ('' + this.curNode.pModuleType === '1') {
            text = '该栏目类型不支持单独预览，请您回到父模板进行预览！'
          } else if (this.curNode.hasOutLink) {
            text = '外跳栏目无需选择模板！'
          }
        }
        return text
      }
    },
    watch: {
      reload (reload) {
        if (reload) {
          window.open(document.all.nodeTempPreveiw.src, 'nodeTempPreveiw', '')
          this.$emit('update:reload', false)
        }
      }
    },
    methods: {
      handleDblclick () {
        if (this.selectNodeModule) {
          this.$emit('select-temp')
        }
      },
      scaleIframe () {
        setTimeout(() => {
          $('.temp-preview').css({
            transform: 'scale(' + this.scale + ')'
          })
        }, 0)
      }
    },
    mounted () {
      this.$nextTick(() => {
        let boxW = $(this.$el).width()
        let boxH = boxW * 72 / 128
        this.scale = boxW / 1280
        $('.app-preview-temp').width(boxW).height(boxH)
        $('.temp-preview').css({
          transform: 'scale(' + this.scale + ')'
        })
      })
    }
  }
</script>
<style scoped>
  .has-temp, .no-temp{
    text-align: center;
  }
  .has-temp{
    width: 640px;
    height: 360px;
    overflow: hidden;
    border: thin solid #50bfff;
  }
  .no-temp{
    width: 640px;
    height: 360px;
    margin: 0 auto;
    border: thin solid #d3dce6;
    background-color: #eff2f7;
    text-align: center;
    line-height: 360px;
    color: #1f2d3d;
    font-size: 14px;
    cursor: pointer;
    user-select: none;
  }
  .temp-preview{
    width: 1440px;
    height: 720px;
    transform: scale(0.5);
    -webkit-transform-origin-x: left;
    -webkit-transform-origin-y: top;
  }
</style>
