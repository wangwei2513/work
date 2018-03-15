<template>
  <div class="i-tabs">
    <div class="tabs-wp">
      <ul>
        <li v-for="tab in tabs" class="i-tab" :class="curTab == tab.id? 'is-active': ''" :key="tab.label" @click="handleClick($event,tab)">{{tab.label}}</li>
      </ul>
      <div class="i-tabs__active-bar"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'iTabs',
    props: {
      tabs: Array,
      activeTab: String
    },
    data () {
      return {
        curTab: this.activeTab
      }
    },
    watch: {
      activeTab: {
        immediate: true,
        handler (activeTab) {
          this.curTab = activeTab
          this.$nextTick(() => {
            this.transform($('.i-tab.is-active'), $('.i-tabs .i-tabs__active-bar'))
          })
        }
      }
    },
    methods: {
      handleClick (e, tab) {
        if (this.curTab !== tab.id) {
          this.curTab = tab.id
          var $li
          var $bar = $('.i-tabs .i-tabs__active-bar')
          if ($(e.target).is('.i-tab')) {
            $li = $(e.target)
          } else {
            $li = $(e.target).parentsUntil('.i-tabs', '.i-tab')
          }
          this.transform($li, $bar)
          this.$emit('active-change', tab)
        }
      },
      transform ($parent, $el) {
        var w = $parent.innerWidth()
        var position = $parent.position()
        if (typeof w !== 'undefined' && typeof position.left !== 'undefined') {
          $el.css({
            width: w,
            transform: 'translateX(' + position.left + 'px)'
          })
        }
      }
    },
    created () {
      this.$nextTick(function () {
        this.transform($('.i-tab.is-active'), $('.i-tabs .i-tabs__active-bar'))
      })
    }
  }
</script>
<style scoped>
  .i-tabs{
    width: 100%;
    height: 36px;
    font-size: 14px;
    color: #8391a5;
    transform: translateX()
  }
  .i-tabs ul {
    width: 100%;
    height: 100%;
  }
  .i-tabs li{
    float: left;
    padding: 0 16px;
    line-height: 36px;
    margin-right: 10px;
  }
  .i-tabs li:hover{
    color: #1f2d3d;
    cursor: pointer;
  }
  .i-tabs li.is-active{
    color: #20a0ff;
  }
  .tabs-wp{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .i-tabs__active-bar{
    position: absolute;
    width: 0px;
    height: 3px;
    bottom: 0px;
    background-color: #20a0ff;
    transition: all .3s cubic-bezier(.645,.045,.355,1)
  }
</style>
