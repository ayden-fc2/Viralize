/**
 * 用户状态管理 - 只保留 token
 */
const TOKEN_KEY = 'user-token'  // 与老应用保持一致

const state = {
  token: uni.getStorageSync(TOKEN_KEY) || ''
}

const getters = {
  token: state => state.token,
  isLoggedIn: state => !!state.token
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      uni.setStorageSync(TOKEN_KEY, token)
    } else {
      uni.removeStorageSync(TOKEN_KEY)
    }
  },
  
  CLEAR_TOKEN(state) {
    state.token = ''
    uni.removeStorageSync(TOKEN_KEY)
  }
}

const actions = {
  // 设置 token
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  
  // 清除 token
  clearToken({ commit }) {
    commit('CLEAR_TOKEN')
  },
  
  // 登出
  logout({ commit }) {
    commit('CLEAR_TOKEN')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

