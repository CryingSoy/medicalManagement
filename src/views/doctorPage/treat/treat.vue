<template>
  <div id="treat">
    <el-dialog title="学生信息" align="center" :visible.sync="dialogTableVisible">
      <el-table :data="studentInfo">
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="age" label="年龄"></el-table-column>
        <el-table-column property="sex" label="性别"></el-table-column>
        <el-table-column property="depart" label="系别"></el-table-column>
        <el-table-column property="studentId" label="学号"></el-table-column>
      </el-table> 
      <el-button style="margin-top:20px" @click="searchStudentTreat">历史就诊记录</el-button>
      <el-table v-show="studentTreatVisible" :data="studentTreat" style="width: 100%">
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
        <el-table-column prop="time" label="日期" sortable>
        </el-table-column>
        <el-table-column prop="total" label="总价" sortable>
        </el-table-column>
        <el-table-column prop="disease" label="病因" sortable>
        </el-table-column>
        <el-table-column prop="doctorId" label="校医名" sortable>
        </el-table-column>
        <el-table-column prop="leaveDay" label="请假天数" sortable>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="treatForm">
      <el-form-item label="学生学号" prop="studentId">
        <el-col :span="20">
          <el-input v-model="ruleForm.studentId"></el-input>
        </el-col>
        <el-col :span="4">
        <el-button type="primary" icon="el-icon-search" @click="queryStudentInfo">查询</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="当前校医" prop="doctorName">
        <el-col :span="20">
          <el-input v-model="ruleForm.doctorName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="病因" prop="disease">
        <el-col :span="20">
          <el-input v-model="ruleForm.disease"></el-input>
        </el-col>
        <el-col :span="3">
          <el-dropdown @command="handleCommand">
            <el-button type="primary" icon="el-icon-plus"></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="感冒（上呼吸道感染）">感冒（上呼吸道感染）</el-dropdown-item>
              <el-dropdown-item command="发烧">发烧</el-dropdown-item>
              <el-dropdown-item command="头痛">头痛</el-dropdown-item>
              <el-dropdown-item command="胃痛">胃痛</el-dropdown-item>
              <el-dropdown-item command="关节扭伤">关节扭伤</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-form-item>
      <el-form-item label="详细症状" prop="diseaseDetail">
        <el-col :span="20">
          <el-input :autosize="{minRows: 3}" type="textarea" v-model="ruleForm.diseaseDetail"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="就诊时间" required>
        <el-col :span="20">
          <el-form-item prop="treatDate">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="ruleForm.treatDate" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="药品搜索" prop="drugName">
        <el-col :span="7">
          <el-autocomplete @keyup.enter.native="scan" popper-class="drugSearchResults" v-model="searchItem" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
            <i class="el-icon-search el-input__icon" slot="prefix"></i>
            <i v-show="searchItem" class="el-icon-circle-close el-input__icon" slot="suffix" @click="clearSelectItem"></i>
            <template slot-scope="props">
              <div class="name">{{ props.item.name }}<span v-if="props.item.hasOwnProperty('barCode')" class="barCode">[{{ props.item.barCode }}]</span><div class="num">x{{ props.item.num }}</div></div>
              <span class="useDetail">{{ props.item.useDetail }}</span>
              <span class="factory">{{ props.item.factory }}</span>
            </template>
          </el-autocomplete>
        </el-col>
      </el-form-item>
      <el-form-item label="药品列表">
        <el-col :span="24">
          <el-table :summary-method="getSummaries" show-summary stripe align="left" ref="multipleTable" :data="selectArray" tooltip-effect="dark" style="width: 100%">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item label="厂商">
                  <span>{{ props.row.factory }}</span>
                </el-form-item>
                <el-form-item label="详细描述">
                  <span>{{ props.row.useDetail }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="条形码" width="125">
            <template slot-scope="scope">{{ scope.row.barCode }}</template>
          </el-table-column>
          <el-table-column prop="name" label="名称" width="160">
          </el-table-column>
          <el-table-column prop="money" label="单价" width="90" align="center">
          </el-table-column>
          <el-table-column prop="selectNum" label="数量" align="center">
            <template slot-scope="scope">
              <el-input @change="refreshTableData(scope.$index, selectArray);checkNumber(scope.$index, selectArray)" class="selectNum" v-model="scope.row.selectNum" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" @click.native.prevent="refreshTableData(scope.$index, selectArray, 'sub')" :disabled="scope.row.selectNum==0">-</el-button>
              <el-button type="text" @click.native.prevent="refreshTableData(scope.$index, selectArray, 'add')" :disabled="scope.row.selectNum==scope.row.num">+</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, selectArray)" type="text" size="medium">
                移除
              </el-button>
            </template>
          </el-table-column>
          </el-table>
          <el-button v-if="this.selectArray.length!==0" class="deleteButton" @click="toggleSelection(selectArray)">清除所选</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="是否请假" prop="leaveDay">
        <el-radio-group v-model="ruleForm.leaveDay">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请假时间" v-show="ruleForm.leaveDay">
        <el-col :span="24">
          <el-select v-model="ruleForm.leave" placeholder="请选择">
            <el-option v-for="item in ruleForm.leaveDayArray" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">就诊完成</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'treat',
  data () {
    return {
      dialogTableVisible: false,
      treatData: {
        id: ''
      },
      searchArray: [],
      searchItem: '',
      selectArray: [],
      totalMoney: 0,
      studentInfo: [],
      studentTreat: [],
      studentTreatVisible: false,
      ruleForm: {
        studentId: '',
        doctorName: '',
        treatDate: '',
        disease: '',
        diseaseDetail: '',
        drugName: '',
        leaveDay: '',
        leave: '',
        leaveDayArray: [
          {
            value: 1,
            label: '一天'
          },
          {
            value: 2,
            label: '两天'
          },
          {
            value: 3,
            label: '三天'
          },
          {
            value: 4,
            label: '四天'
          },
          {
            value: 5,
            label: '五天'
          },
          {
            value: 6,
            label: '六天'
          },
          {
            value: 7,
            label: '一个星期'
          },
          {
            value: 14,
            label: '两个星期'
          }
        ]
      },
      rules: {
        studentId: [
          { required: true, message: '请输入学生学号', trigger: 'blur' }
        ],
        doctorName: [
          { required: true, message: '请输入校医名字', trigger: 'blur' }
        ],
        disease: [
          { required: true, message: '请输入病因', trigger: 'blur' }
        ],
        diseaseDetail: [
          { required: true, message: '请输入详细症状', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.ruleForm.doctorName = this.userInfo.name
  },
  methods: {
    closeStudentId () {
      this.$router.push({
        path: '/doctorPage'
      })
    },
    // filterTag(value, row) {
    //   return row.tag === value
    // },
    queryStudentInfo () {
      this.$axios.post('http://localhost:3000/studentSearch', {
        studentId: this.ruleForm.studentId
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          const { data } = res
          let serverBackData = data
          console.log(serverBackData)
          if (serverBackData.code === 1) {
            this.dialogTableVisible = true
            let {name, sex, age, depart, studentId} = serverBackData.data[0]
            this.studentInfo.push({
              name,
              sex,
              age,
              depart,
              studentId
            })
          } else if (serverBackData.code === -1) {
            this.$message({
              message: '未查询到该学生的信息',
              type: 'error'
            })
          }
        }
      })
    },
    searchStudentTreat () {
      if (this.studentTreatVisible) {
        return
      }
      this.$axios.post('http://localhost:3000/searchStudentTreat', {
        studentId: this.studentInfo[0].studentId
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          const { data } = res
          let serverBackData = data
          console.log(serverBackData)
          if (serverBackData.code === 1) {
            this.studentTreatVisible = true
            let {time, total, disease, diseaseDetail, medicineDetail, doctorId, leaveDay} = serverBackData.data[0]
            let medicineDetailArray = medicineDetail.split('+')
            console.log(medicineDetailArray)
            medicineDetail = medicineDetailArray.map(item => {
              return JSON.parse(item)
            })
            console.log(medicineDetail)
            this.studentTreat.push({
              time,
              total,
              disease,
              diseaseDetail,
              medicineDetail,
              doctorId,
              leaveDay
            })
          } else if (serverBackData.code === -1) {
            this.$message({
              message: '未查询到该学生的就诊信息',
              type: 'error'
            })
          }
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let medicine = this.selectArray.map(item => {
            return {
              name: item.name,
              barCode: item.barCode,
              howUsed: item.selectNum,
              price: item.money
            }
          })
          this.$axios.post('http://localhost:3000/treatSave', {
            studentId: this.ruleForm.studentId,
            time: this.ruleForm.treatDate,
            total: this.totalMoney,
            disease: this.ruleForm.disease,
            diseaseDetail: this.ruleForm.diseaseDetail,
            doctorId: this.ruleForm.doctorName,
            medicineDetail: medicine,
            leaveDay: this.ruleForm.leave
          }).then(res => {
            if (res.status === 200 && res.statusText === 'OK') {
              const { data } = res
              let serverBackData = data
              console.log(serverBackData)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.selectArray = []
      this.searchItem = ''
    },
    handleCommand (command) {
      this.ruleForm.disease = command
      if (command === '感冒（上呼吸道感染）') {
        this.ruleForm.diseaseDetail = '上呼吸道感染简称上感，又称普通感冒。是包括鼻腔、咽或喉部急性炎症的总称。广义的上感不是一个疾病诊断，而是一组疾病，包括普通感冒、病毒性咽炎、喉炎、疱疹性咽峡炎、咽结膜热、细菌性咽-扁桃体炎。狭义的上感又称普通感冒，是最常见的急性呼吸道感染性疾病，多呈自限性，但发生率较高。成人每年发生2～4次，儿童发生率更高，每年6～8次。全年皆可发病，冬春季较多。'
      } else if (command === '发烧') {
        this.ruleForm.diseaseDetail = '热原直接作用于体温调节中枢、体温中枢功能紊乱或各种原因引起的产热过多、散热减少，导致体温升高超过正常范围的情形。每个人的正常体温略有不同，而且受时间、季节、环境、月经等因素的影响。一般认为当口腔温度高于37.5 ℃，腋窝温度高于37℃，或一日之间体温相差在1℃以上，即为发烧。发烧是临床上最常见的症状，是疾病进展过程中的重要临床表现，可见于多种感染性疾病和非感染性疾病。但有时体温升高不一定都是疾病引起的，某些情况可有生理性体温升高，如剧烈运动、月经前期及妊娠期，进入高温环境或热水浴等均可使体温较平时略高，这些通过自身调节可恢复正常。'
      } else if (command === '头痛') {
        this.ruleForm.diseaseDetail = '头痛（headache） 是临床常见的症状，通常将局限于头颅上半部，包括眉弓、耳轮上缘和枕外隆突连线以上部位的疼痛统称头痛。头痛病因繁多，神经痛、颅内感染、颅内占位病变、脑血管疾病、颅外头面部疾病、以及全身疾病如急性感染、中毒等均可导致头痛。发病年龄常见于青年、中年和老年。'
      } else if (command === '胃痛') {
        this.ruleForm.diseaseDetail = '胃痛，中医病证名。多由外感寒邪、饮食所伤、情志不畅和脾胃素虚等病因而引发。胃是主要病变脏腑，常与肝脾等脏有密切关系。胃气郁滞、失于和降是胃痛的主要病机。治疗以理气和胃为大法，根据不同证候，采取相应治法。'
      } else if (command === '关节扭伤') {
        this.ruleForm.diseaseDetail = '节扭伤的常见症状有疼痛、肿胀、关节活动不灵等，其中疼痛是每个关节扭伤的病人都会出现的症状，而肿胀、皮肤青紫、关节不能转动则是扭伤的常见表现。'
      }
    },
    querySearch (queryString, cb) {
      this.$axios.post('http://localhost:3000/drugSearch', {
        searchItem: this.searchItem
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK') {
          const { data } = res
          let serverBackData = data
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            if (serverBackData.code === -1) {
              this.searchArray = [{
                'name': serverBackData.msg
              }]
              cb(this.searchArray)
            } else {
              this.searchArray = serverBackData.data
              cb(this.searchArray)
            }
          }, 300 * Math.random())
        }
      })
    },
    handleSelect (item) {
      if (item.name.indexOf('未搜索') > -1) {
        console.log('-1')
      } else {
        let a = false
        this.selectArray.map((items, index) => {
          if (items.name === item.name) {
            this.refreshTableData(index, this.selectArray, 'add')
            a = true
          }
        })
        if (!a) {
          item.selectNum = 1
          this.selectArray.push(item)
        }
      }
    },
    scan () {
      this.timeouts = setTimeout(() => {
        if (this.searchArray.length === 1 && this.searchArray[0].barCode === this.searchItem) {
          let a = false
          this.selectArray.map((items, index) => {
            if (items.name === this.searchArray[0].name) {
              this.refreshTableData(index, this.selectArray, 'add')
              a = true
            }
          })
          this.searchItem = ''
          if (!a) {
            this.searchArray[0].selectNum = 1
            this.selectArray.push(this.searchArray[0])
            this.searchItem = ''
          }
        }
      }, 800)
    },
    clearSelectItem (ev) {
      this.searchItem = ''
    },
    checkNumber (index, array) {
      if (isNaN(array[index].selectNum)) {
        this.$message({
          message: '请输入数字',
          type: 'warning'
        })
        array[index].selectNum = 0
      }
      if (array[index].selectNum < 0 || array[index].selectNum > array[index].num) {
        this.$message({
          message: '数量大于或小于库存',
          type: 'warning'
        })
        array[index].selectNum = 0
      }
    },
    toggleSelection (rows) {
      if (rows) {
        this.$refs.multipleTable.selection.map((item, index) => {
          this.selectArray.map((items, indexs) => {
            if (items.name === item.name) {
              this.deleteRow(indexs, this.selectArray)
            }
          })
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    selectNumChange (value) {
      console.log(value)
    },
    refreshTableData (index, rows, alg) {
      if (alg === 'add') {
        rows[index].selectNum++
      } else if (alg === 'sub') {
        rows[index].selectNum--
      }
      let a = rows[index]
      let aI = index
      let b = rows.map((item, index) => {
        if (index < aI || index > aI) {
          return item
        } else if (index === aI) {
          return a
        }
      })
      rows.splice(0, rows.length)
      b.map((item, index) => {
        rows.push(b[index])
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => {
          if (column.property === 'selectNum') {
            return {
              name: '数量',
              num: Number(item[column.property])
            }
          } else if (column.property === 'money') {
            return {
              name: '单价',
              value: Number(item[column.property]),
              selectNum: item['selectNum']
            }
          } else {
            return Number(item[column.property])
          }
        })
        if (!values.every(value => {
          if ((typeof value) === 'object') {
            return false
          } else {
            return isNaN(value)
          }
        })) {
          sums[index] = values.reduce((prev, curr) => {
            if ((typeof values[0]) === 'object') {
              if (values[0].name === '单价') {
                let value = Number(curr.value)
                if (!isNaN(value)) {
                  return prev + (curr.value * curr.selectNum)
                } else {
                  return prev
                }
              } else {
                let value = Number(curr.num)
                if (!isNaN(value)) {
                  return prev + curr.num
                } else {
                  return prev
                }
              }
            } else {
              let value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }
          }, 0)
          if ((typeof values[0]) === 'object') {
            if (values[0].name === '单价') {
              sums[index] = sums[index].toFixed(2)
              this.totalMoney = sums[index]
              sums[index] += ' 元'
            } else {
              sums[index] += ' 件'
            }
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style lang='less' scoped>
#treat {
  height: 100%;
  padding-top: 100px;
  display: flex;
  justify-content: space-around;
  .treatForm {
    max-width: 800px;
    min-width: 600px;
    width: 70%;
  }
}

section {
  display: flex;
  justify-content: space-around;
  div {
    width: 20%;
    height: 15%;
    padding: 9% 0;
    background-color: rgba(35, 181, 171, 1);
    border-radius: 15px;
    color: #fff;
    font-size: 30px;
    cursor: pointer;
  }
  div:hover {
    background-color: rgba(35, 181, 171, .7);
  }
}

.el-dropdown-link {
    cursor: pointer;
    color: rgba(35, 181, 171, 1);
}

.el-icon-arrow-down {
  font-size: 30px;
}

.el-autocomplete {
  width: 583.33px;
}

.drugSearchResults {
  li {
    line-height: normal;
    padding: 7px;

    .name .num {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .useDetail,.factory {
      font-size: 12px;
      color: #b4b4b4;
    }
    .factory {
      float: right;
    }
    .num {
      float: right;
    }
  }
}

.el-icon-circle-close {
  cursor: pointer;
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

.deleteButton {
  position: relative;
  float: right;
  right: 12px;
  bottom: 45px;
  z-index: 999;
}

.diseaseInfo {
  width: 100% !important;
  border-bottom:1px solid #d9d9d9;
  padding-bottom: 20px;
}

.selectNum {
  width: 55px !important;
}

.el-input .el-input__inner {
    padding: 0 !important;
  }
</style>

