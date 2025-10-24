/**
 * 网络请求封装
 */

// 默认配置 - 与老应用保持一致
const IS_DEV = process.env.NODE_ENV === 'development'
const BASE_URL = IS_DEV ? 'https://genshot.ai/agent/api/v1' : 'https://genshot.ai/agent/api/v1'
const TIMEOUT = 100000

/**
 * 封装 uni.request
 */
function request(options) {
  return new Promise((resolve, reject) => {
    // 从 storage 获取 token - 使用与老应用相同的键名
    const token = uni.getStorageSync('user-token') || uni.getStorageSync('token')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      timeout: options.timeout || TIMEOUT,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // Token 失效，清除本地 token 并跳转登录页
          uni.removeStorageSync('user-token')
          uni.removeStorageSync('token')
          console.warn('认证失败，跳转到登录页面')
          uni.reLaunch({
            url: '/pages/hello/hello'
          })
          reject({
            code: 401,
            message: 'Invalid Token'
          })
        } else {
          reject({
            code: res.statusCode,
            message: res.data?.message || '请求失败'
          })
        }
      },
      fail: (err) => {
        console.error('Request failed:', err)
        reject({
          code: -1,
          message: err.errMsg || '网络请求失败'
        })
      }
    })
  })
}

/**
 * GET 请求
 */
export function get(url, data, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE 请求
 */
export function del(url, data, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}

export default request

