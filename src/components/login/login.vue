<template>
  <el-dialog title="登录窗口" :modal-append-to-body="false" :visible="isShowLoginWindow" :before-close="closeLogin" center width="500px">
    <el-form label-position="left" label-width="80px" :rules="rules" ref="form" :model="loginData">
      <el-form-item label="用户类型" prop="userType">
        <el-select placeholder="用户类型" v-model="loginData.userType">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="loginData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="loginData.password"></el-input>
      </el-form-item>
    </el-form>
    <el-alert :title="errorText" type="error" v-show="error" @close="closeError"></el-alert>
    <div slot="footer" class="dialog-footer">
      <el-button class="default-btn"  @click="closeLogin">取 消</el-button>
      <el-button class="success-btn" type="primary" @click="submitReg">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'login',
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
    closeLogin () {
      this.$refs.form.resetFields()
      this.$store.dispatch('closeLoginWindow')
    },
    submitReg () {
      this.$axios.post('http://localhost:3000/login', {
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
          } else {
            this.error = false
            this.$store.dispatch('setToken', serverBackData.data.token)
            this.$store.dispatch('closeLoginWindow')
            this.$store.dispatch('setUserInfo', serverBackData.data)
            this.$store.dispatch('openUserInfo')
            localStorage.siseToken = serverBackData.data.token
            this.$message({
              message: '登录成功',
              type: 'success'
            })
          }
        }
      })
    },
    closeError () {
      this.error = false
    }
  },
  computed: {
    ...mapGetters([
      'isShowLoginWindow'
    ])
  }
}
</script>

<style lang="less">
</style>
