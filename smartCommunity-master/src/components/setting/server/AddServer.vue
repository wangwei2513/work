<template>
  <div class="add-server" v-if="show">
    <div class="popup-box">
      <i class="iconfont icon-arrows_remove" title="关闭" @click="close"></i>
      <div class="popup-header">{{isNew?'添加服务器':'编辑服务器'}}</div>
      <div class="add-server-content">
        <el-form label-width="120px" :model="server">
          <el-form-item label="服务器名称">
            <el-col :span="15">
              <count-input
                v-model="server.serverName"
                :total="20"
                regType="cn"
                placeholder="请输入服务器名称">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="服务器地址">
            <el-col :span="4">
              <count-input class-name="focus1" @input="(val, e) => {turnToNext( 1, val, e)}" v-model="server.serverIp[0]" :total="3" :showTip="false" :showCounter="false" regType="ip" placeholder="">
              </count-input>
            </el-col>
            <el-col :span="1" class="align-center">.</el-col>
            <el-col :span="4">
              <count-input class-name="focus2" @input="(val, e) => {turnToNext( 2, val, e)}" v-model="server.serverIp[1]" :total="3" :showTip="false" :showCounter="false" regType="ip" placeholder="">
              </count-input>
            </el-col>
            <el-col :span="1" class="align-center">.</el-col>
            <el-col :span="4">
              <count-input class-name="focus3" @input="(val, e) => {turnToNext( 3, val, e)}" v-model="server.serverIp[2]" :total="3" :showTip="false" :showCounter="false" regType="ip" placeholder="">
              </count-input>
            </el-col>
            <el-col :span="1" class="align-center">.</el-col>
            <el-col :span="4">
              <count-input class-name="focus4" @input="(val, e) => {turnToNext( 4, val, e)}" v-model="server.serverIp[3]" :total="3" :showTip="false" :showCounter="false" regType="ip" placeholder="">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="应用服务器端口">
            <el-col :span="15">
              <count-input
                class-name="focus5"
                v-model="server.appServerPort"
                :total="5"
                :showCounter="false"
                regType="port"
                placeholder="请输入应用服务器端口号">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="FTP服务器端口">
            <el-col :span="15">
              <count-input
                v-model="server.serverPort"
                :total="5"
                :showCounter="false"
                regType="port"
                placeholder="请输入FTP服务器端口号">
              </count-input>
            </el-col>
          </el-form-item>
          <el-form-item label="FTP用户名">
            <el-col :span="15">
              <el-input v-model="server.username" placeholder="请输入FTP用户名"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="FTP密码">
            <el-col :span="15">
              <el-input v-model="server.password" placeholder="请输入FTP密码" type="password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="应用服务器路径">
            <el-col :span="15">
              <el-input v-model="server.appRootDir" placeholder="请输入应用服务器路径">
                <template slot="prepend">/</template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="工作路径">
            <el-col :span="15">
              <el-input v-model="server.workDir" placeholder="请输入工作服务器路径">
                <template slot="prepend" class="server-dir-prepend">
                  <span :title="dirPrepend" class="server-dir-prepend">
                    {{dirPrepend}}
                  </span>
                </template>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="关联区域">
            <el-col :span="15" v-show="!isNew && !isSelect">{{areaName || '无'}}</el-col>
            <el-col :span="9" v-show="!isNew && !isSelect">
              <el-button @click="reselectArea" size="small">重新选择</el-button>
            </el-col>
            <el-col :span="15" v-show="isNew || isSelect">
              <area-cascader
                lazy
                :load="loadArea"
                :areas="areas"
                :mulitiple="false"
                :default-expanded-keys="initExpand"
                @check-area="checkArea">
              </area-cascader>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div class="popup-btn">
        <el-button
          @click="submit"
          type="primary"
          :disabled="submitDis"
          :loading="submiting">提交</el-button>
        <el-button :loading="submiting" @click="close">取消</el-button>
      </div>
    </div>
    <div class="popup-cover"></div>
  </div>
</template>
<script>
  import AreaCascader from './../../common/AreaCascader'
  import CountInput from './../../common/CountInput.vue'
  import API from './../../../assets/js/api'
  import loadAreaMixin from './../../../assets/js/loadAreaMixin'
  export default {
    name: 'addServer',
    mixins: [loadAreaMixin],
    props: {
      show: {
        type: Boolean
      },
      isNew: {
        type: Boolean
      },
      curServer: {
        type: Object
      },
      areas: {
        type: Array
      }
    },
    data () {
      return {
        server: {
          serverName: '',
          serverIp: ['', '', '', ''],
          appServerPort: '',
          serverPort: '',
          username: '',
          password: '',
          appRootDir: '',
          workDir: '',
          areaIds: ''
        },
        areaName: '',
        isSelect: false,
        submiting: false
      }
    },
    watch: {
      curServer: {
        immediate: true,
        handler (curServer) {
          if (curServer) {
            this.initServer(curServer)
          }
        }
      },
      isNew: {
        immediate: true,
        handler (isNew) {
          if (isNew) {
            this.server = {
              serverName: '',
              serverIp: ['', '', '', ''],
              appServerPort: '',
              serverPort: '',
              username: '',
              password: '',
              appRootDir: '',
              workDir: '',
              areaIds: ''
            }
          } else {
            this.initServer(this.curServer)
          }
        }
      }
    },
    computed: {
      submitDis () {
        var server = this.server
        var ipValid = !!(server.serverIp && server.serverIp[0] && server.serverIp[1] && server.serverIp[2] && server.serverIp[3])
        return !(server.serverName && ipValid && server.serverPort && server.appServerPort &&
        server.username && server.password && server.workDir && server.areaIds && server.appRootDir)
      },
      dirPrepend () {
        return '/' + this.server.appRootDir + (this.server.appRootDir ? '/' : '')
      }
    },
    components: {
      AreaCascader,
      CountInput
    },
    methods: {
      initServer (curServer) {
        Object.assign(this.server, curServer)
        var server = this.server
        if (!Array.isArray(server.serverIp)) {
          server.serverIp = server.serverIp === '' ? ['', '', '', ''] : server.serverIp.split('.')
        }
        let workDir = server.workDir || ''
        let appRootDir = server.appRootDir || ''
        if (appRootDir[0] === '/') {
          appRootDir = appRootDir.substring(1)
        }
        workDir = workDir.split('/').pop()
        server.areaIds = server.areaId
        server.workDir = workDir
        server.appRootDir = appRootDir
        this.areaName = server.areaName
        this.isSelect = false
      },
      reselectArea () {
        this.isSelect = true
        this.server.areaIds = ''
      },
      close () {
        this.$emit('update:show', false)
      },
      turnToNext (index, val, e) {
        if (val.length === 3) {
          let $next = $('.focus' + (index + 1))
          if ($next.length > 0) {
            $next[0].focus()
          }
        }
      },
      checkArea (areaIds) {
        this.server.areaIds = areaIds
      },
      submit () {
        var params = {
          serverIp: this.server.serverIp.join('.'),
          id: this.server.id
        }

        this.submiting = true
        this.axios.get(API.check_srever_exist, { params }).then(() => {
          this.editServer(this.isNew)
        }).catch((data) => {
          this.submiting = false
          this.$message({
            message: data.code === '201' ? '服务器ip地址已存在!' : '验证服务器唯一性失败!',
            type: 'error'
          })
        })
      },
      editServer (isNew) {
        let url = isNew ? API.add_server : API.edit_server
        let { serverName, serverIp, appServerPort, serverPort, username, password, appRootDir, workDir, areaIds, id } = this.server
        let data = {
          appServerPort,
          areaIds,
          password,
          serverName,
          serverPort,
          username,
          appRootDir: '/' + appRootDir,
          serverIp: serverIp.join('.'),
          workDir: this.dirPrepend + workDir
        }

        /* 不是新建,加上id参数 */
        !isNew && (data.id = id)

        this.axios({
          method: isNew ? 'post' : 'put',
          data,
          url
        }).then(() => {
          this.$emit('update-server-list')
          this.submiting = false
          this.close()
          this.$message({
            message: (isNew ? '添加' : '修改') + '服务器成功',
            type: 'success'
          })
        }).catch(() => {
          this.submiting = false
          this.$message({
            message: (isNew ? '添加' : '修改') + '服务器失败!',
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
    height: 570px;
    top: calc(50% - 285px);
    left: calc(50% - 261px);
  }
  .add-server-content{
    height: 462px;
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .add-server-content .el-row{
    padding: 20px 0;
  }
  .popup-btn{
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .custom-type{
    color: #7b828c;
    text-align: right;
  }
  .el-form-item{
    margin-bottom: 20px;
  }
  .el-form-item:last-child{
    margin-bottom: 0px;
  }
  .align-center{
    text-align: center;
  }
  .server-dir-prepend{
    display: inline-block;
    max-width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<style>
.add-server .el-input-group__prepend{
  padding: 0 8px;
}
</style>

