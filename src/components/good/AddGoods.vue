<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps :active="Number.parseInt(activeIndex)" align-center>
        <el-step title="基本信息"> </el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          :before-leave="checkOutTag"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addForm.goods_price"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
                type="number"
              ></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                :clearable="true"
                size="medium"
                :props="cateListProps"
                v-model="seletedCateList"
                :options="cateList"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in manyTabData"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item"
                  :key="i"
                  v-for="(item, i) in item.attr_vals"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in onlyTabData"
            >
            <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              show-file-list
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" style="min-height:300px"></quill-editor>
            <el-button type="primary" class="add-good" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="预览图片"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewImgUrl" width="100%" height="100%" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      previewDialogVisible: false,
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      previewImgUrl: '',
      manyTabData: [],
      onlyTabData: [],
      cateListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      cateList: [],
      seletedCateList: [],

      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        goods_picture: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '商品名的长度在1-10之间',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }

        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      activeIndex: '0',
      tabPosition: 'left'
    }
  },
  methods: {
    addGood: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写符合表单的数据！')
        else {
          this.addForm.goods_cat = this.seletedCateList
          const addForm = _.cloneDeep(this.addForm)
          addForm.goods_cat = addForm.goods_cat.join(',')
          // 处理动态参数
          this.manyTabData.forEach(item => {
            const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
            addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          this.onlyTabData.forEach(item => {
            const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
            addForm.attrs.push(newInfo)
          })
          const { data: res } = await this.$http.post('goods', addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加商品失败')
          } else {
            this.manyTabData = []
            this.onlyTabData = []
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
          }
        }
      })
    },
    handleSuccess: function (res) {
      this.addForm.goods_picture.push(res.data.tmp_path)
      console.log(this.addForm)
    },
    handlePreview: function (file) {
      this.previewDialogVisible = true
      this.previewImgUrl = file.response.data.url
    },
    handleRemove: function (file) {
      const fileName = file.response.data.tmp_path
      const index = this.addForm.goods_picture.indexOf(fileName)
      console.log(index)
      this.addForm.goods_picture.splice(index, 1)
      console.log(this.addForm)
    },
    tabClicked: async function () {
      if (this.activeIndex === '1' && this.manyTabData.length === 0) {
        const { data: res } = await this.$http.get(
          `categories/${Number.parseInt(this.cateId)}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        } else {
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals === ''
                ? []
                : (item.attr_vals = item.attr_vals.split(' '))
          })

          this.manyTabData = res.data
          return this.$message.success('获取动态参数列表成功')
        }
      } else if (this.activeIndex === '2' && this.onlyTabData.length === 0) {
        const { data: res } = await this.$http.get(
          `categories/${Number.parseInt(this.cateId)}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        } else {
          this.onlyTabData = res.data
          return this.$message.success('获取静态属性成功')
        }
      }
    },
    checkOutTag: function (activeName, oldActiveName) {
      if (
        activeName !== '0' &&
        this.seletedCateList.length === 0 &&
        oldActiveName === '0'
      ) {
        this.$message.error('未选择商品分类前不能跳转')
        return false
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
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      this.cateList = res.data
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId: function () {
      return this.seletedCateList !== 0
        ? this.seletedCateList[this.seletedCateList.length - 1]
        : null
    }
  }
}
</script>
<style lang="less" scoped>
.add-good{
  margin-top: 10px;
}
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
.el-step {
  margin: 15px 0;
}
.el-tabs {
  margin-top: 15px;
}

</style>
