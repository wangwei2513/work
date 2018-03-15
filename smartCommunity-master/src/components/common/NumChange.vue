<template>
  <div>
    <span>{{val}}</span>
  </div>
</template>
<script>
export default {
  name: 'numAnimate',
  props: {
    value: [String, Number]
  },
  data () {
    return {
      val: '',
      step: 0
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal, oldVal) {
        if (newVal || newVal === 0) {
          this.valArr = newVal
          if (!(oldVal || oldVal === 0)) {
            oldVal = newVal
          }
          this.step = Math.abs(Math.floor((newVal - oldVal) / 10))
          this.numAnimate(newVal, oldVal)
        }
      }
    }
  },
  computed: {
  },
  methods: {
    numAnimate (newVal, oldVal) {
      setTimeout(() => {
        // let newValArr = [...('' + newVal)]
        // let oldValArr = [...('' + oldVal)]
        // let oldChange = this.changeNum(newValArr, oldValArr)
        let oldChange = this.changeNum2(newVal, oldVal)
        this.val = oldChange
        if ('' + newVal !== '' + oldChange) {
          this.numAnimate(newVal, oldChange)
        }
      }, 16)
    },
    equal (arr1, arr2) {
      var equal = true
      if (arr1.length === arr2.length) {
        arr1.forEach(function (element, i) {
          if (element !== arr2[i]) {
            equal = false
          }
        }, this)
      } else {
        equal = false
      }
      return equal
    },
    changeNum (newValArr, oldValArr) {
      let appendArr = []
      let zeroIdx = []
      let afterChange = []
      let afterChangeCopy = []
      let len = newValArr.length - oldValArr.length
      for (let i = 0; i < Math.abs(len); i++) {
        appendArr.push('0')
      }
      if (len > 0) {
        oldValArr = appendArr.concat(oldValArr)
      } else if (len < 0) {
        newValArr = appendArr.concat(newValArr)
      }
      afterChange = oldValArr.map(function (oldVal, i) {
        let newVal = parseInt(newValArr[i])
        oldVal = parseInt(oldVal)
        if (newVal !== oldVal) {
          oldVal = oldVal > newVal ? oldVal - 1 + '' : oldVal + 1 + ''
        }
        return oldVal + ''
      }, this)
      if (len < 0) {
        for (let i = 0; i < -len; i++) {
          if (afterChange[i] === '0') {
            zeroIdx.push(i)
          }
        }
        afterChange.forEach(function (element, i) {
          if (!zeroIdx.includes(i)) {
            afterChangeCopy.push(element)
          }
        }, this)
      } else {
        afterChangeCopy = afterChange
      }
      return afterChangeCopy.join('')
    },
    changeNum2 (newVal, oldVal) {
      newVal = parseInt(newVal)
      oldVal = parseInt(oldVal)
      if (newVal > oldVal) {
        if (newVal < oldVal + this.step) {
          oldVal = newVal
        } else {
          oldVal = oldVal + this.step
        }
      } else if (newVal < oldVal) {
        if (newVal > oldVal - this.step) {
          oldVal = newVal
        } else {
          oldVal = oldVal - this.step
        }
      }
      return oldVal + ''
    }
  }
}
</script>
<style scoped>
</style>
