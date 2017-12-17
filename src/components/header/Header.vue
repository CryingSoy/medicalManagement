<template>
  <header>
    <h1 @click="goIndex">华软医疗管理系统</h1>
    <ul>
      <div v-if="!isShowUserInfo">
        <li class="click" @click="login">登录</li>
      <li class="click" @click="register">注册</li>
      </div>
      <div v-else>
        <li>{{ userInfo.typCN }}</li>
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
  methods: {
    goIndex () {
      this.$router.push({
        path: '/'
      })
    },
    login () {
      this.$store.dispatch('openLoginWindow')
    },
    register () {
      this.$store.dispatch('openRegWindow')
    },
    logout () {
      this.$store.dispatch('closeUserInfo')
      this.$router.push({
        path: '/'
      })
    }
  },
  beforeMount () {
    if (localStorage.siseToken && localStorage.siseToken !== '') {
      this.$axios.post('http://localhost:3000/login', {
        token: localStorage.siseToken
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          this.$store.dispatch('validatedToken')
          const { data } = res
          let serverBackData = data
          console.log(serverBackData)
          if (serverBackData.code === -1) {
            console.log('Token错误')
            this.$router.push({
              path: '/'
            })
          } else if (serverBackData.hasOwnProperty('data')) {
            this.$store.dispatch('openUserInfo')
            this.$store.dispatch('setUserInfo', serverBackData.data)
          }
          setTimeout(() => {
            this.$store.dispatch('colseValidatedToken')
          }, 1)
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
  width: 100%;
  position: fixed;
  top: 0;
  height: 50px;
  background: url('./header.png');
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
  h1 {
    font-size: 20px;
    color: #fff;
    cursor: pointer;
  }
  li {
    color: #fff;
    display: inline-block;
    margin: 0 10px;
  }
  .click {
    cursor: pointer;
  }
}
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
