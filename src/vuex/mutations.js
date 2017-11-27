import getters from './getters'
const state = {
    num: 100
}
const mutations = {
    jiayi(state) {
        state.num++;
    }
}
export default {
    state,
    mutations,
    getters
}