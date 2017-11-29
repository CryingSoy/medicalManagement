<template>
  <header>
    <h1>华软医疗管理系统</h1>
    <ul>
      <li>登录</li>
      <li>注册</li>
    </ul>
  </header>
</template>
<script>
export default {
  name: 'header',
  methods: {
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
