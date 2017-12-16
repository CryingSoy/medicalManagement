<template>
  <div id="doctor">
    <my-header></my-header>
    <section>
      <div @click="goTreat">开始就诊</div>
      <div>学生信息管理</div>
      <div>药品信息管理</div>
      <div>就诊信息管理</div>
    </section>
  </div>
</template>

<script>
import myHeader from '../../components/header/Header.vue'
import myFooter from '../../components/footer/footer.vue'
export default {
  name: 'doctorPage',
  methods: {
    goTreat () {
      this.$router.push({
        path: '/treat'
      })
    }
  },
  components: {
    myHeader,
    myFooter
  }
}
</script>

<style lang="less" scoped>
#doctor {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content:center;
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
</style>

