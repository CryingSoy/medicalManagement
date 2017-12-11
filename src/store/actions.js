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
  },
  // 保存Token
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  // 显示登陆信息
  openUserInfo ({ commit }) {
    commit('openUserInfo')
  },
  // 关闭登陆信息
  closeUserInfo ({ commit }) {
    commit('closeUserInfo')
  },
  // 保存用户信息
  setUserInfo ({ commit }, userInfo) {
    commit('setUserInfo', userInfo)
  }
}
