<template>
  <div class="metarial-list">
    <div class="metarial-list-btns">
      <el-button type="primary" @click="showRelateColumn" :disabled="colSelect.length !== 1" size="small"><i class="ipanel-icon2 ipanel-icon-link"></i>关联栏目</el-button>
      <el-button type="primary" @click="confirmDel" :disabled="colSelect.length === 0" size="small"><i class="ipanel-icon1 ipanel-icon-del"></i>删除</el-button>
      <el-col :span="4" :offset="16"><el-input v-model="mateFilter.title" suffix-icon="el-icon-search" placeholder="请输入素材名关键字"></el-input></el-col>
    </div>
    <div class="metarial-list-table">
      <el-table
        ref="metarialRecycle"
        :data="mateList"
        :height="490"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="title"
          label="素材标题"
          width="220">
        </el-table-column>
        <el-table-column
          prop="author"
          label="添加人"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          width="220">
        </el-table-column>
        <el-table-column
          label="关联栏目"
          width="300">
          <template slot-scope="scope">

            <!-- 没有关联栏目begin -->
            <div v-if="!scope.row.column || scope.row.column.length === 0" class="relate-column-item">无</div>
            <!-- 没有关联栏目end -->

            <!-- 关联栏目只有一个begin -->
            <div v-else-if="scope.row.column.length === 1">
              <div v-for="(col,index) in scope.row.column" class="relate-column-item" :key="index">
                <span class="relate-column-text">
                  {{col.area+'-'+col.app+'('+col.terminal+')'+'-'+col.column}}
                </span>
                <i class="ipanel-icon2 ipanel-icon-preview" v-if="col.hasTemp === 1"></i>
              </div>
            </div>
            <!-- 关联栏目只有一个end -->
            
            <!-- 关联栏目多于一个begin -->
            <el-popover trigger="hover" placement="top" v-else>
              <p v-for="(col, index) in scope.row.column" class="popover-p" :key="index">
                <span class="relate-column-text">
                  {{col.area+'-'+col.app+'('+col.terminal+')'+'-'+col.column}}
                </span>
                <i class="ipanel-icon2 ipanel-icon-preview" v-if="col.hasTemp === 1"></i>
              </p>
              <div slot="reference" class="col-wrapper">
                <div class="relate-column-item">
                  <p>{{scope.row.column[0].area+'-'+scope.row.column[0].app+'('+scope.row.column[0].terminal+')'+'-'+scope.row.column[0].column}}</p>
                  <p>...</p>
                </div>
              </div>
            </el-popover>
            <!-- 关联栏目多于一个end -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">预览</el-button>
            <el-button v-if="!scope.row.firstEntery" type="text" size="small">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="metarial-list-page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="[20, 40, 80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 关联栏目操作begin -->
    <relate-node
      :show.sync="view.relateColumnShow"
      :mateList="colSelect"
      :ori-nodes="curEntryNodes"
      :curView="'set'">
    </relate-node>
    <!-- 关联栏目操作end -->
  </div>
</template>
<script>
  import API from './../../../assets/js/api.js'
  import RelateNode from './../RelateNode.vue'
  export default {
    name: 'recycleMetaList',
    props: {
    },
    data () {
      return {
        mateList: [],
        mateFilter: {
          title: ''
        },
        curPage: 1,
        pageSize: 20,
        total: 0,
        curEntryNodes: [],
        colSelect: [],
        cascaderProp: {
          value: 'label',
          label: 'label'
        },
        view: {
          relateColumnShow: false
        }
      }
    },
    components: {
      RelateNode
    },
    methods: {
      getMetaList () {
        let params = new URLSearchParams()
        let { curPage, pageSize, mateFilter: { title } } = this
        params.append('page', curPage)
        params.append('size', pageSize)
        title && params.append('title', title)
        this.axios.get(API.get_recycle_entry, { params }).then((data) => {
          this.total = data.total
          this.mateList = data.rows
          if (this.curPage === 1) {
            this.mateList.length > 0 && (this.mateList[0].firstEntery = true)
          }
        })
      },
      handleSelectionChange (selection) {
        this.colSelect = selection
      },
      handleSizeChange (size) {
        this.pageSize = size
        this.getMetaList()
      },
      handleCurrentChange (page) {
        this.curPage = page
        this.getMetaList()
      },
      confirmDel () {
        this.$confirm('素材删除后将不可恢复,请谨慎操作!', '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delEntrys()
        }).catch(() => {})
      },
      delEntrys () {
        let ids = this.colSelect.map(function (ele) {
          return ele.id
        }, this)
        ids = ids.join(',')
        let params = {
          ids
        }
        this.axios.delete(API.del_entry, { params }).then(() => {
          this.getMetaList()
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        }).catch(() => {
          this.$message({
            message: '删除失败!',
            type: 'error'
          })
        })
      },
      showRelateColumn () {
        this.view.relateColumnShow = true
      }
    },
    created () {
      this.getMetaList()
    }
  }
</script>
<style scoped>
  .metarial-list{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .title{
    text-align: right;
    padding-right: 20px;
  }
  .metarial-list-btns{
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  .metarial-list-page{
    text-align: right;
    padding-top: 5px;
  }
  .popover-p{
    margin: 10px 0;
  }
  .relate-column-item{
    font-size: 12px;
    line-height: 14px;
  }
  .relate-column-text{
    vertical-align: middle;
  }
</style>
<style>
  .metarial-list-btns .el-button span{
    display: flex;
    align-items: center;
  }
  .metarial-list-table .el-button span{
    color: #1f2d3d;
    text-decoration: underline;
  }
  .metarial-list-table .el-button:hover span{
    color: #20a0ff;
  }
  .reject-msg-text{
    margin-left: 20px;
    color: #000;
  }
  .reject-msg-p{
    margin: 10px 0;
  }
</style>
