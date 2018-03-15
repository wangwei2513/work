<template>
    <div class="meta-list">
      <div class="meta-list-ctr">
        <div class="ctr-left">
          <el-button type="primary" :disabled="colSelect===''" @click="checkMeta">查看</el-button>
          <el-button type="primary" :disabled="colSelect===''">预览</el-button>
          <el-button type="primary" @click="confirmRoute">素材管理</el-button>
        </div>
        <div class="ctr-right">
          <span>状态：</span>
          <el-select v-model="filter.status" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="(val, key) in entryStatusMap"
              :key="key"
              :label="val"
              :value="key">
            </el-option>
          </el-select>
          <el-input
            placeholder="请输入标题关键词"
            prefix-icon="el-icon-search"
            :value="filter.key"
            @change="(val) => {filter.key =val}">
            <i slot="suffix" @click="filter.key = ''" v-show="filter.key !== ''" class="el-input__icon el-icon-circle-close"></i>
          </el-input>
        </div>
      </div>
      <!-- 素材列表begin  -->
      <div class="meta-list-main">
        <el-table
          :data="metaList"
          :height="440"
          border
          highlight-current-row
          style="width: 100%"
          @current-change="currentRowChange">
          <el-table-column
            width="55">
            <template slot-scope="scope">
              <el-radio v-model="colSelect" :label="scope.row.id"> </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="素材标题"
            prop="title"
            width="220">
          </el-table-column>
          <el-table-column
            label="状态"
            width="160">
            <template slot-scope="scope">
              {{entryStatusMap[scope.row.entryStatus]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            label="添加人"
            width="160">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="添加时间">
          </el-table-column>
        </el-table>
      </div>
      <!-- 素材列表end -->
    </div>
  </template>
  <script>
    import API from './../../../assets/js/api.js'
    import util from './../../../assets/js/util.js'
    export default {
      name: 'metaList',
      props: {
        curNode: {
          type: Object
        },
        appInfo: {
          type: Object
        }
      },
      data () {
        return {
          filter: {
            status: '',
            key: ''
          },
          colSelect: '',
          metaList: [],
          entryStatusMap: util.entryStatusMap
        }
      },
      watch: {
        curNode: {
          immediate: true,
          deep: true,
          handler (newVal) {
            if (newVal) {
              this.getMateList()
            }
          }
        },
        filter: {
          deep: true,
          handler (newVal) {
            this.getMateList()
          }
        }
      },
      methods: {
        getMateList () {
          let { areaId, deviceIds: deviceId, id: appId } = this.appInfo
          let { id: nodeId } = this.curNode
          let { status, key } = this.filter
          let params = {
            areaId,
            appId,
            deviceId,
            nodeId,
            page: 1,
            size: 999
          }
          status && (params.entryStatus = status)
          key && (params.title = key)

          this.axios.get(API.get_entry_list, { params }).then((data) => {
            this.metaList = data.rows
          })
        },
        checkMeta () {
          this.metaList.some(function (meta) {
            if (meta.id === this.colSelect) {
              this.$emit('showMateDetail', $.extend(true, {}, meta))
              console.log(this.colSelect)
              return true
            }
          }, this)
        },
        confirmRoute () {
          var self = this
          this.$confirm('确认跳转至素材管理模块?', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            self.$router.push({path: '/material'})
          }).catch(() => {})
        },
        currentRowChange (curRow) {

        }
      }
    }
  </script>
  <style>
    .meta-list{
      font-size: 14px;
      color: #7b828c;
    }
    .meta-list-ctr{
      overflow: hidden;
    }
    .ctr-left{
      float: left;
    }
    .ctr-right{
      float: right;
    }
    .ctr-right .el-input{
      width: 200px;
    }
    .meta-list-main{
      margin-top: 20px;
      width: 100%;
    }
  </style>
  