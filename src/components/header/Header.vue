<template>
  <header>
    <h1>华软医疗管理系统</h1>
    <ul>
      <li @click="login">登录</li>
      <li @click="register">注册</li>
    </ul>
    <login></login>
    <register></register>
  </header>
</template>
<script>
import login from '../login/login.vue'
import register from '../register/register.vue'
export default {
  name: 'header',
  components: {
    login,
    register
  },
  methods: {
    login () {
      this.$store.dispatch('openLoginWindow')
    },
    register () {
      this.$store.dispatch('openRegWindow')
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
