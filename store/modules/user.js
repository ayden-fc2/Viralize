/**
 * 用户状态管理
 */
const TOKEN_KEY = 'user-token'  // 与老应用保持一致
const USER_INFO_KEY = 'userInfo'

const state = {
  token: uni.getStorageSync(TOKEN_KEY) || '',
  userInfo: uni.getStorageSync(USER_INFO_KEY) || null
}

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
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
  
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    if (userInfo) {
      uni.setStorageSync(USER_INFO_KEY, userInfo)
    } else {
      uni.removeStorageSync(USER_INFO_KEY)
    }
  },
  
  CLEAR_USER_DATA(state) {
    state.token = ''
    state.userInfo = null
    uni.removeStorageSync(TOKEN_KEY)
    uni.removeStorageSync(USER_INFO_KEY)
  }
}

const actions = {
  // 设置 token
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  
  // 设置用户信息
  setUserInfo({ commit }, userInfo) {
    commit('SET_USER_INFO', userInfo)
  },
  
  // 清除所有用户信息
  clearAllUserInfo({ commit }) {
    commit('CLEAR_USER_DATA')
  },
  
  // 登出
  logout({ commit }) {
    commit('CLEAR_USER_DATA')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

