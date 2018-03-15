<template>
  <div class="count-input" :class="showTip?'showTip':''">
      <input
        :class="['count-input-inner', className]"
        v-model="valueCopy"
        @input="input"
        @blur="blur"
        :maxlength="total"
        :placeholder="placeholder"
        type="text">
      <span class="count-input-counter" v-show="showCounter">
        {{curCount}}/{{total}}
      </span>
      <transition name="el-zoom-in-top">
        <span class="count-input-tip" v-show="showTip && tipShow">{{tipText[regType]}}<i @click="tipShow = false" class="iconfont icon-arrows_remove"></i></span>
      </transition>
  </div>
</template>
<script>
export default {
  name: 'countInput',
  props: {
    total: {
      type: Number
    },
    value: {
      type: [String, Number]
    },
    placeholder: {
      type: String
    },
    showCounter: {
      type: Boolean,
      default () {
        return true
      }
    },
    regType: {
      type: String,
      default () {
        return 'cn'
      }
    },
    showTip: {
      type: Boolean,
      default () {
        return true
      }
    },
    className: {
      type: String
    }
  },
  data () {
    return {
      valueCopy: '',
      regMap: {
        cn: /([\u4e00-\u9fa5]|\w)+/g,
        recn: /([^\u4e00-\u9fa5\w])/,
        w: /\w+/g,
        rew: /\W/,
        port: /[0-9]+/g,
        report: /[^0-9]/,
        ip: /[0-9]+/g,
        reip: /[^0-9]/
      },
      tipText: {
        cn: '只能输入中英文、数字或下划线！',
        w: '只能输入英文、数字或下划线！',
        port: '端口号只能是数字,且在0-65535之间！'
      },
      tipShow: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        if (val.length > this.total) {
          this.valueCopy = val.substring(0, this.total)
        } else {
          this.valueCopy = val || ''
        }
      }
    }
  },
  computed: {
    curCount: {
      get () {
        var len = 0
        const value = this.valueCopy || ''
        for (var i = 0; i < value.length; i++) {
          var c = value.charCodeAt(i)
          // 单字节加1
          if ((c >= 0x0001 && c <= 0x007e) || (c <= 0xff60 && c <= 0xff9f)) {
            len++
          } else {
            len += 2
          }
        }
        return len
      },
      set () {}
    }
  },
  methods: {
    input (e) {
      let val = e.target.value
      val = this.nameInputFiltrate(val)
      // 不放在nextTick里面input的value会刷新回去,原因还不清楚
      this.$emit('input', val, e)
      this.$emit('change', val, e)
      this.$nextTick(() => {
        this.valueCopy = val
        e.target.value = val
      })
    },
    blur (e) {
      let val = this.valueCopy
      val = this.nameInputFiltrate(val)
      // 不放在nextTick里面input的value会刷新回去,原因还不清楚
      if (!this.valueCopy === val) {
        this.$emit('change', val, e)
        this.$nextTick(() => {
          this.valueCopy = val
          e.target.value = val
        })
      }
    },
    /**
    *根据正则,过滤输入值
    *@param {string} val 输入的值
    */
    nameInputFiltrate (val) {
      val += ''
      var result = val.match(this.regMap[this.regType])
      if (this.regMap['re' + this.regType].test(val)) {
        this.tipShow = true
        setTimeout(() => {
          this.tipShow = false
        }, 3000)
      }
      result = result ? result.join('') : ''
      if (this.regType === 'port') {
        if (parseInt(result) > 65535) {
          result = result.split('')
          result.pop()
          result = result.join('')
          this.tipShow = true
          setTimeout(() => {
            this.tipShow = false
          }, 3000)
        }
      }
      if (this.regType === 'ip') {
        if (parseInt(result) > 255) {
          result = result.split('')
          result.pop()
          result = result.join('')
        }
      }
      return result
    }
  }
}
</script>
<style scoped>
.count-input.showTip{
}
.count-input{
  position: relative;
}
.count-input-inner{
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 32px;
  line-height: 1;
  outline: 0;
  padding: 0px 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
}
.count-input-inner:hover{
  border-color: #8391a5;
}
.count-input-inner:focus {
  outline: 0;
  border-color: #20a0ff;
}
.count-input-inner::-webkit-input-placeholder {
  color:#b1b8c5;
}
.count-input-counter{
  position: absolute;
  top: 0px;
  left: 100%;
  height: 32px;
  line-height: 32px;
  margin-left: 10px;
}
.count-input-tip{
  position: absolute;
  top: 36px;
  left: 0;
  font-size: 12px;
  color: #FF4949;
  line-height: 12px;
  white-space: nowrap;
}
.icon-arrows_remove{
  font-size: 22px;
  display: inline-block;
  vertical-align: top;
  height: 12px;
  color: #333;
  line-height: 17px;
  position: initial;
}
</style>
