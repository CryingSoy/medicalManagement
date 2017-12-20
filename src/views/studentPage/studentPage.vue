<template>
  <div id="student">
    <my-header></my-header>
    <el-tabs class="tabs" type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label"><i class="el-icon-document"></i> 个人信息</span>
        <el-form class="studentInfoForm" ref="form" :model="studentInfo">
          <el-form-item label="姓名" style="margin-top:30px;">
            <el-col :span="12">
              <el-input v-model="studentInfo.name" :disabled="!isEdit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="学号" style="margin-top:30px;">
            <el-col :span="12">
              <el-input v-model="studentInfo.studentId" :disabled="!isEdit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="性别" style="margin-top:30px;">
            <el-col :span="12">
              <el-input v-model="studentInfo.sex" :disabled="!isEdit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="年龄" style="margin-top:30px;">
            <el-col :span="12">
              <el-input v-model="studentInfo.age" :disabled="!isEdit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="系别" style="margin-top:30px;">
            <el-col :span="12">
              <el-input v-model="studentInfo.depart" :disabled="!isEdit"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="个人简介" style="margin-top:30px;padding-right:140px">
            <el-col>
              <el-input :disabled="!isEdit"
                type="textarea"
                :rows="2"
                :autosize="{ minRows: 5}"
                placeholder="请输入个人简介"
                v-model="studentInfo.studentDetail">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!isEdit" type="primary" icon="el-icon-edit-outline" @click="isEdit=true">编辑</el-button>
            <el-button v-if="isEdit" type="primary">完成</el-button>
            <el-button v-if="isEdit" @click="isEdit=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="就诊记录" name="second">
        <span slot="label"><i class="el-icon-date"></i> 就诊信息</span>
        就珍惜你
      </el-tab-pane>
      <el-tab-pane label="该功能待开发" name="third">该功能待开发</el-tab-pane>
      <el-tab-pane label="该功能待开发" name="fourth">该功能待开发</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'studentPage',
  components: {
    myHeader
  },
  data () {
    return {
      isLogin: false,
      activeName: 'first',
      isEdit: false,
      studentInfo: {
        name: '',
        sex: '',
        age: '',
        depart: '',
        studentId: '',
        studentDetail: ''
      }
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
  methods: {
    handleClick (tab, event) {
      if (this.activeName === 'first') {
        this.$axios.post('http://localhost:3000/studentSearch', {
          name: this.userInfo.name
        }).then(res => {
          if (res.status === 200 && res.statusText === 'OK') {
            const { data } = res
            let serverBackData = data
            console.log(serverBackData)
            if (serverBackData.code === 1) {
              this.studentInfo.name = serverBackData.data[0].name
              this.studentInfo.sex = serverBackData.data[0].sex
              this.studentInfo.age = serverBackData.data[0].age
              this.studentInfo.depart = serverBackData.data[0].depart
              this.studentInfo.studentId = serverBackData.data[0].studentId
            }
          }
        })
      }
    }
  },
  watch: {
    isTokenValidated (value) {
      if (this.isShowUserInfo) {
        if (this.userInfo.typ !== 'student') {
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
      if (value && this.userInfo.typ === 'student') {
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
#student {
  display: flex;
  justify-content: space-around;
  .tabs {
    margin-top: 60px;
    width: 70%;
    max-width: 800px;
  }
}

.studentInfoForm {
  .el-form-item {
    margin-left: 120px;
    padding-right:120px
  }
}
</style>
