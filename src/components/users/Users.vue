<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->

    <el-card>
      <el-row :gutter="10">
        <el-col :span="7"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-button @click="getUserList" icon="el-icon-search"></el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="queryInfo.userList" border stripe style="width: 100%">
        <el-table-column type="index" label="id" width="60"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="150">
        </el-table-column>
        <el-table-column prop="role_name" label="权限" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>

        <el-table-column prop="create_time" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="140">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
          <!-- 作用域插槽 -->
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <el-tooltip
              class="item"
              effect="light"
              content="分配权限"
              placement="bottom"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户dialog -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%"
>
  <p>用户:&nbsp;  {{userInfo.username}}</p>
  <p>角色: &nbsp; {{userInfo.role_name}}</p>
  <p>选择角色<el-select v-model="selectedRole"  placeholder="请选择">
    <el-option
      v-for="item in rolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select></p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>

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
  </div>
</template>
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
</style>
<script>
export default {
  data () {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9-_])+(\.[a-zA-Z0-9-_)])+/
      if (regEmail.test(value)) {
        return cb()
      }
      return cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regEmail = /^[0-9]{11}$/
      if (regEmail.test(value)) {
        return cb()
      }
      return cb(new Error('请输入合法的手机号'))
    }
    return {
      selectedRole: [],
      rolesList: [],
      userInfo: {},
      setRoleDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
        total: 0,
        userList: [],
        currentPage: 1
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        email: '',
        mobile: '',
        username: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在3-10之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { min: 3, max: 18, message: '邮箱的长度在3-18之间', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '输入正确的邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入用户电话', trigger: 'blur' },
          { min: 6, max: 16, message: '电话的长度在6-10之间', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '输入正确的电话格式',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    saveRoleInfo: async function () {
      const { data: res } = await this.$http.put('users/' + this.userInfo.id + '/role', { rid: this.selectedRole })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('更新用户角色失败')
      } else {
        this.getUserList()
        this.setRoleDialogVisible = false
        this.$message.success('更新用户角色成功')
      }
    },
    getRolesList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取用户列表错误')
      } else {
        this.rolesList = res.data
        this.$message.success('获取用户列表成功')
      }
    },
    setRole: function (row) {
      this.setRoleDialogVisible = true
      this.userInfo = row
      this.getRolesList()
    },
    getUserList: async function () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败')
      }
      this.queryInfo.userList = res.data.users
      this.queryInfo.total = res.data.total
    },
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    userStateChanged: async function (row) {
      const { data: res } = await this.$http.put(
        'users/' + row.id + '/state/' + row.mg_state
      )
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state // 将自己取反
        return this.$message.error('修改状态失败')
      } else {
        return this.$message.success('修改状态成功')
      }
    },
    addUser: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          var { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败')
          } else {
            this.addDialogVisible = false
            this.getUserList()
            return this.$message.success('添加成功')
          }
        }
      })
    },
    editUser: function () {
      this.editDialogVisible = false
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put('users/' + this.editForm.id, this.editForm)
          if (res.meta.status !== 200) {
            this.$message.error('修改失败')
          } else {
            this.$message.success('修改成功')
            this.getUserList()
          }
        } else {

        }
      })
    },
    showEditDialog: async function (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      } else {
        this.editForm.id = id
        this.editForm.email = res.data.email
        this.editForm.username = res.data.username
        this.editForm.mobile = res.data.mobile

        return this.$message.success('查询用户成功')
      }
    },
    removeUserById: async function (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已经取消了删除')
      } else {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) {
          this.$message.success('删除用户' + id + '失败')
        } else {
          this.$message.success('已经成功删除用户' + id)
          this.getUserList()
        }
      }
    }
  },
  watch: {
    addDialogVisible: function (n) {
      if (!n) {
        this.$refs.addFormRef.resetFields()
      }
    },
    editDialogVisible: function (n) {
      if (!n) {
        this.$refs.editFormRef.resetFields()
      }
    },
    setRoleDialogVisible: function (n) {
      if (!n) {
        this.selectedRole = []
      }
    }
  }
}
</script>
