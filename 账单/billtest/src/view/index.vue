<template>
  <div>
    <el-col :span="20" :offset="2">
      <el-row :gutter="10">
        <el-col :span="4" v-for="item in items" :key="item.id" :xs="24">
          <div class="bill">
            {{item.text}}
          </div>
        </el-col>
      </el-row>
    </el-col>
    
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          text: "a"
        },
        {
          text: "b"
        },
        {
          text: "c"
        },{
          text: "a"
        },
        {
          text: "b"
        },
        {
          text: "c"
        },
        {
          text: "b"
        },
        {
          text: "c"
        }
      ]
    };
  }
};
</script>

<style>
.bill{
  height: 14em;
  background: #ccc;
  border-radius: .5em;
  /* margin: 0 10px; */
}
</style>
