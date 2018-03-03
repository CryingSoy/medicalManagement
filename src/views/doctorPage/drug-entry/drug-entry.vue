<template>
  <div class="container">
    <h3 class="title">药物录入</h3>
    <div class="query">
      <el-autocomplete class="inline-input" popper-class="drugSearchResults" v-model="drug" :fetch-suggestions="queryDrug" :autofocus="true" placeholder="请扫药品条形码或输入药物名称" @select="handleSelect">
        <i class="el-icon-edit el-input__icon" slot="suffix"></i>
        <template slot-scope="props">
          <div class="name">{{ props.item.name }}<span v-if="props.item.hasOwnProperty('barCode')" class="barCode">[{{ props.item.barCode }}]</span><div class="num">x{{ props.item.num }}</div></div>
          <span class="useDetail">{{ props.item.useDetail }}</span>
          <span class="factory">{{ props.item.factory }}</span>
        </template>
      </el-autocomplete>
      <el-button type="primary" @click="checkStr">查询</el-button>
      <el-button @click="reset" style="margin-left: 0px">重置</el-button>
      <el-alert :title="alertInfo" type="success" class="alert-info" v-show="showAlertInfo" @close="closeAlertInfo"></el-alert>
    </div>
    <div class="drug-form">
      <el-form ref="form" :model="drugData" label-position="right" label-width="80px" :rules="rules">
        <el-form-item label="药物名称" prop="name">
          <el-input v-model="drugData.name" class="el-input" clearable placeholder="请输入药物名称"></el-input>
        </el-form-item>
        <el-form-item label="条形码" prop="barCode">
          <el-input v-model="drugData.barCode" class="el-input" clearable placeholder="请输入药物条形码"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="money">
          <el-input type="number" v-model="drugData.money" class="el-input" clearable placeholder="请输入药物单价"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="factory">
          <el-input v-model="drugData.factory" class="el-input" clearable placeholder="请输入药物生产厂商"></el-input>
        </el-form-item>
        <el-form-item label="存入数量" prop="inNum">
          <el-input-number v-model="drugData.inNum" @change="handleChange" :min="1" :max="999" label="存入数量"></el-input-number>
          <span class="lastDrugNum-span">库存数量</span>
          <el-input placeholder="库存数量" v-model="lastDrugNum" :disabled="true" class="lastDrugNum"></el-input>
        </el-form-item>
        <el-form-item label="录入时间" prop="storeTime">
          <el-date-picker v-model="drugData.storeTime" type="datetime" placeholder="请输入药品录入时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="药物用法" prop="useDetail">
          <el-input v-model="drugData.useDetail" class="el-input" clearable placeholder="请输入药物用法"></el-input>
        </el-form-item>
        <el-form-item label="药物简介" prop="introduce">
          <el-input type="textarea" v-model="drugData.introduce" class="el-input" placeholder="请输入药物简介"></el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button type="primary" @click="submitDrugData">录入药品</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'drugEntry',
  data () {
    return {
      drug: '',
      drugs: [],
      drugData: {
        factory: '',
        introduce: '',
        useDetail: '',
        storeTime: new Date()
      },
      lastDrugNum: 0,
      rules: {
        name: [
          { required: true, message: '请输入药品名称', trigger: 'blur' }
        ],
        barCode: [
          { required: true, message: '请输入药品条形码', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入药品单价', trigger: 'blur' }
        ],
        storeTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ],
        inNum: [
          { required: true, message: '请输入存入数量', trigger: 'change' }
        ]
      },
      alertInfo: '数据库不存在该条形码的药品，请准确填写药品信息。',
      showAlertInfo: false
    }
  },
  methods: {
    queryDrug (str, callback) {
      let drugList = this.drugs
      let result = str ? drugList.filter(this.createFilter(str)) : drugList
      callback(result)
    },
    createFilter (str) {
      return element => {
        return element.barCode.indexOf(str) !== -1 || element.name.indexOf(str) !== -1
      }
    },
    handleSelect (item) {
      this.drug = `${item.name}[${item.barCode}]`
      this.drugData.name = item.name
      this.drugData.barCode = item.barCode
      this.drugData.money = item.money
      this.drugData.factory = item.factory
      this.drugData.useDetail = item.useDetail
      this.drugData.introduce = item.introduce
      this.lastDrugNum = item.num
      this.showAlertInfo = true
      this.alertInfo = `药品${item.name}[${item.barCode}]信息已存在数据库，更改以下某一条信息，都会影响到数据库。如只需添加库存，建议只更改存入数量。`
    },
    queryDrugData (durgname) {
      this.$axios.post('http://localhost:3000/drugSearch', {
        searchItem: durgname
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK' && res.data.code === 1) {
          this.drugs = res.data.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleChange (value) {
    },
    submitDrugData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.drugData.inNum = this.drugData.inNum.toString()
          this.drugData.inputer = this.userInfo.name
          this.$axios.post('http://localhost:3000/saveDrugData', this.drugData).then(res => {
            if (res.status === 200 && res.statusText === 'OK' && res.data.code === 1) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.queryDrugData()
              setTimeout(() => {
                this.reset()
              }, 1500)
            }
          })
        } else {
          console.log('输入错误')
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
      this.drug = ''
      this.lastDrugNum = 0
    },
    closeAlertInfo () {
      this.showAlertInfo = false
    },
    checkStr () {
      this.queryDrugData(this.drug)
    }
  },
  mounted () {
    this.queryDrugData()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>


<style lang="less" scoped>
.container {
  width: 800px;
  margin: 0 auto;
  text-align: left;
  // padding-left: 200px;
  .title {
    font-size: 24px;
    color: #24B4AA;
    margin-top: 50px;
  }
  .query {
    .inline-input {
      width: 500px;
      margin: 20px 0 0 80px;
    }
    .alert-info {
      width: 480px;
      margin: 10px 0 0 80px;
    }
  }
  .drug-form {
    margin-top: 10px;
    .el-input {
      width: 500px;
    }
    .lastDrugNum-span {
      margin-left: 30px;
    }
    .lastDrugNum {
      width: 60px;
      margin-left: 10px;
    }
    .submit-btn {
      width: 580px;
      text-align: center;
    }
  }
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
</style>
