<template>
    <div id="index">
        <my-header></my-header>
        <section>
          <div @click="goDoctor">校医点这</div>
          <div @click="goStudent">学生点这</div>
          <div @click="goTeacher">教师点这</div>
        </section>
        <my-footer></my-footer>
    </div>
</template>

<script>
import myHeader from '../../components/header/header.vue'
import myFooter from '../../components/footer/footer.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'index',
  data () {
    return {}
  },
  components: {
    myHeader,
    myFooter
  },
  methods: {
    goDoctor () {
      this.$router.push({
        path: '/doctorPage/doctorInfo'
      })
    },
    goStudent () {
      this.$router.push({
        path: '/studentPage'
      })
    },
    goTeacher () {
      this.$router.push({
        path: '/teacherPage'
      })
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'isShowUserInfo'
    ])
  }
}
</script>

<style lang="less" scoped>
#index {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content:center;
}
section {
  display: flex;
  justify-content: space-around;
  div {
    width: 25%;
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