<template>
  <div class="foodList fillcontain" >
    <head-top></head-top>
    <div class="tableContainer">
      <el-table 
        :data="tableData"
        @expand="expand"
        :expand-row-keys="expendRow"
        :row-key="row => row.index"
        style="width:100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称">
                <span>{{props.row.name}}</span>
              </el-form-item>
              <el-form-item label="餐馆名称">
                <span>{{props.row.restaurant_name}}</span>
              </el-form-item>
              <el-form-item label="食品 ID">
                <span>{{props.row.item_id}}</span>
              </el-form-item>
              <el-form-item label="餐馆 ID">
                <span>{{props.row.restaurant_id}}</span>
              </el-form-item>
              <el-form-item label="食品介绍">
                <span>{{props.row.description}}</span>
              </el-form-item>
              <el-form-item label="餐馆地址">
                <span>{{props.row.restaurant_address}}</span>
              </el-form-item>
              <el-form-item label="食品评分">
                <span>{{props.row.rating}}</span>
              </el-form-item>
              <el-form-item label="食品分类">
                <span>{{props.row.category_name}}</span>
              </el-form-item>
              <el-form-item label="月销量">
                <span>{{props.row.month_sales}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="食品名称" prop="name"></el-table-column>
        <el-table-column label="食品介绍" prop="description"></el-table-column>
        <el-table-column label="食品评分" prop="rating"></el-table-column>
        <el-table-column label="食品操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEidt(scope.row)">编辑</el-button>
            <el-button size="mini" @click="handleDelete(scope.$index,scope.row)" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination 
          :total="count" 
          :current-page="currentPage" 
          :page-size="20" 
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange" 
          layout="total,prev,pager,next">
        </el-pagination>
      </div>
      <el-dialog title="修改食品信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="食品信息" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="食品介绍" label-width="100px">
            <el-input v-model="selectTable.description"></el-input>
          </el-form-item>
          <el-form-item label="食品分类" label-width="100px">
            <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
              <el-option v-for="item in menuOptions" :key="item.value" :label="item.label" :value="item.index">

              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品图片" label-width="100px"> 
            <el-upload 
              :action="baseUrl+''" 
              class="avatar_uploader" 
              :show-file-list="false"
              :on-success="handleServiceAvatarSuccess"
              :before-upload="beforeAvatarUpload">
                <img v-if="selectTable.image_path" :src="baseImagePath+selectTable.image_path" class="avatar" alt="">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <el-row class="overflowAuto textCenter">
          <el-table :data="specs" :row-class-name="tableRowClassName">
            <el-table-column label="规格" prop="specs"></el-table-column>
            <el-table-column label="包装费" prop="packing_fee"></el-table-column>
            <el-table-column label="价格" prop="price"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  type="danger"
                  @click="deleteSpcs"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" @click="specsFormVisible = true" style="margin-bottom:10px">添加规格</el-button>
        </el-row>
        <div slot="footer" class="dialog_footer">
          <el-button @click="specsFormVisible = false">取消</el-button>
          <el-button type="primary" @click="updateFood">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="添加规格">
        <el-form :rules="specsFormrules" :model="specsForm">
          <el-form-item label="规格" label-width="100px" prop="specs">
            <el-input v-model="specsForm.specs" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="包装费" label-width="100px">
            <el-input v-model="specsForm.paking_fee" :min="0" :max="100" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="价格" label-width="100px">
            <el-input v-model="specsForm.price" :min="0" :max="10000" placeholder=""></el-input>
          </el-form-item>
        </el-form>
        <div class="dialog_footer">
          <el-button @click="specsFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addSepcs"></el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import Mock from "mockjs";
import { baseUrl, baseImgPath } from "../config/env";
import {
  getFoods,
  getFoodsCount,
  getMenu,
  updateFood,
  deleteFood,
  getRestaurantDetail,
  getMenuById
} from "../api/getData";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      restaurant_id: null,
      city: {},
      offset: 0,
      limit: 20,
      count: 0,
      tableData: [],
      currentPage: 1,
      selectTable: {},
      dialogFormVisible: false,
      menuOptions: [],
      selectMenu: {},
      selectIndex: null,
      specsForm: {
        specs: "",
        packing_fee: 0,
        price: 20
      },
      specsFormrules: {
        specs: [{ required: true, message: "请输入规格", trigger: "blur" }]
      },
      specsFormVisible: false,
      expendRow: []
    };
  },
  components: {
    headTop
  },
  computed: {
    specs: function() {
      let specs = [];
      if (this.selectTable.specfoods) {
        this.selectTable.specfoods.forEach(item => {
          specs.push({
            specs: item.specs_name,
            packing_fee: item.packing_fee,
            price: item.price
          });
        });
      }
      return specs;
    }
  },
  created() {
    this.restaurant_id = this.$route.query.restaurant_id;
    this.mockData();
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const countData = await getFoodsCount();
        if (countData.status == 1) {
          this.count = countData.count;
        } else {
          throw new Error("获取数据失败");
        }
        this.getFoods();
      } catch (error) {
        console.log("获取数据失败", error);
      }
    },
    async getMenu() {
      this.menuOptions = [];
      try {
        const menu = await getMenu({
          restaurant_id: this.selectTable.restaurant_id,
          allMenu: true
        });
        menu.forEach((item, index) => {
          this.menuOptions.push({
            label: item.label,
            value: item.id,
            index
          });
        });
      } catch (error) {
        console.log("获取食品种类失败", error);
      }
    },
    async getFoods() {
      const foods = await getFoods({
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id
      });
      this.tableData = [];
      foods.data.forEach((item, index) => {
        const tableData = {};
        tableData.name = item.name;
        tableData.item_id = item.item_id;
        tableData.description = item.description;
        tableData.rating = item.rating;
        tableData.month_sales = item.month_sales;
        tableData.restaurant_id = item.restaurant_id;
        tableData.category_id = item.category_id;
        tableData.image_path = item.image_path;
        tableData.specsFoods = item.specsFoods;
        tableData.index = index;
        this.tableData.push(tableData);
      });
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 2) {
        return "position-row";
      }
      return "";
    },
    addSepcs() {
      this.specs.push({ ...this.specsForm });
      this.specsForm.specs = "";
      this.specsForm.packing_fee = 0;
      this.specsForm.price = 20;
      this.specsFormVisible = false;
    },
    deleteSpces(index) {
      this.specs.slice(index, 1);
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getFoods();
    },
    expand(row, status) {
      if (status) {
        this.getSelectItemData(row);
      } else {
        const index = this.expendRow.indexOf(row.index);
        this.expendRow.slice(index, 1);
      }
    },
    handleEidt(row) {
      this.getSelectItemData(row, "eidt");
      this.dialogFormVisible = true;
    },
    async getSelectItemData(row, type) {
      //获取弹窗数据
      const restraurant = await getRestaurantDetail(row.restaurant_id);
      const category = await getMenuById(row.restaurant_id);
      this.selectTable = {
        ...row,
        ...{
          restaurant_name: restraurant.name,
          restaurant_address: restraurant.address,
          category_name: category.name
        }
      };
      this.selectMenu = { label: category.name, value: row.category_id };
      this.tableData.splice(row.index, 1, { ...this, selectTable });
      this.$nextTick(() => {
        this.expendRow.push(row.index);
      });
      if (type == "eidt" && this.restaurant_id != row.restaurant_id) {
        this.getMenu();
      }
    },
    handleSelect(index) {
      (this.selectIndex = index), (this.selectMenu = this.menuOptions[index]);
    },
    async handleDelete(index, row) {
      try {
        const res = deleteFood(row.item_id);
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "删除食品成功"
          });
          this.tableData.slice(index, 1);
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: error.message
        });
        console.log("删除食品失败");
      }
    },
    handleServiceAvatarSuccess(res, file) {
      if (res.status == 1) {
        this.selectTable.image_path = res.image_path;
      } else {
        this.$message({
          type: "error",
          message: "上传图片失败"
        });
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isRightType) {
        this.$message.error("图片格式不正确");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过2M！");
      }
    },
    async updateFood() {
      this.dialogFormVisible = false;
      try {
        const subData = {
          new_categpry_id: this.selectMenu.value,
          specs: this.specs
        };
        const postData = {
          ...this.selectTable,
          ...subData
        };
        const res = updateFood();
        if (res.status === 1) {
          this.$message({
            type: "success",
            message: "更新食品成功"
          });
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      } catch (error) {
        console.log("更新餐馆信息失败！");
      }
    },
    mockData() {
      Mock.mock("/users/getFoodsCount", "get", {
        status: 1,
        count: 345
      });
      Mock.mock("/users/getFoods", "get", {
        data: [
          {
            name: "qsda",
            item_id: "qwe",
            description: "好吃",
            rating: 3.9,
            month_sales: 2131,
            restaurant_id: 21,
            category_id: 3,
            image_path: "aa/aa/aa",
            specsFoods: {}
          }
        ]
      });
    }
  }
}; //
</script>

<style>

</style>
