<template>
  <div>
  <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/categories' }">商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
<el-row>
  <el-col>
    <el-button type="primary" @click="showAddGoodDialog">添加分类</el-button>
  </el-col>
</el-row>
<tree-table
ref="table"
:expand-type='false'
:selection-type="false"
:show-index="true"
:border = "true"
      sum-text="sum"
   index-text="序号"
  :data = 'goodsList'
  :columns='columnsConfig'
>
<template slot="isok" slot-scope="scope">
<i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color: lightgreen"></i>
<i class="el-icon-error" v-else type="error" style="color: red"></i>
</template>
<template slot="order" slot-scope="scope">
<el-tag v-if="scope.row.cat_level===0">一级</el-tag>
<el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
<el-tag v-else-if="scope.row.cat_level===2"  type="warning">三级</el-tag>
</template>
<template slot="opt" slot-scope="scope" >
<el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
<el-button type="danger"  size="mini" icon="el-icon-delete" @click="deleteGood(scope.row.cat_id)">删除</el-button>
</template>
</tree-table>

    </el-card>
      <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.currentPage"
      :page-sizes="[1, 5, 10, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"
    >
    </el-pagination>
    <el-dialog
      title="修改角色"
      :visible.sync="addGoodDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addGoodForm"
        :rules="addGoodFormRules"
        ref="addGoodFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addGoodForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
         <el-cascader
         :clearable='true'
         size="medium"
         :props='parentListProps'
    v-model="seletedParentList"
    :options="parentList"
    @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGoodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGood">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑分类名称"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
        total: 0,
        currentPage: 1
      },
      goodsList: [],
      parentList: [],
      seletedParentList: [],
      parentListProps: {
        checkStrictly: true,
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      columnsConfig: [
        {
          label: '商品名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        }, {
          label: '权限等级',
          type: 'template',
          template: 'order'
        }, {
          label: '操作',
          type: 'template',
          template: 'opt'
        }],
      addGoodDialogVisible: false,
      editDialogVisible: false,
      addGoodForm: {
        cat_name: '',
        cat_pid: 0, // 确定哪一个分类
        cat_level: 0
      },
      addGoodFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '分类名的长度在1-10之间',
            trigger: 'blur'
          }
        ]
      },
      editForm: {
        cat_name: '',
        cat_id: 0
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '分类名的长度在1-10之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleChange: function (v) {
      if (this.seletedParentList.length > 0) {
        this.addGoodForm.cat_pid = this.seletedParentList[this.seletedParentList.length - 1]
        this.addGoodForm.cat_level = this.seletedParentList.length - 1
      } else {
        this.addGoodForm.cat_pid = 0
        this.addGoodForm.cat_level = 0
      }
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
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类数据获取失败')
      }
      this.goodsList = res.data.result
      this.queryInfo.total = res.data.total
    },
    showEditDialog: function (row) {
      this.editDialogVisible = true
      this.editForm.cat_name = row.cat_name
      this.editForm.id = row.cat_id
    },
    showAddGoodDialog: function () {
      this.addGoodDialogVisible = true
      this.getParentCateList()
    },
    getParentCateList: async function () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentList = res.data
    },
    addGood: function () {
      this.$refs.addGoodFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('categories', this.addGoodForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加商品分类失败')
          } else {
            this.getGoodsList()
            this.addGoodDialogVisible = false
            this.$message.success('添加商品分类成功')
          }
        } else {

        }
      })
    },
    editGood: async function () {
      this.editDialogVisible = false
      const { data: res } = await this.$http.put('categories/' + this.editForm.id, {
        cat_name: this.editForm.cat_name
      })
      if (res.meta.status !== 200) {
        this.$message.error('修改失败')
      } else {
        this.editDialogVisible = false
        this.getGoodsList()
        this.$message.success('修改成功')
      }
    },
    deleteGood: async function (id) {
      const { data: res } = await this.$http.delete('categories/' + id)

      if (res.meta.status !== 200) {
        this.$message.error('删除失败')
      } else {
        this.getGoodsList()
        this.$message.success('删除成功')
      }
    }

  },
  created () {
    this.getGoodsList()
  },
  watch: {
    addGoodDialogVisible: function (n) {
      if (!n) {
        this.addGoodForm = {
          cat_name: '',
          cat_pid: 0,
          cat_level: 0
        }
        this.seletedParentList = []
      }
    },
    editDialogVisible: function (n) {
      if (!n) {
        this.addGoodForm = {
          cat_name: ''

        }
      }
    }
  }
}
</script>
<style lang='less' scoped>
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
.el-cascader{
  width: 100%;
}

</style>
