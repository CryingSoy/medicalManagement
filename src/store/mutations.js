import getters from './getters'
const state = {
  // 是否打开登录窗口
  isShowLoginWindow: false
}
const mutations = {
  openLoginWindow (state) {
    state.isShowLoginWindow = true
  },
  closeLoginWindow (state) {
    state.isShowLoginWindow = false
  }
}
export default {
  state,
  mutations,
  getters
}
