<template>
  <div id="doctor">
    <my-header></my-header>
    <doctor-nav v-if="isLogin"></doctor-nav>
    <router-view class="view" v-if="isLogin"></router-view>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import doctorNav from '../../components/doctor-nav/doctor-nav.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'doctorPage',
  methods: {
    goTreat () {
      this.$router.push({
        path: '/treat'
      })
    }
  },
  components: {
    myHeader,
    doctorNav
  },
  data () {
    return {
      isLogin: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'isShowUserInfo',
      'isTokenValidated'
    ])
  },
  mounted () {
    if (!localStorage.siseToken) this.$store.dispatch('openLoginWindow')
  },
  watch: {
    isTokenValidated (value) {
      if (this.isShowUserInfo) {
        if (this.userInfo.typ !== 'doctor') {
          this.$message.error({
            message: '用户类型错误，请登录正确的用户类型'
          })
        } else {
          this.isLogin = true
        }
      } else {
        this.$store.dispatch('openLoginWindow')
      }
    },
    isShowUserInfo (value) {
      console.log(this.userInfo)
      if (value && this.userInfo.typ === 'doctor') {
        if (!this.isLogin) {
          this.isLogin = true
        }
      } else {
        this.$message.error({
          message: '用户类型错误，请登录正确的用户类型'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.view {
  padding: 50px 0 0;
}

@media screen and (max-width: 1220px) {
  .view {
    padding-left: 200px;
  }
}
</style>
