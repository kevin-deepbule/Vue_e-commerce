<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrdersList"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="500px"></el-table-column>
        <el-table-column prop="order_price"  label="价格" width="100px" align="center"></el-table-column>
        <el-table-column label="是否已支付" width="150px" align="center"
          ><template slot-scope="scope"
            ><el-tag type="success" v-if="scope.row.order_pay==='1'">已付款</el-tag><el-tag type="danger" v-else>未付款</el-tag></template
        ></el-table-column>
        <el-table-column prop="is_send" label="是否已发货"  align="center" width="100px"></el-table-column>
        <el-table-column label="下单时间" align="center"
          ><template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template></el-table-column
        >
        <el-table-column label="操作" align="center"
          ><template slot-scope="">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog"
            ></el-button> </template
        ></el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"
    >
    </el-pagination>
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="50%"
    >
      <el-form
        :model="editAddressForm"
        :rules="editAddressFormRules"
        ref="editAddressFormRef"
        label-width="100px"
      >

        <el-form-item label="省市区/县" >
         <el-cascader
         :clearable='true'
         size="medium"
         :props='treeProps'
    v-model="editAddressForm.address1"
    :options="cityData"
    ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress">确 定</el-button>
      </span>
    </el-dialog>
     <el-dialog
      title="物流进度"
      :visible.sync="ProgressDialogVisible"
      width="50%"
    >
<el-timeline >
    <el-timeline-item
      v-for="(activity, index) in pregressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'
export default {
  data () {
    return {
      cityData,
      ProgressDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'label'
      },
      editAddressDialogVisible: false,
      editAddressForm: {
        address1: [],
        address2: ''
      },
      editAddressFormRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
        total: 0,
        currentPage: 1
      },
      ordersList: [],
      pregressInfo: [{
        time: '2018-05-10 09:30:55',
        context: '已签收，感谢使用顺风，期待再次为您服务'
      },
      {
        time: '2018-05-08 12:30:55',
        context: '[北京市]海淀区裕兴小区派件员 顺风速运 2345 为您派件'
      },
      {
        time: '2018-05-6 09:30:55',
        context: '快件到达 [北京市]'
      },
      {
        time: '2018-05-6 00:30:55',
        context: '[上海市分域小区揽件点] 快件已发出'
      }
      ]
    }
  },
  methods: {
    showProgressDialog: async function () {
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      this.ProgressDialogVisible = true
      // if (res.meta.status !== 200) {
      //   this.$message.error('获取物流进度失败')
      // } else {
      //   this.$message.success('获取物流进度成功')
      //   this.pregressInfo = res.data
      // }
    },

    editAddress: function () {
      this.editAddressDialogVisible = false
      this.$message.success('修改地址成功')
    },
    showDialog: function () {
      this.editAddressDialogVisible = true
    },
    getOrdersList: async function () {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据获取失败')
      }
      this.ordersList = res.data.goods
      this.queryInfo.total = res.data.total
      console.log(this.ordersList)
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    }
  },
  created () {
    this.getOrdersList()
  },
  watch: {
    editAddressDialogVisible: function (n) {
      if (!n) {
        this.$refs.editAddressFormRef.resetFields()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add-Order {
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
