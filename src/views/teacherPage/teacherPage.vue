<template>
  <div id="teacher">
    <my-header></my-header>
    <div class="teacher-content" v-show="isLogin">
      <h3>学生医疗信息查询</h3>
      <el-input class="inline-input" placeholder="请输入学生学号" @keyup.native.enter="fetchStudentInfo" v-model="studentId" clearable></el-input>
      <el-button type="primary" @click="fetchStudentInfo">查询</el-button>
      <el-button style="margin-left: 0px">重置</el-button>
      <table class="content-table" border="1">
        <tr>
          <td>信息</td>
          <td>内容</td>
        </tr>
        <tr>
          <td>学号</td>
          <td>{{studentData.studentId}}</td>
        </tr>
        <tr>
          <td>姓名</td>
          <td>{{studentData.name}}</td>
        </tr>
        <tr>
          <td>性别</td>
          <td>{{studentData.sex ? studentData.sex === 'male' ? '男' : '女' : ''}}</td>
        </tr>
        <tr>
          <td>年龄</td>
          <td>{{studentData.age}}</td>
        </tr>
        <tr>
          <td>系别</td>
          <td>{{studentData.depart}}</td>
        </tr>
      </table>
      <h3 style="margin-top: 20px">学生历史就诊信息</h3>
      <el-table :data="treatHistroy" style="width: 100%; margin-top: 20px">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div style="float: left">病因详情：</div>
            <div style="margin-left: 70px">{{props.row.diseaseDetail}}</div>
            <div style="overflow: hidden"></div>
            <div style="margin-top: 20px; float: left">用药详情：</div>
            <div style="margin-left: 70px">
              <table class="content-table" style="margin-top: 24px;">
                <tr>
                  <td>药品名称</td>
                  <td>数量</td>
                  <td>单价</td>
                </tr>
                <tr v-for="(item, index) in props.row.medicineDetail" :key="'item' + index">
                  <td>{{JSON.parse(item).name}}</td>
                  <td>{{JSON.parse(item).howUsed}}</td>
                  <td>{{JSON.parse(item).price}}</td>
                </tr>
              </table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="time"></el-table-column>
        <el-table-column label="消费金额" prop="total"></el-table-column>
        <el-table-column label="主要病因" prop="disease"></el-table-column>
        <el-table-column label="校医名" prop="doctorId"></el-table-column>
        <el-table-column label="请假日期" prop="leaveDay"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'teacherPage',
  components: {
    myHeader
  },
  data () {
    return {
      isLogin: false,
      studentData: {
        studentId: ''
      },
      studentId: '',
      treatHistroy: []
    }
  },
  methods: {
    fetchStudentInfo () {
      if (this.studentId !== '') {
        this.$axios.post('http://localhost:3000/studentSearch', {
          studentId: this.studentId
        }).then(res => {
          if (res.status === 200 && res.statusText === 'OK') {
            if (res.data.code === 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.studentData = res.data.data[0]
            } else {
              this.$message.error(res.data.msg)
            }
          } else {
            this.$message.error('网络错误')
          }
        })
        this.$axios.post('http://localhost:3000/searchStudentTreat', {
          studentId: this.studentId
        }).then(res => {
          if (res.status === 200 && res.statusText === 'OK') {
            if (res.data.code === 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.treatHistroy = res.data.data
              this.treatHistroy = this.treatHistroy.reverse()
              this.treatHistroy.forEach(element => {
                element.medicineDetail = element.medicineDetail.split('+')
              })
            } else {
              this.$message.error(res.data.msg)
            }
          } else {
            this.$message.error('网络错误')
          }
        })
      } else {
        this.$message.error('请输入学生学号')
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
  watch: {
    isTokenValidated (value) {
      if (this.isShowUserInfo) {
        if (this.userInfo.typ !== 'teacher') {
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
      if (value && this.userInfo.typ === 'teacher') {
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
.teacher-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
  padding-top: 50px;
  h3 {
    font-size: 24px;
    color: #24B4AA;
    margin-top: 50px;
  }
  .inline-input {
    width: 500px;
    margin-top: 20px;
  }
  .content-table {
    width: 100%;
    margin-top: 10px;
    border: 1px solid #e6ebf5;
    border-radius: 5px;
    border-collapse: collapse;
    color: #5a5e66;
    tr {
      height: 50px;
      text-align: center;
      border: 1px solid #e6ebf5;
    }
    td {
      border: 1px solid #e6ebf5;
    }
  }
}
</style>
