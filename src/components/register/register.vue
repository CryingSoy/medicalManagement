<template>
  <el-dialog title="注册  窗口" :visible="isShowRegWindow" :before-close="colseReg" center width="500px">
    <el-form label-position="left" label-width="80px">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="default-btn" @click="colseReg">取 消</el-button>
      <el-button class="success-btn" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'register',
  methods: {
    colseReg () {
      this.$store.dispatch('closeRegWindow')
    }
  },
  computed: {
    ...mapGetters([
      'isShowRegWindow'
    ])
  }
}
</script>

<style lang="less">
</style>
