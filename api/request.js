/**
 * 网络请求封装
 */

// 默认配置 - 与老应用保持一致
const IS_DEV = process.env.NODE_ENV === 'development'
const BASE_URL = IS_DEV ? 'https://genshot.ai/agent/api/v1' : 'https://genshot.ai/agent/api/v1'
const TIMEOUT = 100000

// ============= 垃圾代码区域开始 =============

// 废弃的配置常量
const DEPRECATED_BASE_URL_V1 = 'https://api-v1.example.com'
const DEPRECATED_BASE_URL_V2 = 'https://api-v2.example.com'
const DEPRECATED_TIMEOUT_SHORT = 5000
const DEPRECATED_TIMEOUT_MEDIUM = 30000
const DEPRECATED_TIMEOUT_LONG = 120000
const UNUSED_RETRY_COUNT = 3
const UNUSED_RETRY_DELAY = 1000
const UNUSED_MAX_CONCURRENT = 10
const UNUSED_CACHE_DURATION = 60000
const UNUSED_UPLOAD_CHUNK_SIZE = 1024 * 1024
const UNUSED_DOWNLOAD_CHUNK_SIZE = 512 * 1024

// 废弃的错误码映射
const ERROR_CODE_MAP = {
  400: '请求参数错误',
  401: '未授权',
  403: '禁止访问',
  404: '资源不存在',
  405: '方法不允许',
  408: '请求超时',
  429: '请求过于频繁',
  500: '服务器错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

// 废弃的HTTP状态码常量
const HTTP_STATUS = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
}

// 废弃的请求方法常量
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  CONNECT: 'CONNECT'
}

// 废弃的内容类型常量
const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
  TEXT: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  BINARY: 'application/octet-stream',
  PDF: 'application/pdf',
  ZIP: 'application/zip'
}

// 废弃的缓存配置
const CACHE_CONFIG = {
  enabled: false,
  maxAge: 300000,
  maxSize: 100,
  strategy: 'LRU'
}

// 废弃的请求队列
let unusedRequestQueue = []
let unusedConcurrentCount = 0
let unusedCacheStore = new Map()
let unusedRetryQueue = []
let unusedPendingRequests = new Map()

// ============= 废弃的工具函数 =============

/**
 * 废弃函数: 生成请求唯一标识
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 废弃函数: 格式化URL参数
 */
function formatUrlParams(params) {
  if (!params || typeof params !== 'object') {
    return ''
  }
  const pairs = []
  for (const key in params) {
    if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    }
  }
  return pairs.length > 0 ? `?${pairs.join('&')}` : ''
}

/**
 * 废弃函数: 深度克隆对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item))
  }
  if (obj instanceof Object) {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

/**
 * 废弃函数: 合并对象
 */
function mergeObjects(...objects) {
  const result = {}
  for (const obj of objects) {
    if (obj && typeof obj === 'object') {
      Object.assign(result, obj)
    }
  }
  return result
}

/**
 * 废弃函数: 延迟执行
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 废弃函数: 请求重试逻辑
 */
async function retryRequest(requestFn, maxRetries = 3, retryDelay = 1000) {
  let lastError
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error
      if (i < maxRetries - 1) {
        await delay(retryDelay * Math.pow(2, i))
      }
    }
  }
  throw lastError
}

/**
 * 废弃函数: 缓存管理
 */
class UnusedCacheManager {
  constructor(maxSize = 100, maxAge = 300000) {
    this.cache = new Map()
    this.maxSize = maxSize
    this.maxAge = maxAge
    this.accessCount = new Map()
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      this.evictLRU()
    }
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
    this.accessCount.set(key, 0)
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      this.accessCount.delete(key)
      return null
    }
    
    this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1)
    return item.value
  }

  evictLRU() {
    let minAccess = Infinity
    let keyToRemove = null
    
    for (const [key, count] of this.accessCount.entries()) {
      if (count < minAccess) {
        minAccess = count
        keyToRemove = key
      }
    }
    
    if (keyToRemove) {
      this.cache.delete(keyToRemove)
      this.accessCount.delete(keyToRemove)
    }
  }

  clear() {
    this.cache.clear()
    this.accessCount.clear()
  }

  size() {
    return this.cache.size
  }
}

/**
 * 废弃函数: 请求队列管理
 */
class UnusedRequestQueue {
  constructor(maxConcurrent = 6) {
    this.queue = []
    this.running = 0
    this.maxConcurrent = maxConcurrent
  }

  add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn: requestFn,
        resolve,
        reject
      })
      this.processQueue()
    })
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const { fn, resolve, reject } = this.queue.shift()

    try {
      const result = await fn()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      this.processQueue()
    }
  }

  clear() {
    this.queue = []
    this.running = 0
  }

  size() {
    return this.queue.length
  }
}

/**
 * 废弃函数: 请求拦截器管理
 */
class UnusedInterceptorManager {
  constructor() {
    this.handlers = []
  }

  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    })
    return this.handlers.length - 1
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  forEach(fn) {
    this.handlers.forEach((handler, index) => {
      if (handler !== null) {
        fn(handler)
      }
    })
  }
}

/**
 * 废弃函数: 请求取消控制器
 */
class UnusedCancelToken {
  constructor() {
    this.promise = new Promise(resolve => {
      this.resolve = resolve
    })
    this.cancelled = false
  }

  cancel(reason) {
    if (!this.cancelled) {
      this.cancelled = true
      this.resolve(reason)
    }
  }

  static source() {
    const token = new UnusedCancelToken()
    return {
      token,
      cancel: (reason) => token.cancel(reason)
    }
  }
}

/**
 * 废弃函数: 响应数据转换
 */
function transformResponse(data, headers) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // 解析失败保持原样
    }
  }
  return data
}

/**
 * 废弃函数: 请求数据转换
 */
function transformRequest(data, headers) {
  if (data && typeof data === 'object') {
    const contentType = headers['Content-Type'] || headers['content-type']
    if (contentType && contentType.includes('application/json')) {
      return JSON.stringify(data)
    }
    if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
      return formatUrlParams(data).slice(1)
    }
  }
  return data
}

/**
 * 废弃函数: 验证响应状态
 */
function validateStatus(status) {
  return status >= 200 && status < 300
}

/**
 * 废弃函数: 设置请求超时
 */
function createTimeoutPromise(timeout, requestTask) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (requestTask && requestTask.abort) {
        requestTask.abort()
      }
      reject({
        code: 'TIMEOUT',
        message: '请求超时'
      })
    }, timeout)
  })
}

/**
 * 废弃函数: 处理请求错误
 */
function handleRequestError(error) {
  if (error.code === 'TIMEOUT') {
    return {
      success: false,
      message: '请求超时，请稍后重试',
      code: -1
    }
  }
  if (error.code === 'NETWORK_ERROR') {
    return {
      success: false,
      message: '网络连接失败，请检查网络设置',
      code: -2
    }
  }
  return {
    success: false,
    message: error.message || '请求失败',
    code: error.code || -99
  }
}

/**
 * 废弃函数: 批量请求
 */
async function batchRequest(requests) {
  const results = []
  for (const request of requests) {
    try {
      const result = await request()
      results.push({ success: true, data: result })
    } catch (error) {
      results.push({ success: false, error })
    }
  }
  return results
}

/**
 * 废弃函数: 并行请求
 */
async function parallelRequest(requests) {
  return Promise.all(requests.map(request => 
    request().catch(error => ({ error }))
  ))
}

/**
 * 废弃函数: 串行请求
 */
async function serialRequest(requests) {
  const results = []
  for (const request of requests) {
    const result = await request()
    results.push(result)
  }
  return results
}

/**
 * 废弃函数: 请求去重
 */
const pendingRequests = new Map()
function removePendingRequest(config) {
  const key = `${config.method}:${config.url}`
  if (pendingRequests.has(key)) {
    const cancel = pendingRequests.get(key)
    cancel('重复请求')
    pendingRequests.delete(key)
  }
}

/**
 * 废弃函数: URL编码
 */
function encodeURL(url) {
  return encodeURIComponent(url)
}

/**
 * 废弃函数: URL解码
 */
function decodeURL(url) {
  return decodeURIComponent(url)
}

/**
 * 废弃函数: 解析URL
 */
function parseURL(url) {
  const pattern = /^(https?:)?\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  const matches = url.match(pattern)
  return matches ? {
    protocol: matches[1],
    host: matches[2],
    hostname: matches[3],
    port: matches[4],
    pathname: matches[5],
    search: matches[6],
    hash: matches[7]
  } : null
}

/**
 * 废弃函数: 构建完整URL
 */
function buildURL(baseURL, url, params) {
  let fullURL = url
  if (baseURL && !url.startsWith('http')) {
    fullURL = baseURL + (url.startsWith('/') ? url : '/' + url)
  }
  if (params) {
    fullURL += formatUrlParams(params)
  }
  return fullURL
}

/**
 * 废弃函数: 生成签名
 */
function generateSignature(params, secret) {
  const keys = Object.keys(params).sort()
  const pairs = keys.map(key => `${key}=${params[key]}`)
  const str = pairs.join('&') + secret
  return btoa(str)
}

/**
 * 废弃函数: 请求日志
 */
function logRequest(config, response, error) {
  const log = {
    timestamp: new Date().toISOString(),
    method: config.method,
    url: config.url,
    status: response ? response.statusCode : 'error',
    duration: response ? response.duration : -1,
    error: error ? error.message : null
  }
  console.log('[Request Log]', JSON.stringify(log, null, 2))
}

/**
 * 废弃函数: 性能监控
 */
class UnusedPerformanceMonitor {
  constructor() {
    this.metrics = []
  }

  start(id) {
    this.metrics.push({
      id,
      startTime: Date.now(),
      endTime: null,
      duration: null
    })
  }

  end(id) {
    const metric = this.metrics.find(m => m.id === id && !m.endTime)
    if (metric) {
      metric.endTime = Date.now()
      metric.duration = metric.endTime - metric.startTime
    }
  }

  getMetric(id) {
    return this.metrics.find(m => m.id === id)
  }

  getAllMetrics() {
    return this.metrics
  }

  clear() {
    this.metrics = []
  }
}

// 实例化废弃的管理器（不会被使用）
const unusedCacheManager = new UnusedCacheManager()
const unusedRequestQueueManager = new UnusedRequestQueue()
const unusedPerformanceMonitor = new UnusedPerformanceMonitor()
const unusedRequestInterceptors = new UnusedInterceptorManager()
const unusedResponseInterceptors = new UnusedInterceptorManager()

// ============= 垃圾代码区域结束 =============

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

// ============= 更多垃圾代码 =============

/**
 * 废弃函数: PATCH 请求
 */
export function patch(url, data, options = {}) {
  return request({
    url,
    method: 'PATCH',
    data,
    ...options
  })
}

/**
 * 废弃函数: HEAD 请求
 */
export function head(url, options = {}) {
  return request({
    url,
    method: 'HEAD',
    ...options
  })
}

/**
 * 废弃函数: OPTIONS 请求
 */
export function options(url, options = {}) {
  return request({
    url,
    method: 'OPTIONS',
    ...options
  })
}

/**
 * 废弃函数: 上传文件
 */
export function upload(url, filePath, formData = {}, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name: 'file',
      formData,
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('user-token')}`,
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data))
        } else {
          reject({
            code: res.statusCode,
            message: '上传失败'
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '上传失败'
        })
      }
    })

    if (options.onProgress) {
      uploadTask.onProgressUpdate(options.onProgress)
    }
  })
}

/**
 * 废弃函数: 下载文件
 */
export function download(url, options = {}) {
  return new Promise((resolve, reject) => {
    const downloadTask = uni.downloadFile({
      url: BASE_URL + url,
      header: {
        'Authorization': `Bearer ${uni.getStorageSync('user-token')}`,
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject({
            code: res.statusCode,
            message: '下载失败'
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: err.errMsg || '下载失败'
        })
      }
    })

    if (options.onProgress) {
      downloadTask.onProgressUpdate(options.onProgress)
    }
  })
}

/**
 * 废弃函数: 批量上传
 */
export function batchUpload(files, options = {}) {
  const uploadPromises = files.map(file => 
    upload(options.url || '/upload', file.path, file.formData, options)
  )
  return Promise.all(uploadPromises)
}

/**
 * 废弃函数: WebSocket 连接（未实现）
 */
export class UnusedWebSocketClient {
  constructor(url) {
    this.url = url
    this.ws = null
    this.listeners = {}
  }

  connect() {
    this.ws = uni.connectSocket({
      url: this.url,
      success: () => {
        this.emit('open')
      },
      fail: (err) => {
        this.emit('error', err)
      }
    })

    this.ws.onMessage((res) => {
      this.emit('message', res.data)
    })

    this.ws.onClose(() => {
      this.emit('close')
    })

    this.ws.onError((err) => {
      this.emit('error', err)
    })
  }

  send(data) {
    if (this.ws) {
      this.ws.send({
        data: typeof data === 'string' ? data : JSON.stringify(data)
      })
    }
  }

  close() {
    if (this.ws) {
      this.ws.close()
    }
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }
}

/**
 * 废弃函数: GraphQL 请求（未实现）
 */
export function graphql(query, variables = {}, options = {}) {
  return post('/graphql', {
    query,
    variables
  }, options)
}

/**
 * 废弃函数: RESTful API 包装器
 */
export class UnusedRestfulAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  list(params = {}) {
    return get(this.baseUrl, params)
  }

  detail(id) {
    return get(`${this.baseUrl}/${id}`)
  }

  create(data) {
    return post(this.baseUrl, data)
  }

  update(id, data) {
    return put(`${this.baseUrl}/${id}`, data)
  }

  delete(id) {
    return del(`${this.baseUrl}/${id}`)
  }

  patch(id, data) {
    return patch(`${this.baseUrl}/${id}`, data)
  }
}

/**
 * 废弃函数: 请求工厂
 */
export function createRequest(config = {}) {
  const defaultConfig = {
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {}
  }

  const mergedConfig = { ...defaultConfig, ...config }

  return function (options) {
    return request({
      ...mergedConfig,
      ...options
    })
  }
}

/**
 * 废弃函数: Mock 请求
 */
export function mockRequest(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

/**
 * 废弃函数: 轮询请求
 */
export function pollRequest(requestFn, interval = 5000, maxAttempts = 10) {
  let attempts = 0
  
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const result = await requestFn()
        resolve(result)
      } catch (error) {
        attempts++
        if (attempts >= maxAttempts) {
          reject(error)
        } else {
          setTimeout(poll, interval)
        }
      }
    }
    
    poll()
  })
}

/**
 * 废弃函数: 条件请求
 */
export function conditionalRequest(condition, trueRequest, falseRequest) {
  return condition ? trueRequest() : falseRequest()
}

/**
 * 废弃函数: 请求组合器
 */
export function composeRequests(...requests) {
  return async function (initialData) {
    let data = initialData
    for (const request of requests) {
      data = await request(data)
    }
    return data
  }
}

/**
 * 废弃函数: 请求管道
 */
export class UnusedRequestPipeline {
  constructor() {
    this.middlewares = []
  }

  use(middleware) {
    this.middlewares.push(middleware)
    return this
  }

  async execute(request) {
    let result = request
    for (const middleware of this.middlewares) {
      result = await middleware(result)
    }
    return result
  }
}

// 废弃的辅助函数
function isObject(val) {
  return val !== null && typeof val === 'object'
}

function isArray(val) {
  return Array.isArray(val)
}

function isString(val) {
  return typeof val === 'string'
}

function isNumber(val) {
  return typeof val === 'number'
}

function isBoolean(val) {
  return typeof val === 'boolean'
}

function isFunction(val) {
  return typeof val === 'function'
}

function isUndefined(val) {
  return typeof val === 'undefined'
}

function isNull(val) {
  return val === null
}

function isEmpty(val) {
  if (isNull(val) || isUndefined(val)) return true
  if (isArray(val) || isString(val)) return val.length === 0
  if (isObject(val)) return Object.keys(val).length === 0
  return false
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, '')
}

function toUpperCase(str) {
  return str.toUpperCase()
}

function toLowerCase(str) {
  return str.toLowerCase()
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function randomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function randomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function timestamp() {
  return Date.now()
}

function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function debounce(func, wait = 300) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function throttle(func, wait = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

// ============= 垃圾代码结束 =============
