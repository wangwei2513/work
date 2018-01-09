<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-row>
      <el-col :span="14" :offset="4">
        <header>选择食品种类</header>
        <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form">
          <el-row>
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
              <el-button type="primary" @click="submitCategoryForm('categoryForm')">
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
        <header>添加食品</header>
        <el-form :model="foodForm">
          <el-form-item label="食品名称">
            <el-input v-model="foodForm.name" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="食品活动">
            <el-input v-model="foodForm.activity" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="食品详情">
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
          <el-row v-if="foodSpces == one">
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
        <el-dialog title="添加规格" v-model="dialogFormVisible">
          <el-form :model="spcesForm" :rules="spcesFormRules">
            <el-form-item label="规格">
              <el-input v-model="spcesForm.spces" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="包装费">
              <el-input v-model="spcesForm.packing_fee" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="spcesForm.price" placeholder=""></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog_footer">
            <el-button type="danger" @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addSpces">确定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {getCategories,addCategory,addFood} from '../api/getData'
import {baseUrl,baseImgPath} from '../config/env'
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
        spces: [],
        foodImagePath: "",
        attributes: []
      },
      restaurant_id: 0,
      foodRules: {
        name: [{ required: "true", message: "请输入名称", trigger: "blur" }]//
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
        spces:'',
        paking_fee:'',
        price:''
      },
      spcesFormRuler: {
        spces: [{ required: true, message: "请输入规格", trigger: "blur" }]
      }
    };
  },
  components: {
    headTop
  },
  created() {
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
        const result = await getCategories(this.restaurant_id)
        if (result.status === 1) {
          result.category_list.map((index,item) => {
            item.value = index,
            item.label = item.name
          })
          this.categoryForm.categoryList = result.category_list;
        } else {
          console.log(result)
        }
      } catch (error) {
        console.log('获取category失败！',error)
      }
    },
    addCategoryFun(){
      this.showAddCategory = !this.showAddCategory
    },
    addCategoryForm(categoryForm){
      this.$refs[categoryForm].validate(async valid => {
        if (valid) {
          const params = {
            name:this.categoryForm.name,
            description:this.categoryForm.description,
            restaurant_id:this.restaurant_id
          }
          try {
            const result = await addCategory(params)
            if (result.status === 1) {
              this.initData()
              this.categoryForm.name = ''
              this.categoryForm.description = ''
              this.showAddCategory = false
              this.$message({
                type:'success',
                message:'添加成功'
              })
            } else {
              console.log(result)
            }
          } catch (error) {
            console.log('添加失败',error)
          }
        } else {
          this.$notify.error({
            title:'错误',
            message:'请检查输入是否正确',
            offset:100
          })
        }
      })
    },
    uploadImg(res,file){
      if (res.status === 1) {
        this.foodForm.foodImagePath = res.image_path
      } else {
        this.$message.error('上传图片失败！')
      }
    },
    beforeUpload(file){
      const isRightType = file.type === 'images/jpeg'||file.type === 'images/png'
      const isL2M = file.size/1024/1024 < 2
      if (!isRightType) {
        this.$message.error('图片格式必须是jpg')
      }
      if (!isL2M) {
        this.$message.error('图片大小必须小于2M')
      }
      return isRightType && isL2M
    },
    addSpces(){
      this.foodForm.spces.push(...spcesForm)
      this.spcesForm.spces = ''
      this.spcesForm.packing_fee = 0
      this.spcesForm.price = 20
      this.dialogFormVisible = false
    },
    handelDelete(index){
      this.foodForm.spces.splice(index,1)
    },
    tableRowClassName(row,index) {
      if (index === 1) {
        return 'info-row'
      } else if(index === 3) {
        return 'positive-row'
      }
    },
    addFood(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            ...foodForm,
            category_id:this.categoryForm.category_id,
            restaurant_id:restaurant_id
          }
          try {
            const result = await addFood(params)
            if (result.status === 1) {
              this.$message({
                type:'success',
                message:'添加成功'
              })
            } else {
              this.$message({
                type:'error',
                message:result.message
              })
            } 
          } catch (error) {
            console.log('添加失败！',error)
          }
        } else {
          this.$notify.error({
            title:'错误',
            message:'请检查如数是否正确',
            offset:100
          })
          return false
        }
      })
    }
  } 
};
</script>

<style>

</style>
