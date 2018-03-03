<template>
  <div class="container">
    <h3 class="title">药物查询</h3>
    <el-input class="inline-input" placeholder="请扫药品条形码或输入药物名称" v-model="drug" clearable @keyup.native="changeDrugTable"></el-input>
    <el-button type="primary" @click="searchDurg">查询</el-button>
    <el-button style="margin-left: 0px">重置</el-button>
    <el-table :data="drugData" style="width: 100%; margin-top: 20px">
      <el-table-column prop="name" label="药物名称" min-width="180px"></el-table-column>
      <el-table-column prop="barCode" label="条形码" min-width="180px"></el-table-column>
      <el-table-column prop="money" label="单价" min-width="100px"></el-table-column>
      <el-table-column prop="num" label="剩余数量" min-width="100px"></el-table-column>
      <el-table-column prop="useDetail" label="使用详情" min-width="120px"></el-table-column>
      <el-table-column prop="factory" label="生产厂商" min-width="120px"></el-table-column>
      <el-table-column label="操作" min-width="200px">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除药物</el-button>
      </template>
      </el-table-column>
    </el-table>
    <el-dialog title="更改药物信息" :visible="isShowDrugChange" center :modal-append-to-body="false" :before-close="closeDrugChange">
      <el-form ref="form" :model="changeDrugData" label-position="right" label-width="80px" :rules="rules">
        <el-form-item label="条形码" prop="barCode">
          <el-input :disabled="true" v-model="changeDrugData.barCode" class="el-input" clearable placeholder="请输入药物条形码"></el-input>
        </el-form-item>
        <el-form-item label="药物名称" prop="name">
          <el-input v-model="changeDrugData.name" class="el-input" clearable placeholder="请输入药物名称"></el-input>
        </el-form-item>
        <el-form-item label="单价" prop="money">
          <el-input type="number" v-model="changeDrugData.money" class="el-input" clearable placeholder="请输入药物单价"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="num">
          <el-input type="number" v-model="changeDrugData.num" class="el-input" clearable placeholder="请输入药物单价"></el-input>
        </el-form-item>
        <el-form-item label="生产厂商" prop="factory">
          <el-input v-model="changeDrugData.factory" class="el-input" clearable placeholder="请输入药物生产厂商"></el-input>
        </el-form-item>
        <el-form-item label="更改时间" prop="storeTime">
          <el-date-picker v-model="changeDrugData.storeTime" type="datetime" placeholder="请输入药品录入时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="药物用法" prop="useDetail">
          <el-input v-model="changeDrugData.useDetail" class="el-input" clearable placeholder="请输入药物用法"></el-input>
        </el-form-item>
        <el-form-item label="药物简介" prop="introduce">
          <el-input type="textarea" v-model="changeDrugData.introduce" class="el-input" placeholder="请输入药物简介"></el-input>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button type="primary" @click="submitChangeDrugData">更改药品信息</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'drug-search',
  data () {
    return {
      drug: '',
      drugData: [],
      _drugData: [],
      keyupFlag: false,
      isShowDrugChange: false,
      changeDrugData: {
        storeTime: new Date()
      },
      _changeDrugData: {},
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
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    searchDurg () {
      this.fetchDrugData(this.drug)
    },
    fetchDrugData (drugName) {
      this.$axios.post('http://localhost:3000/drugSearch', {
        searchItem: drugName
      }).then(res => {
        if (res.status === 200 && res.statusText === 'OK' && res.data.code === 1) {
          this.drugData = res.data.data
          this._drugData = res.data.data
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    handleEdit (index, row) {
      this.isShowDrugChange = true
      this.changeDrugData = deepCopy(row)
      this.changeDrugData.storeTime = new Date()
      this._changeDrugData = deepCopy(this.changeDrugData)
    },
    closeDrugChange () {
      this.isShowDrugChange = false
    },
    submitChangeDrugData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (JSON.stringify(this._changeDrugData) === JSON.stringify(this.changeDrugData)) {
            this.$message({
              message: '药品信息没有发生改变',
              type: 'error'
            })
          } else {
            this.$axios.post('http://localhost:3000/changeDrugData', this.changeDrugData).then(res => {
              if (res.status === 200 && res.statusText === 'OK' && res.data.code === 1) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                setTimeout(() => {
                  this.isShowDrugChange = false
                  this.changeDrugData = {}
                  this._changeDrugData = {}
                  this.fetchDrugData()
                }, 1000)
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    reset () {
    },
    handleDelete (index, row) {
      this.$confirm('此操作将把数据库的药品信息全部删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:3000/deleteDrug', {
          barCode: row.barCode
        }).then(res => {
          if (res.status === 200 && res.statusText === 'OK' && res.data.code === 1) {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.fetchDrugData()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      }).catch(() => {
      })
    },
    changeDrugTable () {
      // 函数节流
      if (!this.keyupFlag) {
        this.keyupFlag = true
        setTimeout(() => {
          if (this.drug === '') this.drugData = this._drugData
          this.drugData = this._drugData.filter(element => {
            return element.barCode.indexOf(this.drug) !== -1 || element.name.indexOf(this.drug) !== -1
          })
          this.keyupFlag = false
        }, 500)
      }
    }
  },
  mounted () {
    this.fetchDrugData()
  }
}
function deepCopy (data) {
  return JSON.parse(JSON.stringify(data))
}
</script>

<style lang="less" scoped>
.container {
  max-width: 100%;
  padding-left: 240px;
  text-align: left;
  .title {
    font-size: 24px;
    color: #24b4aa;
    margin-top: 50px;
  }
}

.inline-input {
  width: 500px;
  margin: 20px 0 0 0;
}
</style>
