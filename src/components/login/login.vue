<template>
  <el-dialog title="登录窗口" :visible="isShowLoginWindow" :before-close="colseLogin" center>
    <div slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
      <el-button class="success-btn" type="success">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  methods: {
    colseLogin () {
      this.$store.dispatch('closeLoginWindow')
    }
  },
  computed: {
    ...mapGetters([
      'isShowLoginWindow'
    ])
  }
}
</script>

<style lang="less">
.success-btn {
  background-color: #24b4aa;
  border-color: #24b4aa;
}
</style>
