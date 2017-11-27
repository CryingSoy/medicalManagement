import vue from 'vue'
import vuex from 'vuex'
vue.use(vuex);

import actions from './actions'
import mutations from './mutations'

export default new vuex.Store({
    actions,
    modules: {
        mutations
    }
});