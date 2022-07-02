<template>
  <div>
    <!--    formInline行内表单 三级联动-->
    <el-form :inline="true" class="demo-form-inline" :model="cform">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cform.category1id" @change="handler1">
          <el-option :label="item1.name"
                     :value="item1.id"
                     v-for="item1 in list1"
                     :key="item1.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cform.category2id" @change="handler2">
          <el-option v-for="item2 in list2"
                     :label="item2.name"
                     :value="item2.id"
                     :key="item2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cform.category3id" @change="handler3">
          <el-option :label="item3.name"
                     :value="item3.id"
                     v-for="item3 in list3"
                     :key="item3.id"
          ></el-option>
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: "category",
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cform: {
        category1id: '',
        category2id: '',
        category3id: ''
      }

    }
  },
  methods: {
    async getCategory1() {
      let res = await this.$API.attr.caregory1REQ()
      if (res.code === 200) {
        this.list1 = res.data
      }
    },
    //一级分类的事件回调
    async handler1() {
      this.list2 = []
      this.list3 = []
      this.cform.category2id = ''
      this.cform.category3id = ''
      const {category1id} = this.cform
      this.$emit('getCategoryId',{ categoryId: category1id,level:1})
      //通过一级分类的id获取二级分类的数据
      let res = await this.$API.attr.caregory2REQ(category1id)
      if (res.code === 200) {
        this.list2 = res.data
      }
    },
    //监听二级分类的变化 的回调
    async handler2() {
      this.list3 = []
      this.cform.category3id = ''
      const {category2id} = this.cform
      this.$emit('getCategoryId',{ categoryId: category2id,level:2})
      let res = await this.$API.attr.caregory3REQ(category2id)
      console.log(res);
      if (res.code === 200) {
        this.list3 = res.data
      }
    },
    //三级分类的事件回调
    handler3() {
      const {category3id} = this.cform
      this.$emit('getCategoryId',{ categoryId: category3id,level:3})
    }
  },
  mounted() {
    //分类的请求
    this.getCategory1()

  }
}
</script>

<style scoped>

</style>
