<template>
  <div>
    <el-card style="margin: 20px 0">
      <category @getCategoryId="getCategoryId" :isShow="isShow"/>
    </el-card>
    <el-card>
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id"  @click="isShow=false">添加属性</el-button>
        <!--      表格展示-->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" align="center" label="序号" width="150"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="250"></el-table-column>
          <el-table-column
            prop="prop"
            label="属性值列表"
            width="900">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="item in row.attrValueList" :key="item.id" style="margin: 0 7px">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="width">
            <template slot-scope="{row,$index}">
              <el-button type="waring" icon="el-icon-edit" size="mini" @click="isShow=false">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--      添加属性的结构-->
      <div v-show="!isShow">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>
        <el-table style="width: 100%" border>
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="100">
          </el-table-column>
          prop="prop"
          <el-table-column
            prop="prop"
            label="属性值名称"
            width="800">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShow=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import category from "@/components/common/category";

export default {
  name: "attr",
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      //接收传来的商品数据
      attrList: [],
      isShow: true,
    }
  },
  components: {
    category
  },
  methods: {
    getCategoryId({categoryId, level}) {
      //区分三级分类的id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId
        //发送请求获取 对应的数据
        this.getAttrList()
      }
    },
    async getAttrList() {
      //传入三级分类的id
      const {category1Id, category2Id, category3Id} = this
      let res = await this.$API.attr.getAttrListREQ(category1Id, category2Id, category3Id)
      if (res.code === 200) {
        this.attrList = res.data
      }
    }
  }

}
</script>

<style scoped>

</style>
