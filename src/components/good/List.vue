<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row class="cat_opt">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="90px"
        ></el-table-column>
        <el-table-column
          label="商品重量(kg)"
          prop="goods_weight"
          width="90px"
        ></el-table-column>
        <el-table-column label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.currentPage"
      :page-sizes="[ 5, 10, 20,50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      input: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        total: 0,
        currentPage: 1
      },
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: '请输入' + this.titleText + '名',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: this.titleText + '名的长度在3-10之间',
            trigger: 'blur'
          }
        ]
      },
      paramsDialogVisible: false,
      editParamsDialogVisible: false,
      goodsList: [],
      total: 0
    }
  },
  methods: {
    deleteGoods: async function (row) {
      const confirm = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(n => n)
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(
          'goods/' + row.goods_id
        )
        if (res.meta.status !== 200) {
          return this.$message.error('商品删除失败')
        } else {
          this.getGoodsList()
          return this.$message.success('商品删除成功')
        }
      } else {
        return this.$message.info('已取消商品删除')
      }
    },
    goAddpage: function () {
      this.$router.push('/goods/add')
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    getGoodsList: async function () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品列表数据获取失败')
      }
      this.goodsList = res.data.goods
      this.queryInfo.total = res.data.total
      console.log(this.goodsList)
    }
  },
  created () {
    this.getGoodsList()
  },
  computed: {},
  watch: {}
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  font: 18px '华文行楷';
}
.el-card {
  margin-top: 40px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table .el-table-column {
  text-align: center !important;
}
.el-table {
  padding: 10px;
  margin-top: 10px;
}

.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
.el-pagination {
  margin: 10px auto;
  display: flex;
  align-items:center;
  justify-content:center;
}
</style>
