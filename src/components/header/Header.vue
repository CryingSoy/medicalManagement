<template>
  <header>
    <h1>华软医疗管理系统</h1>
    <ul>
      <div v-if="!isShowUserInfo">
        <li class="click" @click="login">登录</li>
      <li class="click" @click="register">注册</li>
      </div>
      <div v-else>
        <li>{{ userInfo.typ }}</li>
        <li>{{ userInfo.name }}</li>
        <li class="click" @click="logout">退出</li>
      </div>
    </ul>
    <login></login>
    <register></register>
  </header>
</template>
<script>
import login from '../login/login.vue'
import register from '../register/register.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'header',
  components: {
    login,
    register
  },
  data () {
    return {
      username: '1232'
    }
  },
  methods: {
    login () {
      this.$store.dispatch('openLoginWindow')
    },
    register () {
      this.$store.dispatch('openRegWindow')
    },
    logout () {
      this.$store.dispatch('closeUserInfo')
    }
  },
  beforeMount () {
    if (localStorage.siseToken !== '') {
      this.$axios.post('http://localhost:3000/login', {
        token: localStorage.siseToken
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          const { data } = res
          let serverBackData = data
          console.log(serverBackData)
          if (serverBackData.code === -1) {
            console.log('Token错误')
          } else if (serverBackData.hasOwnProperty('data')) {
            this.$store.dispatch('openUserInfo')
            this.$store.dispatch('setUserInfo', serverBackData.data)
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'isShowUserInfo',
      'userInfo'
    ])
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
  }
  .click {
    cursor: pointer;
  }
}
</style>
