<template>
  <div id="doctorNav">
    <el-radio-group v-model="isCollapse" class="radio-group">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>
    <el-menu default-active="treat" class="el-menu-vertical-demo menu" @select="select" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
      <el-menu-item index="treat">
        <i class="el-icon-tickets"></i>
        <span slot="title">就诊页面</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-search"></i>
          <span slot="title">药物管理</span>
        </template>
          <el-menu-item index="drug-entry">药品录入</el-menu-item>
          <el-menu-item index="drug-search">药品查询</el-menu-item>
          <el-menu-item index="2-3">药品流向</el-menu-item>
      </el-submenu>
      <el-menu-item index="doctor-info">
        <i class="el-icon-menu"></i>
        <span slot="title">个人信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'doctorNav',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {},
    select (index) {
      if (index === 'drug-entry') {
        this.$router.push({
          path: '/doctorPage/drugEntry'
        })
      } else if (index === 'treat') {
        this.$router.push({
          path: '/doctorPage/treat'
        })
      } else if (index === 'drug-search') {
        this.$router.push({
          path: '/doctorPage/drugSearch'
        })
      } else if (index === 'doctor-info') {
        this.$router.push({
          path: '/doctorPage/doctorInfo'
        })
      }
    }
  }
}
</script>


<style lang="less" scoped>
#doctorNav {
  .radio-group {
    position: fixed;
    left: 0;
    top: 150px;
  }
  .menu {
    position: fixed;
    left: 0;
    top: 190px;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>
