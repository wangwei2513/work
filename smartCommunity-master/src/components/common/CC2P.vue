<template>
  <!-- Chinese characters to Pinyin -->
  <div class="ipanel-cc2p" v-show="show">
    <span v-for="(item,index) in pinyinSelect" :key="index" class="pinyin" :class="{uncertain: Array.isArray(pinyin[index]), active: index === showIndex}">
      {{item}}
      <i 
        class="el-icon-caret-bottom" 
        v-if="Array.isArray(pinyin[index])"
        @click="toggleShow(index)">
      </i>
      <transition name="el-zoom-in-top">
        <div v-if="Array.isArray(pinyin[index])" v-show="index === showIndex" class="pinyin-muti-list">
          <div class="pinyin-muti-list-item" v-for="item in pinyin[index]" @click="selectPinyin(item, index)" :key="item">{{item}}</div>
        </div>
      </transition>
    </span>
  </div>
</template>
<script>
// https://github.com/xinglie/pinyin
import './../../../static/js/pinyin'
import bus from './../../assets/js/bus.js'
export default {
  name: 'CC2P',
  props: {
    value: {
      type: String,
      required: true
    },
    traVal: {
      type: String
    },
    spliter: {
      trpe: String
    },
    initVal: {
      type: String
    },
    onlyFirst: {
      type: Boolean
    },
    singleMode: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      pinyin: [],
      pinyinSelect: [],
      showIndex: -1
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.showIndex = -1
        var pinyinArr = []
        var pinyinSelect = []
        /* eslint-disable no-undef */
        var pinyin = Utils.CSpell.getSpell(this.value.replace(/ /g, '')) // 'a,[xi,ji],ha,[qiu,chou],ya'
        var arr = pinyin.split('[') // {a,} {xi,ji],ha,} {qiu,chou],ya}
        arr.forEach(function (element) {
          /* eslint-disable no-redeclare */
          if (element.indexOf(']') !== -1) {
            var dy = element.split(']')[0] // {a,} {{xi,ji} {,ha,}} {{qiu,chou},ya}
            dy = dy.replace(/,/g, ' ').trim()
            var dyArr = dy.split(' ')
            pinyinSelect.push(dyArr[0])
            pinyinArr.push(dyArr)
            if (element.split(']')[1] && element.split(']')[1] !== '' && element.split(']')[1] !== ',') {
              var rest = element.split(']')[1]
              rest = rest.replace(/,/g, ' ').trim()
              var restArr = rest.split(' ')
              restArr.forEach(function (restp) {
                if (restp !== '') {
                  pinyinSelect.push(restp)
                  pinyinArr.push(restp)
                }
              }, this)
            }
          } else if (element !== '') {
            var dy = element.replace(/,/g, ' ').trim()
            var dyArr = dy.split(' ')
            pinyinSelect = pinyinSelect.concat(dyArr)
            pinyinArr = pinyinArr.concat(dyArr)
          }
        }, this)
        /* 只取首字母模式 */
        if (this.onlyFirst) {
          pinyinSelect.forEach(function (element, i, arr) {
            arr[i] = element[0]
          }, this)
          pinyinArr.forEach(function (pinyins, i, outerArr) {
            if (Array.isArray(pinyins)) {
              let existVal = []
              let totalVal = []
              pinyins.forEach(function (pinyin, j) {
                totalVal.push(pinyin[0])
              }, this)
              totalVal.forEach(function (pinyin) {
                !existVal.includes(pinyin) && existVal.push(pinyin)
              })
              outerArr[i] = existVal.length > 1 ? existVal : existVal[0]
            } else {
              outerArr[i] = pinyins[0]
            }
          }, this)
        }
        /* 连字模式 */
        if (!this.singleMode) {
          var newPinyinArr = []
          var newPinyinSelect = []
          for (var i = 0; i < pinyinArr.length; i++) {
            var pinyin = pinyinArr[i]
            var pinyinS = pinyinSelect[i]
            var newLen = newPinyinArr.length
            if (Array.isArray(pinyin) || newLen === 0 || Array.isArray(newPinyinArr[newLen - 1])) {
              newPinyinArr.push(pinyin)
              newPinyinSelect.push(pinyinS)
            } else {
              newPinyinArr[newLen - 1] += pinyin
              newPinyinSelect[newLen - 1] += pinyin
            }
          }
          pinyinSelect = newPinyinSelect
          pinyinArr = newPinyinArr
        }
        this.pinyinSelect = pinyinSelect
        this.pinyin = pinyinArr
        let spliter = typeof this.spliter === 'undefined' ? '-' : this.spliter
        this.$emit('update:traVal', this.pinyinSelect.join(spliter))
      }
    },
    initVal: {
      immediate: true,
      handler (val) {
        if (val) {
          this.pinyinSelect = []
          this.pinyin = []
          this.pinyinSelect.push(val)
          this.$emit('update:traVal', val)
        }
      }
    }
    
  },
  computed: {
    show () {
      return this.pinyinSelect.length > 0
    }
  },
  methods: {
    toggleShow (index) {
      if (this.showIndex === index) {
        this.showIndex = -1
      } else {
        this.showIndex = index
      }
    },
    selectPinyin (item, index) {
      this.pinyinSelect[index] = item
      this.showIndex = -1
      let spliter = typeof this.spliter === 'undefined' ? '-' : this.spliter
      this.$emit('update:traVal', this.pinyinSelect.join(spliter))
    }
  },
  created () {
    var self = this
    bus.$on('hideCC2P', function () {
      self.showIndex = -1
    })
  }
}
</script>
<style scoped>
.pinyin{
  display: inline-block;
  margin: 0 5px;
  padding: 0px 10px;
  height: 20px;
  line-height: 20px;
  border-radius: 2px;
  background-color: #58B7FF;
  color: #fff;
}
.pinyin.uncertain{
  background-color: #1D8CE0;
  position: relative;
}
.pinyin-muti-list{
  position: absolute;
  top: 24px;
  left: 0;
  width: 60px;
  color: #1F2D3D;
  text-align: center;
  padding: 5px 0;
  border: 1px solid #d1dbe5;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
  background-color: #fff;
  z-index: 1;
}
.pinyin-muti-list-item:hover{
  cursor: pointer;
  background-color: #e4e8f1;
}
.el-icon-caret-bottom{
  cursor: pointer;
  transition: transform .5s;
}
.pinyin.active .el-icon-caret-bottom{
  transform: rotate(180deg)
}
</style>
