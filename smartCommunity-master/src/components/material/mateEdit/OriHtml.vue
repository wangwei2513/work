<template>
  <iframe src="" frameborder="0" :onload="init()"></iframe>
</template>
<script>
export default {
  name: 'oriHtml',
  props: {
    value: String
  },
  methods: {
    init () {
      this.$nextTick(() => {
        let mateDoc = this.$el.contentWindow.document
        let mateBody = mateDoc.body
        mateBody.innerHTML = this.value
      })
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.init()
      }
    }
  },
  activated () {
    this.init()
  }
}
</script>
<style scoped>
</style>
