<template>
  <div>
    <!--    点击添加一个对话框-->
    <el-button title="primary" @click="show" icon="el-icon-plus" style="margin: 10px 0">添加</el-button>
    <!--data是将来要展示的数据
    data展示数据以1列进行展示的
    prop 对应列内容的字段
    type=index 给每一列序号-->
    <el-table style="width: 100%" border :data="list">
      <el-table-column prop="date" label="序号" width="180" align="center" type="index"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="180"></el-table-column>
      <el-table-column prop="address" label="品牌logo">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="changeTrade(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletemark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      @current-change="handelCurrentChange"
      :current-page="page"
      :pagesizes=limit
      :page-count="7"
      :pagesize="[3,5,10]"
      layout="prev, pager, next, jumper,sizes,total"
      :total=total
      style="margin-top: 20px;text-align: center"
      @size-change="handleSizeChange">
    </el-pagination>
    <!--    对话框:visible.sync控制对话框显示和隐藏-->
    <el-dialog :title="trades.id ? '修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!--      展示的表单元素-->
      <!--      :model手机表单信息 数据收集到这个对象上-->
      <el-form :model="trades" :rules="rules">
        <el-form-item label="品牌名称：" label-width="100px" prop="tmName" ref="rulesInfo">
          <el-input autocomplete="off" v-model="trades.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo：" label-width="100px" prop="logoUrl">
          <!--        上传pic-->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="trades.logoUrl" :src="trades.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addontrademark()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademarkss",
  data() {
    return {
      //页数 因为需要传递一个默认的参数
      page: 1,
      //每页展示的条数
      limit: 6,
      total: 0,
      list: [],
      //对话框的显示和隐藏
      dialogFormVisible: false,
      //添加的时候：收集品牌的信息
      trades: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          {require: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, max: 10, message: '长度在2到10个字符之间', trigger: 'blur'}
        ],
        logoUrl: [
          {require: true, message: '请上传品牌logo'},
        ]
      }
    }
  },
  methods: {
    async getPageList() {
      //获取品牌列表的接口
      const {page, limit} = this;
      let res = await this.$API.trademark.trademarkREQ(page, limit);
      console.log(res);
      if (res.code === 200) {
        this.total = res.data.total
        this.list = res.data.records
      }
    },
    handelCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    //当分页器需要展示数据的时候会触发
    handleSizeChange(limit) {
      //整理参数
      this.limit = limit
      this.getPageList();
    },
    //展示对话框
    show() {
      this.dialogFormVisible = true
      this.trades = {tmName: '', logoUrl: ''}
    },
    //修改品牌 row就是当前用户选中的品牌的信息
    changeTrade(row) {
      this.dialogFormVisible = true;
      this.trades = {...row}
    },
    //上传图片
    handleAvatarSuccess(res, file) {
      this.trades.logoUrl = res.data
    },
    //添加或者修改
    async addontrademark() {
      //表单验证通过在上传执行
      this.$refs.rulesInfo.validate(async (success) => {
        //符合条件才会执行接下来的
        if (success) {
          this.dialogFormVisible = false
          //发请求 有可能是添加或者修改
          let res = await this.$API.trademark.addtrademarkREQ(this.trades)
          console.log(res);
          if (res.code === 200) {
            //弹出提示信息 饿了吗ui自带
            this.$message({
              type: 'success',
              message: this.trades.id ? "修改品牌成功" : '添加品牌成功'
            });
            //添加品牌停留在第一页，如果是修改停留在当前页
            this.getPageList(this.trades.id ? this.page : 1);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    //删除
    deletemark(row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await this.$API.trademark.deleteREQ(row.id)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  },
  mounted() {
    //获取列表数据的方法
    this.getPageList();
  }
}
</script>

<style scoped>
img {
  width: 160px;
  height: 80px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
