<template>
  <div class="relate-area" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">设置关联区域</div>
      <div class="relate-area-content">
        <el-form label-width="100px" :model="server">
          <el-form-item label="关联区域">
            <el-col :span="10" :offset="2" v-if="!selectArea">{{curArea.name || '无'}}</el-col>
            <el-col :span="12" v-if="!selectArea"><el-button size="small" @click="selectArea = true">重新选择</el-button></el-col>
            <el-col :span="12" v-else>
              <area-cascader
                key="relate-area"
                lazy
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :default-expanded-keys="initExpand"
                :selected-area="server.areaIds"
                @check-area="checkArea">
              </area-cascader>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btn">
        <el-button @click="submit" type="primary" :disabled="submitDis" v-loading.fullscreen.lock="fullscreenLoading">提交</el-button>
        <el-button @click="close">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import AreaCascader from './../../common/AreaCascader'
  import API from './../../../assets/js/api'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  export default {
    name: 'relateArea',
    mixins: [loadAreaMixin],
    props: {
      areas: {
        type: Array
      },
      show: {
        type: Boolean
      },
      curServer: {
        type: Object
      }
    },
    data () {
      return {
        server: this.curServer,
        curArea: {
          name: '',
          id: ''
        },
        selectAreaId: '',
        selectArea: false,
        fullscreenLoading: false
      }
    },
    watch: {
      curServer: {
        immediate: true,
        handler (curServer) {
          this.server = curServer
          if (curServer) {
            this.curArea.id = curServer.areaId
            this.curArea.name = curServer.areaName
          }
        }
      }
    },
    components: {
      AreaCascader
    },
    computed: {
      submitDis () {
        return !this.selectArea || this.selectAreaId === ''
      }
    },
    methods: {
      close () {
        this.$emit('update:show', false)
        this.selectArea = false
        this.selectAreaId = ''
      },
      checkArea (areaIds) {
        this.selectAreaId = areaIds
      },
      submit () {
        this.fullscreenLoading = true
        var data = new URLSearchParams()
        data.append('id', this.server.id)
        if (this.selectArea) {
          data.append('areaIds', this.selectAreaId)
        } else {
          data.append('areaIds', this.curArea.id)
        }
        this.axios.patch(API.server_link_area, data).then(() => {
          this.close()
          this.$emit('update-server-list')
          this.fullscreenLoading = false
          this.$message({
            message: '关联区域成功!',
            type: 'success'
          })
        }).catch(() => {
          this.fullscreenLoading = false
          this.$message({
            message: '关联区域失败!',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .popup-box{
    width: 590px;
    height: 400px;
    top: calc(50% - 200px);
    left: calc(50% - 261px);
  }
  .relate-area-content{
    height: 250px;
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .relate-area-content .el-row{
    padding: 20px 0;
  }
  .popup-btn{
    height: 80px;
    line-height: 80px;
    text-align: center;
  }
  .custom-type{
    color: #7b828c;
    text-align: right;
  }
  .el-form-item{
    margin-bottom: 15px;
  }
</style>
