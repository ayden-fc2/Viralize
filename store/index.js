/**
 * Vuex Store
 */
import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import projects from './modules/projects'
import community from './modules/community'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    projects,
    community
  }
})

export default store
