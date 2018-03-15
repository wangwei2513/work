<template>
  <div>
    <script :id="editorName" name="content" type="text/plain"></script>
  </div>
</template>
<script>
import './../../../static/ueditor/ueditor.config'
import './../../../static/ueditor/ueditor.all'
export default {
  name: 'iUeditor',
  props: {
    editorName: {
      type: String,
      required: true
    },
    value: {
      type: String
    }
  },
  data () {
    return {
      ue: null
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.$nextTick(() => {
          this.ue && this.ue.setContent(val || '')
        })
      }
    }
  },
  methods: {
    creatUeditor () {
      var self = this
      /* eslint-disable no-undef */
      UE.getEditor(this.editorName).ready(function () {
        // this是当前创建的编辑器实例
        (self.value || self.value === 0) && this.setContent(self.value)
        this.addListener('contentChange', function () {
          self.$emit('change', this.getContent(), this.getPlainTxt())
        })
        self.ue = this
      })
    }
  },
  mounted () {
    this.creatUeditor()
  }
}
</script>
<style scoped>
</style>
