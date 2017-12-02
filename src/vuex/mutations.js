import getters from './getters'
const state = {
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
