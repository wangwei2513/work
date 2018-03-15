<template>
  <div class="vue-img-preview" v-show="show">
    <i class="iconfont icon-arrows_remove" @click="$emit('update:show', false)" title="关闭"></i>
    <div class="vue-ip-head">{{title}}</div>
    <div class="vue-ip-content">
      <div class="vue-ip-ctr-left"><i class="iconfont icon-arrows_circle_right" @click="prev"></i></div>
      <div class="vue-ip-img">
        <div class="vue-ip-img-outer">
          <div class="vue-ip-img-inner" v-for="(img,index) in imgs" :key="index">
            <img :src="img.src" alt="">
          </div>
        </div>
        <slot></slot>
      </div>
      <div class="vue-ip-ctr-right"><i class="iconfont icon-arrows_circle_left" @click="next"></i></div>
    </div>
    <div class="vue-ip-page-tip">{{curIndex+1}}/{{total}}</div>
    <div class="vue-ip-footer">
      <div class="vue-ip-ctr-pre"><i class="iconfont icon-arrows_left" @click="prevThumbRow"></i></div>
      <div class="vue-ip-thumb">
        <div class="vue-ip-thumb-outer">
          <div class="vue-ip-thumb-inner" v-for="(img,index) in imgs" :key="index">
            <img :src="img.thumb" alt="" :class="index == curIndex?'current':''" @click="turnTo(index)">
            <span class="vue-ip-thumb-idx">{{index+1}}</span>
          </div>
        </div>
      </div>
      <div class="vue-ip-ctr-next"><i class="iconfont icon-arrows_right" @click="nextThumbRow"></i></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'imgPreview',
    props: {
      show: Boolean,
      imgs: Array,
      title: String
    },
    data () {
      return {
        curIndex: 0,
        curRow: 0
      }
    },
    watch: {
      imgs: {
        immediate: true,
        handler (newImgs) {
          this.$nextTick(function () {
            this.initPosition($('.vue-ip-img-inner'))
          })
        }
      }
    },
    computed: {
      total () {
        return this.imgs.length
      },
      col () {
        const outerW = $('.vue-ip-thumb-outer').eq(0).width()
        const innerW = $('.vue-ip-thumb-inner').eq(0).width()
        return Math.floor(outerW / innerW)
      },
      row () {
        return Math.ceil(this.total / this.col)
      }
    },
    methods: {
      initPosition ($els) {
        $els.each(function (i) {
          const $this = $(this)
          const width = $(window).width()
          $this.css('left', (width - 200) * i)
        })
      },
      next () {
        if (this.curIndex === this.total - 1) {
          this.turnToRow(0)
        } else {
          if ((this.curIndex + 1) % this.col === 0) {
            this.turnToRow(++this.curRow)
          }
        }
        if (this.curIndex === this.total - 1) {
          this.curIndex = 0
        } else {
          this.curIndex++
        }
        const boxW = $(window).width() - 200
        $('.vue-ip-img-outer').eq(0).css('left', -boxW * this.curIndex)
      },
      prev () {
        if (this.curIndex === 0) {
          this.turnToRow(this.row - 1)
        } else {
          if (this.curIndex % this.col === 0) {
            this.turnToRow(--this.curRow)
          }
        }
        if (this.curIndex === 0) {
          this.curIndex = this.total - 1
        } else {
          this.curIndex--
        }
        const boxW = $(window).width() - 200
        $('.vue-ip-img-outer').eq(0).css('left', -boxW * this.curIndex)
      },
      nextThumbRow () {
        if (this.curRow === this.row - 1) {
          this.curRow = 0
        } else {
          this.curRow++
        }
        $('.vue-ip-thumb-outer').eq(0).css('top', -150 * this.curRow)
      },
      prevThumbRow () {
        if (this.curRow === 0) {
          this.curRow = this.row - 1
        } else {
          this.curRow--
        }
        $('.vue-ip-thumb-outer').eq(0).css('top', -150 * this.curRow)
      },
      turnTo (index) {
        this.curIndex = index
        const boxW = $(window).width() - 200
        $('.vue-ip-img-outer').eq(0).css('left', -boxW * this.curIndex)
      },
      turnToRow (row) {
        this.curRow = row
        $('.vue-ip-thumb-outer').eq(0).css('top', -150 * this.curRow)
      }
    },
    created () {
    },
    mounted () {}
  }
</script>
<style scoped>
  .vue-img-preview{
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
    height: calc(100% - 230px);
    width: 100%;
    box-sizing: border-box;
  }
  .vue-ip-footer{
    height: 150px;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .vue-ip-content{
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .vue-ip-content i{
    font-size: 40px;
    color: #ccc;
  }
  .vue-ip-content i:hover{
    cursor: pointer;
    color: #fff;
  }
  .vue-ip-ctr-left{
    height: 100%;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vue-ip-img{
    width: calc(100% - 160px);
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .vue-ip-ctr-right{
    height: 100%;
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vue-ip-img-outer{
    height: 100%;
    position: relative;
  }
  .vue-ip-img-inner{
    width: 100%;
    height: 100%;
    left: 0;
    text-align: center;
    position: absolute;
  }
  .vue-ip-img-inner img{
    height: 100%;
    vertical-align: middle;
  }
  .vue-ip-thumb-inner img:hover{
    cursor: pointer;
  }
  .vue-ip-ctr-pre{
    height: 100%;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vue-ip-thumb{
    height: 100%;
    width: calc(100% - 160px);
    overflow: hidden;
  }
  .vue-ip-ctr-next{
    height: 100%;
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vue-ip-footer i{
    font-size: 40px;
    color: #ccc;
  }
  .vue-ip-footer i:hover{
    color: #fff;
    cursor: pointer;
  }
  .vue-ip-thumb-outer{
    position: relative;
    height: 100%;
  }
  .vue-ip-thumb-inner{
    height: 100%;
    float: left;
    position: relative;
  }
  .vue-ip-thumb-inner .current{
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
  .vue-ip-thumb-inner img{
    height: calc(100% - 40px);
    margin: 20px 10px;
  }
  .vue-ip-page-tip{
    position: absolute;
    bottom: 170px;
    right: 40px;
  }
  .vue-ip-thumb-idx{
    position: absolute;
    top: 25px;
    right: 20px;
  }
  .test-tip{
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
