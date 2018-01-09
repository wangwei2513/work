<template>
  <div class="fillcontain">
    <head-top></head-top>
    <el-row class="margin_t_20">
      <el-col :span="12" :offset="4">
        <el-form 
          :model="formData" 
          :rules="rules" 
          ref="formData" 
          label-width="140px" 
          class="form-demo-class">
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-autocomplete
             v-model="formData.address" 
             :fetch-suggestions="querySearchAsync"
             placeholder="请输入地址"
             @select="addressSelect"
             style="width:100%"
             class="autocomplete">
            </el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.number="formData.phone" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="店铺简介" prop="description">
            <el-input v-model="formData.description"></el-input>
          </el-form-item>
          <el-form-item label="店铺标语" prop="info">
            <el-input v-model="formData.info"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类">
            <el-cascader
             :options="categoryOptions" 
             v-model="selectedCategory"
             change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="店铺特点" class="white-space">
            <span>品牌保证</span>
            <el-switch v-model="formData.is_premium" on-text="" off-text=""></el-switch>
            <span>蜂鸟专送</span>
            <el-switch v-model="formData.delivery_mode" on-text="" off-text=""></el-switch>
            <span>新店开张</span>
            <el-switch v-model="formData.new" on-text="" off-text=""></el-switch>
          </el-form-item>
          <el-form-item class="white-space">
            <span>外卖保</span>
            <el-switch v-model="formData.insure" on-text="" off-text=""></el-switch>
            <span>准时达</span>
            <el-switch v-model="formData.onTime" on-text="" off-text=""></el-switch>
            <span>开发票</span>
            <el-switch v-model="formData.invoice" on-text="" off-text=""></el-switch>
          </el-form-item>
          <el-form-item label="配送费" prop="delivery_fee">
            <el-input-number v-model="formData.delivery_fee" :min="3" :max="6"></el-input-number>
          </el-form-item>
          <el-form-item label="起送价" prop="mininum_order_count">
            <el-input-number v-model="formData.mininum_order_count" :min="20" :max="2000"></el-input-number>
          </el-form-item>
          <el-form-item label="营业时间" class="white-space">
            <el-time-select
             v-model="formData.startTime" 
             placeholder="起始时间"
             :picker-options="{
               start:'08:00',
               step:'00:15',
               end:'22:00'
             }">
            </el-time-select>
            <el-time-select
             v-model="formData.endTime" 
             placeholder="终止时间"
             :picker-options="{
               start:'08:00',
               step:'00:15',
               end:'22:00',
               minTime:formData.startTime
             }">
            </el-time-select>
          </el-form-item>

          <el-form-item label="上传店铺头像">
            <el-upload
             :action="baseUrl+'/avatar/shop'"
             class="avatar-class"
             :show-file-list="false"
             :on-success="handleShopAvatarSuccess"
             :before-upload="beforeUpload">
             <img v-if="formData.shop_imagePath" :src="baseImgPath + formData.shop_imagePath" class="avatar">
             <i v-else class="el-icon-plus "></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传营业执照">
            <el-upload
             :action="baseUrl+'/avatar/shop'"
             class="avatar-class"
             :show-file-list="false"
             :on-success="handleBusinessAvatarSuccess"
             :before-upload="beforeUpload">
             <img v-if="formData.business_imagePath" :src="baseImgPath + formData.business_imagePath" class="avatar">
             <i v-else class="el-icon-plus "></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传餐饮服务许可证">
            <el-upload
             :action="baseUrl+'/avatar/shop'"
             class="avatar-class"
             :show-file-list="false"
             :on-success="handleServiceAvatarSuccess"
             :before-upload="beforeUpload">
             <img v-if="formData.service_imagePath" :src="baseImgPath + formData.service_imagePath" class="avatar">
             <i v-else class="el-icon-plus "></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="优惠活动">
            <el-select
             v-model="activityValue" 
             placeholder="activityValue"
             @change="selectActivity">
              <el-option
               v-for="item in options" 
               :key="item.value"
               :label="item.label"
               :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-table
           :data="activities"
           align="center"
           :row-class-name="tableRowClassName">
            <el-table-column
             label="活动标题"
             prop="active_title"
             align="center"
             width="120">
            </el-table-column>
            <el-table-column
             label="活动名称"
             prop="name"
             align="center"
             width="120">
            </el-table-column>
            <el-table-column
             label="活动详情"
             prop="description"
             align="center"
             >
            </el-table-column>
            <el-table-column
             label="操作"
             align="center"
             width="120">
             <template slot-scope="scope">
               <el-button
                type="danger"
                size="mini"
                @click="handleDelete(scope.$index)">
                删除
               </el-button>
             </template>
            </el-table-column>
          </el-table>
          <el-form-item class="button-submit">
            <el-button
             type="primary"
             @click="submitForm('formData')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { baseUrl, baseImgPath } from "../config/env";
import { getCity, getCategories, searchPlace, addShop } from "../api/getData";
import Mock from "mockjs";
export default {
  data() {
    return {
      city: {},
      formData: {
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        description: "",
        info: "",
        delivery_fee: "",
        mininum_order_count: "",
        is_premium: true,
        delivery_mode: true,
        new: true,
        insure: true,
        onTime: true,
        invoice: true,
        startTime: "",
        endTime: "",
        shop_imagePath: "",
        business_imagePath: "",
        service_imagePath: ""
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名", trigger: "blur" }],
        address: [{ required: true, message: "请输入店铺地址", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入店铺名" },
          { type: "number", message: "电话号码必须是数字" }
        ]
      },
      options: [
        {
          value: "满减大优惠",
          label: "满减大优惠"
        },
        {
          value: "优惠大酬宾",
          label: "优惠大酬宾"
        },
        {
          value: "新用户立减",
          label: "新用户立减"
        },
        {
          value: "进店领卷",
          label: "进店领卷"
        }
      ],
      activityValue: "满减大优惠",
      activities: [
        {
          active_title: "减",
          name: "满减优惠",
          description: "满30减5，满60减15"
        }
      ],
      baseUrl,
      baseImgPath,
      categoryOptions: [],
      selectedCategory: ["快餐便当", "简餐"]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.mockData();
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await getCity();
        const categories = await getCategories();
        console.log(categories.data);
        categories.data.forEach(item => {
          const addNew = {
            value: item.value,
            label: item.value,
            children: []
          };
          item.subCategory.forEach((subItem, index) => {
            if (index === 0) {
              return;
            } else {
              addNew.children.push({
                value: subItem.value,
                label: subItem.value
              });
            }
          });
          this.categoryOptions.push(addNew);
        });
        console.log(this.categoryOptions);
      } catch (error) {
        console.log(error);
      }
    },
    async querySearchAsync(queryStr, cb) {
      if (queryStr) {
        try {
          const cityList = await searchPlace(this.city.id, queryStr);
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
    addressSelect(address) {
      this.formData.latitude = address.latitude;
      this.formData.longitude = address.longitude;
      console.log(this.formData.latitude, this.formData.longitude);
    },
    handleShopAvatarSuccess(res, file) {
      if (res.status === 1) {
        this.formData.shop_imagePath = res.image_path;
      } else {
        console.log("上传图片失败！");
      }
    },
    handleBusinessAvatarSuccess(res, file) {
      if (res.status === 1) {
        this.formData.business_imagePath = res.image_path;
      } else {
        console.log("上传图片失败！");
      }
    },
    handleServiceAvatarSuccess(res, file) {
      if (res.status === 1) {
        this.formData.service_imagePath = res.image_path;
      } else {
        console.log("上传图片失败！");
      }
    },
    beforeUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isRightType) {
        this.$message.error("图片格式之能是JPEG、png");
      }
      const isLt2m = file.size / 1024 / 1024 < 2;
      if (!isLt2m) {
        this.$message.error("图片大不能超过2M！");
      }
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    selectActivity() {
      this.$prompt("请输入活动提示", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null) {
            this.$message({
              type: "info",
              message: "请输入活动详情"
            });
            return;
          }
          let newObj = {};
          switch (this.activityValue) {
            case "满减优惠":
              newObj = {
                active_title: "减",
                name: "满减优惠",
                description: value
              };
              break;
            case "优惠大酬宾":
              newObj = {
                active_title: "特",
                name: "优惠大酬宾",
                description: value
              };
              break;
            case "新用户立减":
              newObj = {
                active_title: "新",
                name: "新用户立减",
                description: value
              };
              break;
            case "进店领卷":
              newObj = {
                active_title: "领",
                name: "进店领卷",
                description: value
              };
              break;
            default:
              break;
          }
          this.activities.push(newObj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    handleDelete(index) {
      this.activities.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          Object.assign(
            this.formData,
            {
              activities: this.activities
            },
            {
              category: this.selectedCategory.join("/")
            }
          );
          try {
            const result = await addShop(this.formData);
            if (result.status === 1) {
              this.$message({
                type: "success",
                message: "添加店铺成功"
              });
              this.formData = {
                name: "",
                address: "",
                latitude: "",
                longitude: "",
                description: "",
                phone: "",
                info: "",
                delivery_fee: "",
                mininum_order_count: "",
                is_premium: true,
                delivery_mode: true,
                new: true,
                insure: true,
                onTime: true,
                invoice: true,
                startTime: "",
                endTime: "",
                shop_imagePath: "",
                business_imagePath: "",
                service_imagePath: ""
              };
              this.selectedCategory = ["快餐便当", "简餐"];
              this.activities = [
                {
                  active_title: "减",
                  name: "满减优惠",
                  description: "满30减5，满60减15"
                }
              ];
            } else {
              this.$message({
                type: "error",
                message: result.message
              });
            }
          } catch (error) {
            console.log("添加店铺失败", error);
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
          return false;
        }
      });
    },
    mockData() {
      Mock.mock("/users/getCity", "get", {
        id: 1,
        name: "深圳"
      });
      Mock.mock("/users/getCategories", "get", {
        data: [
          {
            value: "甜品0",
            subCategory: [
              {
                value: "奶茶"
              },
              {
                value: "咖啡"
              },
              {
                value: "可乐"
              },
              {
                value: "雪碧"
              }
            ]
          },
          {
            value: "甜品1",
            subCategory: [
              {
                value: "奶茶"
              },
              {
                value: "咖啡"
              },
              {
                value: "可乐"
              },
              {
                value: "雪碧"
              }
            ]
          },
          {
            value: "甜品2",
            subCategory: [
              {
                value: "奶茶"
              },
              {
                value: "咖啡"
              },
              {
                value: "可乐"
              },
              {
                value: "雪碧"
              }
            ]
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.margin_t_20 {
  margin-top: 20px;
}
.avatar-class {
  width: 120px;
  height: 120px;
  text-align: center;
  font-size: 24px;
  line-height: 120px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  color: #ccc;
}
</style>

