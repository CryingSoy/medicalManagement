<template>
  <header>
    <h1>华软医疗管理系统</h1>
    <ul>
      <li @click="login">登录</li>
      <li>注册</li>
    </ul>
    <login></login>
  </header>
</template>
<script>
import login from '../login/login.vue'
export default {
  name: 'header',
  components: {
    login
  },
  methods: {
    login () {
      this.$store.dispatch('openLoginWindow')
    }
  }
}
</script>

<style lang="less" scoped>
header {
  height: 50px;
  background: url('./header.png');
  display: flex;
  align-items: center;
  justify-content: space-around;
  h1 {
    font-size: 20px;
    color: #fff;
  }
  li {
    color: #fff;
    cursor: pointer;
  }
}
</style>
