export default {
  // 开启登录窗口
  openLoginWindow ({ commit }) {
    commit('openLoginWindow')
  },
  // 关闭登录窗口
  closeLoginWindow ({ commit }) {
    commit('closeLoginWindow')
  },
  // 开启注册窗口
  openRegWindow ({ commit }) {
    commit('openRegWindow')
  },
  // 关闭注册窗口
  closeRegWindow ({ commit }) {
    commit('closeRegWindow')
  }
}
