<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/roles' }">角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button
        id="addRoleBtn"
        type="primary"
        round
        @click="addDialogVisible = true"
        >添加角色</el-button
      >
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand" label="">
          <template slot-scope="scope">
            <el-row
              class="bdbottom vcenter"
              :key="item.id"
              v-for="(item, i) in scope.row.children"
            >
              <el-col :span="5">
                <el-tag  @close="removeRightById(scope.row,item.id)" closable   >{{ item.authName + i }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                class="bdbottom vcenter"
                :key="item2.id" v-for="(item2, index2) in item.children">
                  <el-col :span="6"
                    ><el-tag   @close="removeRightById(scope.row,item2.id)" closable  type="success">{{
                      item2.authName + index2
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning" :key="item3.id" v-for="(item3,index3) in item2.children">
                     {{item3.authName+index3}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称" align="center">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button type="warning" size="mini" icon="el-icon-setting"
              @click="showRoleRules(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
>
  <el-tree
  ref="treeRightRef"
  :data="rightsList"
  show-checkbox
  node-key="id"
  default-expand-all
  :default-checked-keys="defKeys"
  :props="treeProps"
  >
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleRight">确 定</el-button>
  </span>
</el-dialog>
    <el-dialog
      title="添加角色"
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改角色"
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
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      roleId: '',
      defKeys: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      rightsList: [],
      setRightDialogVisible: false,
      rolesList: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名的长度在3-10之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '角色描述的长度在5-20之间',
            trigger: 'blur'
          }
        ]
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名的长度在3-10之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 5,
            max: 20,
            message: '角色描述的长度在5-20之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    setRoleRight: async function () {
      const keys = [...this.$refs.treeRightRef.getCheckedKeys(),
        ...this.$refs.treeRightRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: keys.join(',') })
      if (res.meta.status !== 200) {
        this.$message.error('修改角色权限失败')
      } else {
        this.setRightDialogVisible = false
        this.getRolesList()
        this.$message.success('修改角色权限成功')
      }
      console.log(keys)
    },

    getLeafKeys: function (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },
    showRoleRules: async function (row) {
      const { data: res } = await this.$http.get(
        'rights/' + 'tree'
      )
      if (res.meta.status !== 200) {
        this.$message.error('获取角色权限失败')
      } else {
        this.roleId = row.id
        this.rightsList = res.data
        this.getLeafKeys(row, this.defKeys)
        this.setRightDialogVisible = true

        //  = res.data// 传过来的是个引用
        this.$message.success('获取角色权限成功')
      }
    },
    removeRightById: async function (row, right) {
      const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(h => h)
      if (confirm !== 'confirm') {
        this.$message.info('已取消删除操作')
      } else {
        const { data: res } = await this.$http.delete('roles/' + row.id + 'rights/' + right)
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改角色对应权限失败')
        } else {
          row.children = res.data// 传过来的是个引用
          this.$message.success('修改角色对应权限成功')
        }
      }
    },
    editRole: async function () {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            this.editForm
          )
          if (res.meta.status !== 200) {
            this.$message.error('修改角色失败')
          } else {
            this.editDialogVisible = false
            this.getRolesList()
            this.$message.success('修改角色成功')
          }
        } else {
        }
      })
    },
    deleteRole: async function (id) {
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除角色失败')
      } else {
        this.getRolesList()
        this.$message.success('删除角色成功')
      }
    },
    showRole: async function (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('获取角色失败')
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
        this.$message.success('获取角色成功')
      }
    },
    addRole: function () {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          console.log(res)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败')
          } else {
            this.$message.success('添加角色成功')
            this.getRolesList()
            this.addDialogVisible = false
          }
        } else {
        }
      })
    },
    showScope: function (s) {
      console.log(s)
    },
    getRolesList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      } else {
        this.rolesList = res.data
        this.$message.success('获取角色列表成功')
      }
    }
  },
  created () {
    this.getRolesList()
  },
  watch: {
    addDialogVisible: function (n) {
      if (!n) {
        this.$refs.addFormRef.resetFields()
      }
    },
    setRightDialogVisible: function (n) {
      if (!n) {
        this.defKeys = []
        console.log(this.defKeys)
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
  margin-top: 10px;
  #addRoleBtn {
    margin-bottom: 10px;
  }
  .el-tag {
    margin: 7px;
  }
  .el-row:first-of-type {
    border-top: 1px solid #eee;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter{
    display: flex;
    align-items: center;
  }
}
</style>
