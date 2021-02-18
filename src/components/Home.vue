<template>
  <el-container class="home-container">
    <el-header>
      <div @click="a">
        <img src="../assets/touxiang.jpg" alt="" srcset="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logOut">登出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :collapse="iscollapse"
          :collapse-transition="true"
          :router="true"
          class="el-menu-vertical-demo"
          background-color="#46A8A8"
          unique-opened
          text-color="#ccc"
          :default-active="activePath"
          active-text-color="#3429DC"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
            :unique-opened="true"
          >
            <template slot="title">
              <i :class="home_icon[item.id]" style="font-size:22px"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + itemChild.path"
              v-for="itemChild in item.children"
              :key="itemChild.id"
              @click="saveNavState('/' + itemChild.path)"
              ><i class="el-icon-menu"></i
              >{{ itemChild.authName }}</el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
@import '../assets/font/style.css';
</style>
<style lang="less" scoped>
.el-header {
  background-color: #bbe6d6;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
  img {
    width: 59px;
    height: 59px;
    border-radius: 59px;
    margin: 2px 10px;
  }
}
.el-aside {
  background-color: #46a8a8;
  width: 200px;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #46a8a8;
  font-size: 14px;
  color: rgb(248, 98, 98);
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
<script>
export default {
  created () {
    this.getMenulist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menulist: [],
      iscollapse: false,
      collapse_transition: false,
      home_icon: {
        125: 'icon-people_alt',
        103: 'icon-key',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing'
      },
      activePath: ''
    }
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async getMenulist () {
      const { data: res } = await this.$http.get('menus')
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.iscollapse = !this.iscollapse
    },
    a () {
      this.$router.replace('/welcome')
      window.sessionStorage.setItem('activePath', '')
      this.activePath = sessionStorage.getItem('activePath')
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = sessionStorage.getItem('activePath')
    }
  }
}
</script>
