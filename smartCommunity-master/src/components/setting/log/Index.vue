<template>
  <div class="log-manage">
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
    <div class="log-manage-content">
      <div style="overflow: hidden;">
        <el-col :span="2">
          <iframe id="framFile" name="framFile" style="display:none;"></iframe>
          <el-button @click="downloadLogTable" type="primary" size="small">报表导出</el-button>
        </el-col>
        <el-col :span="4" :offset="3">
          <el-input :value="filter.operateUserName" @change="val => {filter.operateUserName = val}" prefix-icon="el-icon-search" placeholder="请输入用户名关键字" size="small">
            <i slot="suffix" @click="filter.operateUserName = ''" v-show="filter.operateUserName !== ''" class="el-input__icon el-icon-circle-close"></i>
          </el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-input :value="filter.operatingDesc" @change="val => {filter.operatingDesc = val}" prefix-icon="el-icon-search" placeholder="请输入操作内容关键字" size="small">
            <i slot="suffix" @click="filter.operatingDesc = ''" v-show="filter.operatingDesc !== ''" class="el-input__icon el-icon-circle-close"></i>
          </el-input>
        </el-col>
        <el-col :span="2" class="lh36gray">起止时间</el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="filter.duration"
            type="datetimerange"
            size="small"
            :picker-options="pickerOptions"
            placeholder="选择时间范围"
            align="right">
          </el-date-picker>
        </el-col>
      </div>
      <div>
        <el-table
          :height="501"
          border
          :data="oprationData">
          <el-table-column
           type="index"
           width="80px">
          </el-table-column>
          <el-table-column
           prop="operatingUserName"
           label="用户名"
           width="120px">
          </el-table-column>
          <el-table-column
            prop="operatingDesc"
            label="操作内容">
          </el-table-column>
          <el-table-column
            prop="operatingDate"
            label="操作时间"
            width="320px">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wp">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[40, 80, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import API from './../../../assets/js/api'
import util from './../../../assets/js/util'
export default {
  name: 'logManage',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      oprationData: [],
      filter: {
        duration: ['', ''],
        operateUserName: '',
        operatingDesc: ''
      },
      total: 0,
      currentPage: 1,
      size: 40,
      tabsVal: '1',
      tabs: [
        {
          title: '日志管理',
          name: '1',
          closable: false
        }
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (date) {
          let now = Date.now()
          let target = new Date(date).getTime()
          return now < target
        }
      }
    }
  },
  watch: {
    filter: {
      immediate: true,
      deep: true,
      handler () {
        this.getLoglist()
      }
    }
  },
  methods: {
    getLoglist (cusParams) {
      var startTime
      var endTime
      if (this.filter.duration && this.filter.duration.length === 2) {
        startTime = this.filter.duration[0] && util.formatDate(this.filter.duration[0], 'YYYY-MM-DD hh:mm:ss')
        endTime = this.filter.duration[1] && util.formatDate(this.filter.duration[1], 'YYYY-MM-DD hh:mm:ss')
      }
      var params = {
        page: this.currentPage,
        size: this.size,
        startTime,
        endTime,
        operateUserName: this.filter.operateUserName,
        operatingDesc: this.filter.operatingDesc
      }
      for (var key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      this.axios.get(API.get_log_list + util.traUrlQuery(params)).then((data) => {
        this.oprationData = data.rows
        this.total = data.total
      })
    },
    downloadLogTable () {
      var form = $('<form>')
      form.attr('style', 'display:none')
      form.attr('target', 'framFile')
      form.attr('method', 'get')
      form.attr('action', API.download_log)
      $(this.$el).append(form)
      form.submit()
    },
    handleSizeChange (size) {
      this.size = size
      this.getLoglist()
    },
    handleCurrentChange (page) {
      this.currentPage = page
      this.getLoglist()
    }
  },
  created () {
    this.getLoglist()
  }
}
</script>
<style scoped>
.log-manage{
  padding: 20px;
}
.lh36gray{
  line-height: 36px;
  font-size: 14px;
  color: #7b828c;
  text-align: right;
  padding-right: 10px;
}
.el-table{
  margin-top: 10px;
}
.pagination-wp{
  text-align: right;
  padding-top: 10px;
}
</style>

