<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限列表</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" align="center"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" align="center">
        </el-table-column>

        <el-table-column prop="path" label="权限路径" align="center">
        </el-table-column>
        <el-table-column prop="level" label="权限等级" align="center">
          <template slot-scope="scope">
            <el-tag type="" v-if="scope.row.level==0" >一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==2">三级</el-tag>

            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      rightsList: []
    }
  },
  methods: {
    showScope: function (s) {
      console.log(s)
    },
    getRightsList: async function () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('获取用户权限列表失败')
      } else {
        this.rightsList = res.data
        console.log(this.rightsList)
        this.$message.success('获取用户权限列表成功')
      }
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  font: 18px '华文行楷';
}
.el-card {
  margin-top: 10px;
}
</style>
