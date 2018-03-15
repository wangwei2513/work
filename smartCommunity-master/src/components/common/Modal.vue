<template>
  <div v-show="show">
    <div class="modal-box" :style="boxStyle">
      <h2 class="modal-header">{{title}}</h2>
      <i class="iconfont icon-arrows_remove" @click="close" title="关闭"></i>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
    <div class="modal-cover" :style="coverStyle"></div>
  </div>
</template>
<script>
export default {
  name: 'modalBox',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: [String, Number]
    },
    width: {
      type: Number
    },
    zIndex: {
      type: [String, Number]
    },
    height: {
      type: Number
    }
  },
  data () {
    return {
      boxStyle: {
        width: this.width + 'px',
        height: this.height + 'px',
        top: 'calc(50% - ' + (this.height / 2) + 'px)',
        left: 'calc(50% - ' + (this.width / 2) + 'px)',
        zIndex: this.zIndex - 0 + 1
      },
      coverStyle: {
        zIndex: this.zIndex
      }
    }
  },
  methods: {
    close () {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style scoped>
.modal-box{
  width: 590px;
  height: 522px;
  background-color: #fff;
  padding: 20px;
  font-size: 14px;
  border-radius: 5px;
  position: fixed;
  top: calc(50% - 285px);
  left: calc(50% - 261px);
  box-sizing: border-box;
  z-index: 1010;
}
.modal-cover{
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 1009;
}
.modal-header{
  font-size: 14px;
  color: #1f2d3d;
  font-weight: bold;
  margin-bottom: 25px;
}
.modal-content{
  height: calc(100% - 40px);
  width: 100%;
}
</style>
