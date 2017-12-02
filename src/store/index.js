import vue from 'vue'
import vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

vue.use(vuex)

export default new vuex.Store({
  actions,
  modules: {
    mutations
  }
})
