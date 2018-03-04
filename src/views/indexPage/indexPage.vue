<template>
  <div class="container">
    <register></register>
    <h1 class="title">华软医疗管理系统</h1>
    <main>
      <div class="login-wrapper" v-if="!isShowUserInfo">
        <h1>登陆窗口</h1>
        <el-form label-position="left" label-width="80px" :rules="rules" ref="form" :model="loginData">
          <el-form-item align="left" label="用户类型" prop="userType">
            <el-select placeholder="用户类型" v-model="loginData.userType">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="loginData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input @keyup.native.enter="submitLog" placeholder="请输入密码" type="password" v-model="loginData.password"></el-input>
          </el-form-item>
        </el-form>
        <el-alert :title="errorText" type="error" v-show="error" @close="closeError"></el-alert>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" class="success-btn" @click="submitLog">确 定</el-button>
          <el-button  class="default-btn" @click="register">注 册</el-button>
        </div>
      </div>
    </main>
    <my-footer></my-footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import myFooter from '../../components/footer/footer.vue'
import register from '../../components/register/register.vue'
export default {
  components: {
    myFooter,
    register
  },
  data () {
    return {
      // 用户类型选项
      userOptions: [{
        value: 'doctor',
        label: '我是校医'
      },
      {
        value: 'student',
        label: '我是学生'
      },
      {
        value: 'teacher',
        label: '我是教师'
      }],
      loginData: {
        userType: '',
        username: '',
        password: ''
      },
      rules: {
        userType: [{
          required: true,
          message: '请选择用户类型',
          trigger: 'change'
        }],
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      errorText: '',
      error: false
    }
  },
  methods: {
    register () {
      this.$store.dispatch('openRegWindow')
    },
    closeLogin () {
      this.$refs.form.resetFields()
      this.$store.dispatch('closeLoginWindow')
    },
    submitLog () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios.post('/login', {
            userType: this.loginData.userType,
            username: this.loginData.username,
            password: this.loginData.password
          }).then(res => {
            if (res.status === 200 && res.statusText === 'OK') {
              const { data } = res
              let serverBackData = data
              console.log(serverBackData)
              if (serverBackData.code === -1) {
                this.errorText = serverBackData.msg
                this.error = true
              } else if (!serverBackData.hasOwnProperty('data')) {
                this.error = false
                this.$store.dispatch('closeLoginWindow')
                this.goTypePage(serverBackData.data.typ)
              } else {
                this.error = false
                this.$store.dispatch('setToken', serverBackData.data.token)
                this.$store.dispatch('closeLoginWindow')
                this.$store.dispatch('setUserInfo', serverBackData.data)
                this.$store.dispatch('openUserInfo')
                localStorage.siseToken = serverBackData.data.token
                this.$message({
                  message: `登录成功！用户名是${serverBackData.data.name}，用户类型是${serverBackData.data.typCN}。`,
                  type: 'success'
                })
                this.goTypePage(serverBackData.data.typ)
              }
            }
          })
        } else {
          console.log('填写错误')
        }
      })
    },
    goTypePage (type) {
      const map = {
        doctor: '/doctorPage/doctorInfo',
        teacher: '/teacherPage',
        student: '/studentPage'
      }
      console.log(type, map[type])
      this.$router.push({
        path: map[type]
      })
    },
    closeError () {
      this.error = false
    }
  },
  computed: {
    ...mapGetters([
      'isShowLoginWindow',
      'isShowUserInfo',
      'userInfo'
    ])
  },
  mounted () {
    if (this.userInfo) {
      this.goTypePage(this.userInfo.typ)
    }
  }
}
</script>

<style lang="less" scoped>
@font-face {
font-family: fontface;
src: url('kt.ttf');
}
.container {
  background: url('./timg.jpg') no-repeat;
  height: 100%;
  background-size: 100% 100%;
  .title {
    font-family: fontface;
    font-size: 70px;
    position: absolute;
    left: 8%;
    top: 8%;
    user-select: none;
  }
}
main {
  background-color: rgba(0, 0, 0, .2);
  .login-wrapper {
    box-sizing: border-box;
    float: right;
    margin: 12% 10% 0 0;
    width: 400px;
    height: 400px;
    padding: 15px 40px 0;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    h1 {
      font-size: 26px;
      text-align: left;
      margin-top: 19px;
      margin-bottom: 30px;
    }
    .dialog-footer {
      padding-top: 30px;
    }
  }
}
</style>
