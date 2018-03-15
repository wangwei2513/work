<template>
  <div class="user-manage-list">
    <div class="user-area-tree">
      <el-tree
        :data="areas"
        :expand-on-click-node="false"
        node-key="index"
        :default-expanded-keys="expanded"
        :auto-expand-parent= "false"
        @current-change="changeCurNode"
        :highlight-current="true">
      </el-tree>
    </div>
    <div class="user-list">
      <i-tabs
       :tabs="tabs"
       :activeTab="activeTab"
       @active-change="changeView">
      </i-tabs>
      <div class="filter">
        <el-input placeholder="请输入关键词" icon="search"></el-input>
      </div>
      <el-table
        v-if="view.curView === 'tv'"
        :data="tvUserList"
        :height="501"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="ca_num"
          label="CA卡号">
        </el-table-column>
      </el-table>
      <el-table
        v-if="view.curView === 'phone'"
        :data="phoneUserList"
        :height="501"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="用户名">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import ITabs from './../../common/ITabs'
export default {
  name: 'userList',
  props: {
    areas: {
      type: Array
    }
  },
  data () {
    return {
      tvUserList: [
        {
          ca_num: '12415233447586'
        }
      ],
      phoneUserList: [
        {
          user_name: '沙发沙发'
        }
      ],
      expande: [],
      currentNode: '',
      activeTab: '1',
      tabs: [
        {
          label: 'TV端用户',
          id: '1',
          view: 'tv'
        },
        {
          label: '手机端用户',
          id: '2',
          view: 'phone'
        }
      ],
      view: {
        curView: 'tv'
      }
    }
  },
  components: {
    ITabs
  },
  methods: {
    changeCurNode () {},
    changeView (tab) {
      this.view.curView = tab.view
    }
  }
}
</script>
<style scoped>
.user-manage-list{
  width: 100%;
  height: 547px;
  box-sizing: border-box;
}
.user-area-tree{
  width: 120px;
  height: 100%;
  box-sizing: border-box;
  float: left;
  border: thin solid #d3dce6;
}
.user-list{
  width: calc(100% - 130px);
  height: 100%;
  margin-left: 10px;
  float: left;
  position: relative;
}
.user-area-tree .el-tree{
  border: none;
}
.filter{
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
}
.el-table{
  margin-top: 10px;
}
</style>
