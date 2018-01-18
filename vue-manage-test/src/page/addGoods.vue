<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-row>
      <el-col :span="14" :offset="4">
        <header class="form_header">选择食品种类</header>
        <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form">
          <el-row class="category_select">
            <el-form-item label="食品种类">
              <el-select v-model="categoryForm.categorySelect" :placeholder="selectValue.select" class="width_100">
                <el-option
                 v-for="item in categoryForm.categoryList" 
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row class="add_category_row" :class="showAddCategory?'showCategory':''">
            <div class="add_category">
              <el-form-item label="食品种类">
                <el-input v-model="categoryForm.name" placeholder="食品种类"></el-input>
              </el-form-item>
              <el-form-item label="食品描述">
                <el-input v-model="categoryForm.description" placeholder="食品描述"></el-input>
              </el-form-item>
              <el-button type="primary" @click="addCategoryForm('categoryForm')" class="margin_left_110">
                提交
              </el-button>
            </div>
          </el-row>
          <div class="add_category_button" @click="addCategoryFun">
            <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i> 
            <i class="el-icon-caret-bottom edit_icon" v-else slot='icon'></i>
            <span>添加食品种类</span>
          </div>
        </el-form>
        <header class="form_header">添加食品</header>
        <el-form
         :model="foodForm" 
         :rules="rules" 
         ref="foodForm"
         label-width="110px"
         class="form food_form">
          <el-form-item label="食品名称" prop="name">
            <el-input v-model="foodForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="食品活动" prop="activity">
            <el-input v-model="foodForm.activity" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="食品详情" prop="description">
            <el-input v-model="foodForm.description" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="上传食品照片">
            <el-upload
              class="img_upload"
             :action="baseUrl+'/a/a/a'"
             :show-file-list="false"
             :on-success="uploadImg"
             :before-upload="beforeImgUpload"
             >
             <img :src="baseImagePath+foodForm.foodImagePath" v-if="foodForm.foodImagePath" class="avatar" alt="">
             <i v-else class="el-icon-plus avatar_upload_icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="食品特点">
            <el-select v-model="foodForm.attributes" multiple placeholder="请选择">
              <el-option
               v-for="item in foodForm.attributes" 
               :key="item.value"
               :value="item.value"
               :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="食品规格">
            <el-radio v-model="foodSpces" label="one">单规格</el-radio>
            <el-radio v-model="foodSpces" label="more">多规格</el-radio>
          </el-form-item>
          <el-row v-if="foodSpces == 'one'">
            <el-form-item label="包装费">
              <el-input-number v-model="foodForm.spces[0].packing_fee" :min="3" :max="15"></el-input-number>
            </el-form-item>
            <el-form-item label="价格">
              <el-input-number v-model="foodForm.spces[0].price" :min="15" :max="250"></el-input-number>
            </el-form-item>
          </el-row>
          <el-row v-else class="overflow_auto textalignCenter">
            <el-button type="primary" @click="dialogFormVisible = true" style="margin-bottm:10px;">添加规格</el-button>
            <el-table
             :data="foodForm.spces"
             class='margin_bottom_20'
             :row-class-name="tableRowClassName">
              <el-table-column label="规格" prop="spces">
              </el-table-column>
              <el-table-column label="包装费" prop="packing_fee"></el-table-column>
              <el-table-column label="价格" prop="price"></el-table-column>
              <el-table-column label="操作">
               <template slot-scope="scope">
                 <el-button type="danger" size="mini" @click="handelDelete(scope.$index)">删除</el-button>
               </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="addFood('foodForm')">确认添加食品</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="添加规格" :visible.sync="dialogFormVisible">
				  	<el-form :rules="spcesFormRules" :model="spcesForm">
					    <el-form-item label="规格" label-width="100px" prop="spces">
					     	<el-input v-model="spcesForm.spces" auto-complete="off"></el-input>
					    </el-form-item>
					    <el-form-item label="包装费" label-width="100px">
							<el-input-number v-model="spcesForm.packing_fee" :min="0" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="价格" label-width="100px">
							<el-input-number v-model="spcesForm.price" :min="0" :max="10000"></el-input-number>
						</el-form-item>
				  	</el-form>
				  <div slot="footer" class="dialog-footer">
				    <el-button @click="dialogFormVisible = false">取 消</el-button>
				    <el-button type="primary" @click="addSpces">确 定</el-button>
				  </div>
				</el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import Mock from "mockjs";
import { getCategories, addCategory, addFood } from "../api/getData";
import { baseUrl, baseImgPath } from "../config/env";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      categoryForm: {
        name: "",
        description: "",
        categorySelect: "",
        categoryList: []
      },
      foodForm: {
        name: "",
        activity: "",
        description: "",
        attributes:[],
        spces: [
          {
            spces: "",
            packing_fee: 0,
            price: 20
          }
        ]
      },
      foodImagePath: "",
      restaurant_id: 0,
      rules: {
        name: [{ required: true, message: "请输入食品名称", trigger: "blur" }]
      },
      attributes: [
        {
          value: "新品",
          label: "新品"
        },
        {
          value: "招牌",
          label: "招牌"
        }
      ],
      showAddCategory: false,
      dialogFormVisible: false,
      foodSpces: "one",
      spcesForm: {
        spces: "",
        packing_fee: "",
        price: ""
      },
      spcesFormRules: {
        spces: [{ required: true, message: "请输入规格", trigger: "blur" }]
      }
    };
  },
  components: {
    headTop
  },
  created() {
    this.mockData();
    if (this.$route.query.rastaurant_id) {
      this.restaurant_id = this.$route.restaurant_id;
    } else {
      this.restaurant_id = Math.random();
      this.$msgbox({
        title: "提示",
        message: "添加商品需要选择一个商铺，现在就去选择商铺吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.$router.push("/shopList");
            done();
          } else {
            this.$message({
              type: "info",
              message: "取消"
            });
            done();
          }
        }
      });
    }
    this.initData();
  },
  computed: {
    selectValue: function() {
      return (
        this.categoryForm.categoryList[this.categoryForm.categorySelect] || {}
      );
    }
  },
  methods: {
    async initData() {
      try {
        const result = await getCategories(this.restaurant_id);
        if (result.status === 1) {
          console.log(result.category_list);
          result.category_list.map((item, index) => {
            item.value = index;
            item.label = item.name;
          });
          this.categoryForm.categoryList = result.category_list;
        } else {
          console.log(result);
        }
      } catch (error) {
        console.log("获取category失败！", error);
      }
    },
    addCategoryFun() {
      this.showAddCategory = !this.showAddCategory;
    },
    addCategoryForm(categoryForm) {
      this.$refs[categoryForm].validate(async valid => {
        if (valid) {
          const params = {
            name: this.categoryForm.name,
            description: this.categoryForm.description,
            restaurant_id: this.restaurant_id
          };
          try {
            const result = await addCategory(params);
            if (result.status === 1) {
              this.initData();
              this.categoryForm.name = "";
              this.categoryForm.description = "";
              this.showAddCategory = false;
              this.$message({
                type: "success",
                message: "添加成功"
              });
            } else {
              console.log(result);
            }
          } catch (error) {
            console.log("添加失败", error);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
        }
      });
    },
    uploadImg(res, file) {
      if (res.status === 1) {
        this.foodForm.foodImagePath = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeImgUpload(file) {
      const isRightType =
        file.type === "images/jpeg" || file.type === "images/png";
      const isL2M = file.size / 1024 / 1024 < 2;
      if (!isRightType) {
        this.$message.error("图片格式必须是jpg");
      }
      if (!isL2M) {
        this.$message.error("图片大小必须小于2M");
      }
      return isRightType && isL2M;
    },
    addSpces() {
      this.foodForm.spces.push({...this.spcesForm});
      this.spcesForm.spces = "";
      this.spcesForm.packing_fee = 0;
      this.spcesForm.price = 20;
      this.dialogFormVisible = false;
    },
    handelDelete(index) {
      this.foodForm.spces.splice(index, 1);
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
    },
    addFood(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            ...this.foodForm,
            category_id: this.categoryForm.category_id,
            restaurant_id: this.restaurant_id
          };
          try {
            const result = await addFood(params);
            if (result.status === 1) {
              this.$message({
                type: "success",
                message: "添加成功"
              });
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
          } catch (error) {
            console.log("添加失败！", error);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查如数是否正确",
            offset: 100
          });
          return false;
        }
      });
    },
    mockData() {
      Mock.mock("/users/getCategories", "get", {
        status: 1,
        "category_list|5": [
          {
            name: Mock.Random.cname(7, 10)
          }
        ]
      });
      Mock.mock("/users/addCategory", "get", {
        status: 1
      });
      Mock.mock("/users/addFood", "get", {
        status: 1
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin.less";
.add_category_button {
  border: 1px solid #eaeefb;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top: none;
  color: #bbb;
  text-align: center;
  height: 40px;
  line-height: 40px;
  transition: all 400ms;
  &:hover {
    background: #f9fafc;
    span,
    .edit_icon {
      color: #20a0ff;
    }
  }
}
.add_category_row {
  height: 0;
  overflow: hidden;
  transition: all 400ms;
  background: #f9fafc;
}
.category_select {
  border: 1px solid #eaeefb;
  padding: 10px 30px 10px 10px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.form_header {
  width: 100%;
  line-height: 60px;
  font-size: 16px;
  text-align: center;
}
.form {
  min-width: 400px;
  margin-bottom: 30px;
  &:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
      0 2px 4px 0 rgba(232, 237, 250, 0.5);
    border-radius: 6px;
    transform: all 400ms;
  }
}
.food_form {
  border: 1px solid #eaeefb;
  padding: 10px 10px 0;
  border-radius: 6px;
}
.width_100 {
  width: 100%;
}
.margin_left_110 {
  margin-left: 110px;
}
.avatar_upload_icon {
  border: 1px dashed #ccc;
  .wh(120px,120px);
  border-radius: 3px;
  line-height: 120px;
}
.showCategory {
  height: 185px;
}
.add_category {
  background: #f9fafc;
  padding: 10px 30px 10px 10px;
  border: 1px solid #eaeefb;
  border-top: none;
}
</style>

