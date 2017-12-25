<template>
  <div class="shopList fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table 
        :data="tableData"
        class="width100">
        <el-table-column type="expand">
          <template slot-scope="props"> 
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
                <template slot-scope="scope">
                  <el-button 
                    size="mini"
                    @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
                  <el-button 
                    size="mini"
                    type="success"
                    @click="addFood(scope.$index,scope.row)">编辑</el-button>
                  <el-button 
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index,scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination 
          @size-change = "handleSizeChange"
          :total="count" 
          :current-page="currentPage" 
          :page-size="20" 
          @current-change="handleCurrentChange" 
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
              :options="categoryOptions" 
              v-model="selectedCategory"
              change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品图片" label-width="100px">
            <el-upload 
              action=""
              class="avater_uploader"
              show-file-list="false"
              :on-success="handleServiceAvaterSuccess"
              :before-upload="beforeAvaterUpload">
              <img v-if="selectTable.image_path" :src="baseImgPath + selectTable.image_path" class="avater">
              <i v-else class="el-icon-plus avater-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog_footer">
          <el-button @click="dialogFormVisible">取 消</el-button>
          <el-button @click="updateShop" type="primary">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { baseUrl, baseImageUrl } from "../config/env";
import {
  cityGuess,
  getResturants,
  getResturantsCount,
  foodCategory,
  updateRestrant,
  searchPlace,
  deleteRestrant
} from "../api/getData";
export default {
  data() {
    return {
      baseUrl,
      baseImageUrl,
      city: {},
      offset: 0,
      limit: 20,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      categoryOptions: [],
      selectedCategory: [],
      address: {}
    };
  },
  components: {
    headTop
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess();
        const countData = await getResturantsCount();
        if (countData.status == 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getResturants();
      } catch (error) {
        console.log("获取数据失败", error);
      }
    },
    async getCategory() {
      try {
        const categories = await foodCategory();
        categories.forEach(item => {
          if (item.sub_categories.length) {
            const addNew = {
              value: item.name,
              lable: item.name,
              children: ""
            };
            item.sub_categories.forEach((subitem, index) => {
              if (index == 0) {
                return;
              }
              addNew.children.push({
                value: subitem.name,
                lable: subitem.name
              });
            });
            this.categoryOptions.push(addNew);
          }
        });
      } catch (error) {
        console.log("获取商铺数据失败", error);
      }
    },
    async getResturants() {
      const { latitude, longitude } = this.city;
      const restaurants = await getResturants({
        latitude,
        longitude,
        offset: this.offset,
        limit: this.limit
      });
      this.tableData = [];
      restaurants.forEach(item => {
        const tableData = {};
        tableData.name = item.name;
        tableData.address = item.address;
        tableData.description = item.description;
        tableData.id = item.id;
        tableData.phone = item.phone;
        tableData.rating = item.rating;
        tableData.recent_order_num = item.recent_order_num;
        tableData.category = item.category;
        tableData.imagePath = item.imagePath;
        this.tableData.push(tableData);
      });
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },
    handleEdit(index, row) {
      this.selectTable = row;
      this.address.address = row.address;
      this.dialogFormVisible = true;
      this.selectedCategory = row.category.split("/");
      if (!this.categoryOptions.length) {
        this.getCategory();
      }
    },
    addFood(index, row) {
      this.$router.push({ path: "addGoods", query: { restaurant_id: row.id } });
    },
    async handleDelete(index, row) {
      try {
        const res = await deleteRestrant(row.id);
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "删除店铺成功"
          });
          this.tableData.splice(index, 1);
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });
        console.log("删除店铺失败");
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchPlace(this.city.id, queryString);
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    addressSelect(value) {
      const { address, latitude, longitude } = value;
      this.address = { address, latitude, longitude };
    },
    handleServiceAvaterSuccess(res, file) {
      if (res.status == 1) {
        this.selectTable.imagePath = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvaterUpload(file) {
      const isRightType =
        flie.type === "images/jpeg" || flie.type === "images/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isRightType) {
        this.$message.error("上传图片格式只能是jpg格式！");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过2M！");
      }
      return isRightType && isLt2M;
    },
    async updateShop() {
      this.dialogFormVisible = false;
      try {
        Object.assign(this.selectTable, this.address);
        this.selectTable.category = this.selectedCategory.join("/");
        const res = await updateRestrant();
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "更新店铺信息成功"
          });
          this.getResturants();
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      } catch (error) {
        console.log("跟新店铺信息失败", error);
      }
    }
  }
};
</script>

<style>

</style>
