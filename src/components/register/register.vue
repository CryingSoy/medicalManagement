<template>
  <el-dialog title="注册窗口" :visible="isShowRegWindow" :modal-append-to-body="false" :before-close="closeReg" center width="500px">
    <el-form label-position="left" label-width="80px" :rules="rules" :model="regData" ref="form">
      <el-form-item label="用户类型" prop="userType">
        <el-select placeholder="用户类型" v-model="regData.userType">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="regData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" type="password" v-model="regData.password"></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="birth">
        <el-date-picker v-model="regData.birth" type="month" placeholder="选择出生年月"></el-date-picker>
      </el-form-item>
      <el-form-item label="教师凭证" prop="teacherCode" v-show="regData.userType ==='teacher'">
        <el-input placeholder="请输入教师凭证" v-model="regData.teacherCode"></el-input>
      </el-form-item>
      <el-form-item label="校医凭证" prop="doctorCode" v-show="regData.userType ==='doctor'">
        <el-input placeholder="请输入校医凭证" v-model="regData.doctorCode"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="studentCode" v-show="regData.userType ==='student'">
        <el-input placeholder="请输入学号" v-model="regData.studentCode"></el-input>
      </el-form-item>
    </el-form>
    <el-alert :title="errorText" type="error" v-show="error" @close="closeError"></el-alert>
    <div slot="footer" class="dialog-footer">
      <el-button class="default-btn" @click="closeReg">取 消</el-button>
      <el-button class="success-btn" type="primary" @click="submitReg">注 册</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'register',
  data () {
    return {
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
      regData: {
        userType: '',
        birth: '',
        username: '',
        password: '',
        teacherCode: '',
        doctorCode: '',
        studentCode: ''
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
        }, {
          min: 3,
          max: 10,
          message: '长度在 3 到 10 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 3,
          max: 12,
          message: '长度在 3 到 12 个字符',
          trigger: 'blur'
        }],
        birth: [{
          type: 'date',
          required: true,
          message: '请选择日期',
          trigger: 'change'
        }],
        teacherCode: [{
          // required: true,
          message: '请输入教师凭证',
          trigger: 'blur'
        }],
        doctorCode: [{
          // required: true,
          message: '请输入医生凭证',
          trigger: 'blur'
        }],
        studentCode: [{
          // required: true,
          message: '请输入学号',
          trigger: 'blur'
        }]
      },
      errorText: '',
      error: false
    }
  },
  methods: {
    closeReg () {
      this.$refs.form.resetFields()
      this.$store.dispatch('closeRegWindow')
    },
    submitReg () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$axios.post('http://localhost:3000/register', {
            userType: this.regData.userType,
            username: this.regData.username,
            password: this.regData.password,
            birth: this.regData.birth.getFullYear() + '-' + ((this.regData.birth.getMonth() + 1) < 10 ? '0' + (this.regData.birth.getMonth() + 1) : (this.regData.birth.getMonth() + 1)),
            code: this.regData[this.regData.userType + 'Code']
          }).then(res => {
            if (res.status === 200 && res.statusText === 'OK') {
              const { data } = res
              console.log(data)
              if (data.code === -1) {
                this.errorText = data.msg
                this.error = true
              } else if (data.code === 1) {
                this.$message({
                  message: '注册成功',
                  type: 'success'
                })
                this.$refs.form.resetFields()
                setTimeout(() => {
                  this.$store.dispatch('closeRegWindow')
                  this.$store.dispatch('openLoginWindow')
                }, 1000)
              }
            }
          })
        } else {
          console.log('填写错误')
        }
      })
    },
    closeError () {
      this.error = false
    }
  },
  computed: {
    ...mapGetters([
      'isShowRegWindow'
    ])
  }
}
</script>

<style lang="less">
</style>
