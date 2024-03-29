import Vue from 'vue'
import Vuex from 'vuex'
import { auth } from './auth_module'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth
  },
  plugins: [createPersistedState()]
})
