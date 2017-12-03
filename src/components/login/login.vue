<template>
  <el-dialog title="登录窗口" :visible="isShowLoginWindow" :before-close="colseLogin" center>
    <el-form label-position="left" label-width="80px">
      <el-form-item label="用户类型">
        <el-select placeholder="用户类型" v-model="userType">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button class="default-btn">取 消</el-button>
      <el-button class="success-btn" type="success">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      userType: '',
      userOptions: [{
        value: '选项1',
        label: '我是校医'
      },
      {
        value: '选项2',
        label: '我是学生'
      },
      {
        value: '选项3',
        label: '我是教师'
      }]
    }
  },
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
  background-color: #24b4aa !important;
  border-color: #24b4aa !important;
}

.success-btn:hover {
  background-color: #24b4aa;
  border-color: #24b4aa;
  opacity: .8;
}

</style>
