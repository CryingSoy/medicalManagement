import getters from './getters'
const state = {
  // 是否打开登录窗口
  isShowLoginWindow: false,
  isShowRegWindow: false,
  token: '',
  isShowUserInfo: false,
  userInfo: {}
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
  },
  setToken (state, token) {
    state.token = token
  },
  getToken (state) {
    return state.token
  },
  openUserInfo (state) {
    state.isShowUserInfo = true
  },
  closeUserInfo (state) {
    state.isShowUserInfo = false
    localStorage.siseToken = ''
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
    if (state.userInfo.typ === 'doctor') {
      state.userInfo.typ = '校医'
    } else if (state.userInfo.typ === 'student') {
      state.userInfo.typ = '学生'
    } else if (state.userInfo.typ === 'teacher') {
      state.userInfo.typ = '教师'
    }
  }
}
export default {
  state,
  mutations,
  getters
}
