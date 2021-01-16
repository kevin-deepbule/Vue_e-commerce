<template>
    <div>
        <el-button type="info" @click="logOut">退出</el-button>
    </div>
</template>
<style lang='less' scoped>

</style>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    logOut () {
      window.sessionStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>
