<template>
    <div id="index">
        <my-header></my-header>
        <section>
          <div @click="goDoctor">校医点这</div>
          <div @click="goStudent">学生点这</div>
          <div @click="goTeacher">教师点这</div>
        </section>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
          <span>{{ dialogInfo }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
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
    return {
      dialogVisible: false,
      dialogInfo: ''
    }
  },
  components: {
    myHeader,
    myFooter
  },
  methods: {
    goDoctor () {
      if (this.userInfo.typ !== '校医') {
        this.dialogVisible = true
        if (this.isShowUserInfo === true) {
          this.dialogInfo = '用户类型错误'
        } else {
          this.dialogInfo = '请登录'
        }
      } else {
        this.$router.push({
          path: '/doctorPage'
        })
      }
    },
    goStudent () {
      if (this.userInfo.typ !== '学生') {
        this.dialogVisible = true
        if (this.isShowUserInfo === true) {
          this.dialogInfo = '用户类型错误'
        } else {
          this.dialogInfo = '请登录'
        }
      } else {
        this.$router.push({
          path: '/studentPage'
        })
      }
    },
    goTeacher () {
      if (this.userInfo.typ !== '教师') {
        this.dialogVisible = true
        if (this.isShowUserInfo === true) {
          this.dialogInfo = '用户类型错误'
        } else {
          this.dialogInfo = '请登录'
        }
      } else {
        this.$router.push({
          path: '/teacherPage'
        })
      }
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