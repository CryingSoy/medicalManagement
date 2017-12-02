<template>
  <el-dialog title="登录窗口" :visible="isShowLoginWindow" :before-close="colseLogin">
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
