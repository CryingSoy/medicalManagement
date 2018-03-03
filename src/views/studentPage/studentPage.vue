<template>
  <div id="student">
    <my-header></my-header>
    <el-tabs class="tabs" type="border-card" v-model="activeName" @tab-click="handleClick" v-if="isLogin">
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
            <el-button v-if="isEdit" type="primary" @click="submitEdit">完成</el-button>
            <el-button v-if="isEdit" @click="isEdit=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="就诊记录" name="second">
        <span slot="label"><i class="el-icon-date"></i> 就诊信息</span>
        <el-table :data="studentTreat" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="table-expand">
              <el-col :span="24">
                <el-form-item label="详细症状" class="diseaseInfo">
                  <span>{{ props.row.diseaseDetail }}</span>
                </el-form-item>
              </el-col>
              <el-form-item class="medicineDetail" style="width:100%" v-for="(value, index) in props.row.medicineDetail" :key="index" :label="'药品'+index">
                <div>名称：{{ value.name }}</div>
                <div>条形码：{{ value.barCode }}</div>
                <div>使用数量：{{ value.howUsed }}</div>
                <div>单价：{{ value.price }}</div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="time" label="日期" sortable>
        </el-table-column>
        <el-table-column align="center" prop="total" label="总价" sortable>
        </el-table-column>
        <el-table-column align="center" prop="disease" label="病因" sortable>
        </el-table-column>
        <el-table-column align="center" prop="doctorId" label="校医名" sortable>
        </el-table-column>
        <el-table-column align="center" prop="leaveDay" label="请假天数" sortable>
        </el-table-column>
      </el-table>
      </el-tab-pane>
      <el-tab-pane label="该功能待开发" name="third">该功能待开发</el-tab-pane>
      <el-tab-pane label="该功能待开发" name="fourth">该功能待开发</el-tab-pane>
    </el-tabs>
    <doctor-status v-if="isLogin"></doctor-status>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import doctorStatus from '../../components/doctor-status/doctor-status.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'studentPage',
  components: {
    myHeader,
    doctorStatus
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
      },
      studentTreat: []
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
    this.fetchData()
  },
  methods: {
    fetchData () {
      setTimeout(() => {
        this.$axios.post('/studentSearch', {
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
      }, 300)

      setTimeout(() => {
        this.$axios.post('/searchStudentTreat', {
          studentId: this.studentInfo.studentId
        }).then(res => {
          if (res.status === 200 && res.statusText === 'OK') {
            const { data } = res
            let serverBackData = data
            console.log(serverBackData)
            if (serverBackData.code === 1) {
              serverBackData.data.map(item => {
                let {time, total, disease, diseaseDetail, medicineDetail, doctorId, leaveDay} = item
                let medicineDetailArray = medicineDetail.split('+')
                // console.log(medicineDetailArray)
                medicineDetail = medicineDetailArray.map(items => {
                  return JSON.parse(items)
                })
                // console.log(medicineDetail)
                this.studentTreat.push({
                  time,
                  total,
                  disease,
                  diseaseDetail,
                  medicineDetail,
                  doctorId,
                  leaveDay
                })
              })
            }
          }
        })
      }, 400)
    },
    handleClick (tab, event) {
      console.log(tab)
    },
    submitEdit () {
      this.$axios.post('/updateStudentInfo', {
        name: this.studentInfo.name,
        sex: this.studentInfo.sex,
        age: this.studentInfo.age,
        depart: this.studentInfo.depart,
        studentId: this.studentInfo.studentId
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          const { data } = res
          let serverBackData = data
          console.log(serverBackData)
          if (serverBackData.code === 1) {
            this.$message({
              message: '修改个人信息成功',
              type: 'success'
            })
            this.isEdit = false
          }
        }
      })
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
          this.fetchData()
        }
      } else {
        this.$store.dispatch('openLoginWindow')
      }
    },
    isShowUserInfo (value) {
      if (value && this.userInfo.typ === 'student') {
        if (!this.isLogin) {
          this.isLogin = true
          this.fetchData()
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
  margin-top: 40px;
  .tabs {
    margin-top: 60px;
    width: 70%;
    max-width: 800px;
  }
}

.studentInfoForm {
  margin-top: 50px;
  .el-form-item {
    margin-left: 120px;
    padding-right:120px
  }
}

.medicineDetail {
  margin-top: 20px;
}

.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.diseaseInfo {
  width: 100% !important;
  border-bottom:1px solid #d9d9d9;
  padding-bottom: 20px;
}
</style>
