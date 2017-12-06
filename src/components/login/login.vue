<template>
  <el-dialog title="登录窗口" :visible="isShowLoginWindow" :before-close="colseLogin" center width="500px">
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
    <div slot="footer" class="dialog-footer">
      <el-button class="default-btn" @click="colseLogin">取 消</el-button>
      <el-button class="success-btn" type="primary">确 定</el-button>
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
        value: '选项1',
        label: '我是校医'
      },
      {
        value: '选项2',
        label: '我是学生'
      },
      {
        value: '选项3',
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
      }
    }
  },
  methods: {
    colseLogin () {
      this.$refs.form.resetFields()
      this.$store.dispatch('closeLoginWindow')
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
