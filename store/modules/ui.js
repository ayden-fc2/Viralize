/**
 * UI 状态管理
 */
const state = {
  showTabbar: true
}

const mutations = {
  SET_TABBAR_VISIBILITY(state, visible) {
    state.showTabbar = visible
  }
}

const actions = {
  showTabbar({ commit }) {
    commit('SET_TABBAR_VISIBILITY', true)
  },
  
  hideTabbar({ commit }) {
    commit('SET_TABBAR_VISIBILITY', false)
  }
}

const getters = {
  showTabbar: state => state.showTabbar
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

