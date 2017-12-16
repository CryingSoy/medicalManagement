<template>
  <div class="container">
    <h3 class="title">药物录入</h3>
    <div class="query">
      <el-autocomplete class="inline-input" v-model="drug" :fetch-suggestions="queryDrug" placeholder="请扫药品条形码" @select="handleSelect">
        <i class="el-icon-edit el-input__icon" slot="suffix"></i>
        <template slot-scope="props">
          <div class="name">{{ props.item.name }}</div>
          <span class="barCode">{{ props.item.barCode }}</span>
        </template>
      </el-autocomplete>
      <el-button type="primary">查询</el-button>
    </div>
    <div class="durg-form">
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'drugEntry',
  data () {
    return {
      drug: '',
      drugs: [
        {
          name: '感冒灵',
          barCode: '123123123'
        },
        {
          name: '感冒灵',
          barCode: '123123123'
        }
      ]
    }
  },
  methods: {
    queryDrug (drugName, callback) {
      let durgList = this.drugs
      let result = drugName ? durgList.filter(this.createFilter(drugName)) : durgList
      callback(result)
    },
    createFilter (drugName) {
      return (drugName) => {
        return true
      }
    },
    handleSelect () {
    }
  }
}
</script>


<style lang="less" scoped>
.container {
  max-width: 1120px;
  margin: 0 auto;
  text-align: left;
  .title {
    font-size: 24px;
    color: #24B4AA;
    margin-top: 50px;
  }
  .query {
    li {
      line-height: normal;
      padding: 7px;
    }
    .inline-input {
      margin-top: 20px;
    }
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .barCode {
      font-size: 12px;
      color: #b4b4b4;
    }
    .highlighted .barCode {
      color: #ddd;
    }
  }
}
</style>
