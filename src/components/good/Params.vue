<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意，只允许为三级商品设置三级参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span
            >选择商品分类：<el-cascader
              :clearable="true"
              size="medium"
              :props="cateListProps"
              v-model="seletedCateList"
              :options="cateList"
              @change="handleCateChange"
            ></el-cascader
          ></span>
        </el-col>
        <el-col> </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="first"
          ><el-button
            type="primary"
            size="mini"
            :disabled="seletedCateList.length !== 3"
            @click="showParamsDialog"
            >添加参数</el-button
          >
          <el-table :data="firstTableData" border stripe width="100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  :key="item.attr_id"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  @close="tagDelete(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope"
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                ></template
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second"
          ><el-button
            type="primary"
            size="mini"
            :disabled="seletedCateList.length !== 3"
            @click="paramsDialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="secondTableData" border stripe width="100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  type="primary"
                  :key="item.attr_id"
                  v-for="(item,i) in scope.row.attr_vals"
                  closable
                  @close="tagDelete(i,scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope"
                ><el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditParamsDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row)"
                  >删除</el-button
                ></template
              >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="paramsDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addFormRef"
        show-message
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editParamsDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
        ref="addFormRef"
        show-message
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入' + this.titleText + '名', trigger: 'blur' },
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
      firstTableData: [],
      secondTableData: [],
      activeName: 'first',
      cateList: [],
      seletedCateList: [],
      cateListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }

    }
  },
  methods: {
    handleInputConfirm: async function (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
      } else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        const { data: res } = await this.$http.put('categories/' + this.cateId + '/attributes/' + row.attr_id,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName === 'first' ? 'many' : 'only',
            attr_vals: row.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('增加tag失败')
        } else {
          this.$message.success('增加tag成功')
        }
      }
    },
    showInput: function (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleTabClick: function (tab) {
      this.activeName = tab.name
      this.handleCateChange()
    },
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    },
    handleCateChange: async function () {
      if (this.seletedCateList.length !== 3) {
        return this.$message.info('请选择商品后查看')
      }
      const p = this.activeName === 'first' ? 'many' : 'only'
      const { data: res } = await this.$http.get(
        'categories/' + this.cateId + '/attributes',
        { params: { sel: p } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败')
      } else {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'first') {
          this.firstTableData = res.data
        } else {
          this.secondTableData = res.data
        }
        this.$message.success('获取商品信息成功')
      }
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
    addParam: async function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories/' + this.cateId + '/attributes',
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName === 'first' ? 'many' : 'only'
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('商品参数添加失败')
        } else {
          this.paramsDialogVisible = false
          this.handleCateChange()
          return this.$message.success('商品参数添加成功')
        }
      })
    },
    editParam: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'categories/' + this.cateId + '/attributes/' + this.addForm.attr_id,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName === 'first' ? 'many' : 'only'
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('商品参数修改失败')
        } else {
          this.editParamsDialogVisible = false
          this.handleCateChange()
          return this.$message.success('商品参数修改成功')
        }
      })
    },
    deleteParam: async function (row) {
      const confirm = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(n => n)
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(
          'categories/' + this.cateId + '/attributes/' + row.attr_id
        )
        if (res.meta.status !== 200) {
          return this.$message.error('商品参数删除失败')
        } else {
          this.handleCateChange()
          return this.$message.success('商品参数删除成功')
        }
      } else {
        return this.$message.info('已取消参数删除')
      }
    },
    showParamsDialog: function () {
      this.paramsDialogVisible = true
    },
    showEditParamsDialog: function (row) {
      this.addForm.attr_id = row.attr_id
      this.editParamsDialogVisible = true
    },
    tagDelete: async function (index, row) {
      row.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put('categories/' + this.cateId + '/attributes/' + row.attr_id,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName === 'first' ? 'many' : 'only',
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('删除tag失败')
      } else {
        this.$message.success('删除tag成功')
      }
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId: function () {
      if (this.seletedCateList.length === 3) {
        return this.seletedCateList[this.seletedCateList.length - 1]
      } else return null
    },
    titleText: function () {
      if (this.activeName === 'first') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  watch: {
    paramsDialogVisible: function (n) {
      if (!n) {
        this.addForm = {
          attr_name: ''
        }
      }
    },

    editParamsDialogVisible: function (n) {
      if (!n) {
        this.$refs.addFormRef.resetFields()
      }
    }
  }
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
.input-new-tag{
  width: 120px;
}
</style>
