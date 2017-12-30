<template>
  <div class="container" v-show="showCard">
    <el-card class="box-card">
      <div class="card-header" slot="header">
        <span>校医状态</span>
        <el-button style="float: right" size="mini" type="danger" @click="showCard = !showCard">关闭</el-button>
      </div>
      <div class="text item">
        <p v-show="treating.length === 0">没校医坐镇中哦~</p>
        <div class="treating">
          <p>校医坐镇中：</p>
          <p v-for="(t, i) in treating" :key="'t' + i">{{(i + 1) + '：' + t.username}}</p>
        </div>
        <div class="treating">
          <p>休息中：</p>
          <p v-for="(r, ind) in resting" :key="'r' + ind">{{(ind = 1) + '：' + r.username}}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'doctorStatus',
  data () {
    return {
      showCard: true,
      treating: [],
      resting: []
    }
  },
  mounted () {
    this.$axios.get('http://localhost:3000/getDoctorStatus', {
      params: {
        status: 12
      }
    }).then(res => {
      if (res.status === 200 && res.statusText === 'OK') {
        if (res.data.code === 1) {
          res.data.data.forEach(e => {
            if (e.status === 1) this.treating.push(e)
            if (e.status === 2) this.resting.push(e)
          })
        } else {
          this.$message.error(res.data.msg)
        }
      } else {
        this.$message.error('网络错误')
      }
    })
  }
}
</script>

<style lang="less" scoped>
.container {
  position: fixed;
  top: 100px;
  right: 10px;
  span {
    color: #24B4AA;
  }
  .box-card {
    width: 200px;
    text-align: left;
  }
  .text {
    color: #999;
  }
}
</style>
