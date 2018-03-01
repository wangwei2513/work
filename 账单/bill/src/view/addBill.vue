<template>
<div class="addBill">
  <el-form :model="billForm" :rules="rules" label-width="100px" ref="billForm" >
    <el-row>
      <el-col :span="12" :offset="3">
        <el-form-item label="标题" prop="title">
          <el-input v-model="billForm.title" placeholder="用什么（支付宝、微信、银行卡）花的..."></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="3">
        <el-form-item label="备注" prop="message">
          <el-input v-model="billForm.message" placeholder="干了什么..."></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" :offset="3">
        <el-form-item label="金额" prop="number">
          <el-input-number v-model="billForm.number" placeholder="花了多少钱..."></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" :offset="3">
        <el-form-item label="总金额" prop="totle">
          <el-input-number v-model="billForm.totle" placeholder="还剩多少钱..."></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" :offset="3">
        <el-form-item label="日期时间" prop="dateTime">
          <el-input v-model="billForm.dateTime" placeholder="什么时候花的..."></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <el-row>
    <el-col :span="2" :offset="10">
      <el-button type="primary" @click="submit">提交</el-button>
    </el-col>
  </el-row>
</div>
  
</template>

<script>
import { addBill, updateBill, getAll } from "../api/api";
export default {
  data() {
    return {
      billForm: {
        _id: "",
        title: "",
        message: "",
        mode: "",
        number: "",
        totle: "",
        dateTime: "",
        dateLabel: new Date().getFullYear() + "" + (new Date().getMonth() + 1)
      },
      rules: {
        title: [{ required: true, message: "请输入标题（用什么花的）", trigger: "blur" }],
        message: [{ required: true, message: "请输入备注（干了什么）", trigger: "blur" }],
        dateTime: [{ required: true, message: "请输入日期时间（0000/00/00 00:00:00）", trigger: "blur" }],
        number: [
          { required: true, message: "请输入本次账单花费" },
          { type: "number", message: "必须是数字" }
        ],
        totle: [
          { required: true, message: "请输入余额" },
          { type: "number", message: "必须是数字" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["billForm"].validate(async valid => {
        if (valid) {
          try {
            let res;
            console.log(this.billForm._id);
            if (this.billForm._id) {
              res = await updateBill({ _id: this.billForm._id }, this.billForm);
            } else {
              console.log(this.billForm)
              res = await addBill(this.billForm);
            }
            console.log(res.success);
            if (res.success) {
              this.$message({
                type: "success",
                message: "添加账单成功！"
              });
            } else {
              this.$message({
                type: "error",
                message: "添加账单失败！"
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          this.$notify.error({
            type: "错误",
            message: "请检查输入是否正确！",
            offset: 100
          });
        }
      });
    }
  }
};
</script>

<style>
.addBill {
  padding: 2em;
}
</style>
