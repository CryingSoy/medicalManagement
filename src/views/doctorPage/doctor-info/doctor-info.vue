<template>
  <div class="container">
    <h3>{{userInfo.name}}，欢迎回来</h3>
    <div class="treat-time">
      <h4>请确定开诊时间，以便教师和学生知道校医室是否有人值班。</h4>
      <el-form style="margin-top: 50px" ref="form" :model="treatTime" label-width="80px" :rules="rules">
        <el-form-item prop="date" label="开诊时间" required>
          <el-time-picker type="fixed-time" placeholder="开诊时间" v-model="treatTime.date" style="width: 160px"></el-time-picker>
        </el-form-item>
        <el-form-item prop="time" label="开诊时长" required>
          <el-autocomplete popper-class="my-autocomplete" v-model="treatTime.time" :fetch-suggestions="querySearch" placeholder="请输入开诊时长(分钟)" @select="handleSelect">
            <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
            </i>
            <template slot-scope="props">
              <div class="name">{{ props.item.min + '分钟' }}</div>
              <span class="addr">{{ props.item.hours + '小时' }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitTreatTime(1)">确定</el-button>
          <el-button type="warning" @click="submitTreatTime(2)">暂停就诊</el-button>
          <el-button type="success" @click="submitTreatTime(2)">恢复就诊</el-button>
          <el-button type="danger" @click="submitTreatTime(0)">停止就诊</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'doctorInfo',
  data () {
    function checkTime (rule, value, callback) {
      let reg = /^[0-9]+.?[0-9]*$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字值'))
      } else {
        callback()
      }
    }
    return {
      treatTime: {
        date: new Date(),
        time: ''
      },
      timeSelect: [{
        min: '480',
        hours: '8'
      },
      {
        min: '240',
        hours: '4'
      }],
      rules: {
        date: [
          { type: 'date', required: true, message: '请选择开诊时间', trigger: 'change' }
        ],
        time: [
          { required: true, message: '请输入开诊时长', trigger: 'blur' },
          { validator: checkTime, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    querySearch (queryString, cb) {
      let timeSelect = this.timeSelect
      let results = []
      if (queryString) {
        results = timeSelect.filter(item => {
          return item.min.indexOf(queryString) > -1 || item.hours.indexOf(queryString) > -1
        })
      } else {
        results = timeSelect
      }
      cb(results)
    },
    handleSelect (item) {
      this.treatTime.time = item.min
    },
    handleIconClick () {},
    submitTreatTime (status) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:3000/changeDoctorStatus', {
            username: this.userInfo.name,
            status,
            duration: this.treatTime.time
          }).then(res => {
            if (res.status === 200 && res.statusText === 'OK') {
              if (res.data.code === 1) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
              } else {
                this.$message.error(res.data.msg)
              }
            } else {
              this.$message.error('网络错误')
            }
          })
        } else {
          console.log('error submit!!')
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
  h3 {
    margin-top: 50px;
    font-size: 24px;
    color: #24B4AA;
  }
  h4 {
    margin-top: 50px;
  }
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
