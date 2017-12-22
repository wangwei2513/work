<template>
  <div class="shopList fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table 
        :data="tableData"
        class="width100">
        <el-table-column type="expand">
          <template scope="props"> 
            <el-form label-position="left" inline class="">
              <el-form-item label="店铺名称">
                <span>{{props.row.name}}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{props.row.address}}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{props.row.description}}</span>
              </el-form-item>
              <el-form-item label="店铺ID">
                <span>{{props.row.id}}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{props.row.phone}}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{props.row.rating}}</span>
              </el-form-item>
              <el-form-item label="销量">
                <span>{{props.row.recent_order_num}}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{props.row.category}}</span>
              </el-form-item>
              <el-table-column 
                label="店铺名称"
                prop="name">
              </el-table-column>
              <el-table-column 
                label="店铺地址"
                prop="name">
              </el-table-column>
              <el-table-column 
                label="店铺介绍"
                prop="name">
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template scope="scope">
                  <el-button 
                    size="mini"
                    @click="handelEdit(scope.$index,scope.row)">编辑</el-button>
                  <el-button 
                    size="mini"
                    type="success"
                    @click="addFood(scope.$index,scope.row)">编辑</el-button>
                  <el-button 
                    size="mini"
                    type="danger"
                    @click="handelDelete(scope.$index,scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination 
          :total="count" 
          :current-page="handelCurrentPage" 
          :page-size="20" 
          @current-change="handelCurrenChange" 
          layout="totle,prev,pager,next,">
        </el-pagination>
      </div>
      <el-dialog title="修改店铺信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="店铺名称" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-autocomplete 
              v-model="selectTable.address" 
              placeholder="请输入地址"
              :fetch-suggestions="querySearchAsync"
              @select="addressSelect"
              style="width:100%">
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="100px">
            <el-input v-model="selectTable.description" placeholder="店铺介绍"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.phoneNum" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类" label-width="100px">
            <el-cascader 
              :options="categoryOption" 
              v-model="selectedCategory"
              change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品图片" label-width="100px">
            <el-upload 
              action=""
              class="avater_uploader"
              show-file-list="false"
              :on-success="handelServiceAvaterSuccess"
              :before-upload="beforeAvaterUpload">
              <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avater">
              <i v-else class="el-icon-plus avater-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div solot="footer" class="dialog_footer">
          <el-button @click="dialogFormVisible">取 消</el-button>
          <el-button @click="updateShop" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from '../components/headTop'
import {baseUrl,imageUrl} from '../config/env'
export default {
  data () {
    return {
      
    }
  }
};
</script>

<style>

</style>
