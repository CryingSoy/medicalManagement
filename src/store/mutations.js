import getters from './getters'
const state = {
  // 是否打开登录窗口
  isShowLoginWindow: false,
  isShowRegWindow: false
}
const mutations = {
  openLoginWindow (state) {
    state.isShowLoginWindow = true
  },
  closeLoginWindow (state) {
    state.isShowLoginWindow = false
  },
  openRegWindow (state) {
    state.isShowRegWindow = true
  },
  closeRegWindow (state) {
    state.isShowRegWindow = false
  }
}
export default {
  state,
  mutations,
  getters
}
