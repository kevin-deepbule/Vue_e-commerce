<template>
<el-container class="home-container">
     <el-header >
       <div>
         <img src="../assets/heima.png" alt="" srcset="">
         <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logOut">退出</el-button>
     </el-header>
    <el-container>
        <el-aside width="200px">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <el-menu :collapse = "collapse"
          class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff">
      <el-submenu :index="item.id+''"  v-for="item in menulist" :key="item.id" :unique-opened="true">
        <template slot="title">
          <i :class="home_icon[item.id]" style="font-size:22px" ></i>
          <span>{{item.authName}}</span>
        </template>
          <el-menu-item :index="itemChild.id+''" v-for="itemChild in item.children" :key = 'itemChild.id'><i class="el-icon-menu"></i>{{itemChild.authName}}</el-menu-item>
      </el-submenu>
    </el-menu>

    </el-aside>
        <el-main>Main</el-main>
    </el-container>
</el-container>

</template>
<style scoped>
 @import "../assets/font/style.css";
</style>
<style lang='less' scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #fff;
  > div{
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside{
  background-color: #333744;
  width: 200px;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.home-container{
  height: 100%;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
<script>
export default {
  created() {
    this.getMenulist();
  },
  data() {
    return {
      menulist: [],
      collapse: false,
      collapse_transition: false,
      home_icon: {
        125: 'icon-people_alt',
        103: 'icon-key',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
    };
  },
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.replace('/login');
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    async getMenulist() {
      const { data: res } = await this.$http.get('menus');
      this.menulist = res.data;
      console.log(res);
    },
    toggleCollapse() {
      this.collapse = !this.collapse;
    },
  },
};
</script>
