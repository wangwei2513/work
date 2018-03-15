<template>
  <div class="system-manage">
    <el-tabs v-model="tabsVal" type="card">
      <el-tab-pane
        :key="item.name"
        v-for="(item, index) in tabs"
        :label="item.title"
        :name="item.name"
        :closable="item.closable"
      >
      </el-tab-pane>
    </el-tabs>
    <div class="system-manage-content">
      <el-form :model="setting" label-width="180px">
        <el-form-item label="是否开启手动审核?">
          <el-switch @change="changeCheckWay" :value="setting.manualCheck"></el-switch>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
export default {
  name: 'systemManage',
  props: {
    areas: {
      type: Array
    },
    sySetting: {
      type: Object
    }
  },
  data () {
    return {
      setting: {
        manualCheck: false
      },
      tabsVal: '1',
      tabs: [
        {
          title: '系统设置',
          name: '1',
          closable: false
        }
      ]
    }
  },
  watch: {
    sySetting: {
      immediate: true,
      handler (sySetting) {
        if (sySetting) {
          this.setting.manualCheck = sySetting.auditEntryType === 'manual'
        }
      }
    }
  },
  methods: {
    changeCheckWay (val) {
      let checkWay = val ? 'manual' : 'auto'
      this.setting.manualCheck = val
      let params = new URLSearchParams()
      params.append('propertyValue', checkWay)
      this.axios.post(API.set_sy_setting, params).then(() => {
        this.$emit('update-sy-setting')
        this.$message({
          message: '成功' + (val ? '开启' : '关闭') + '手动审核!',
          type: 'success'
        })
      }).catch(() => {
        this.$message({
          message: (val ? '开启' : '关闭') + '手动审核失败!',
          type: 'error'
        })
      })
    }
  },
  created () {
  }
}
</script>
<style scoped>
.system-manage{
  padding: 20px;
}
</style>

