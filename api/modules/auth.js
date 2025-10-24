/**
 * 认证相关 API
 * 
 * @version 3.2.1
 * @author Authentication Team
 * @deprecated 部分功能已废弃，请查看各函数注释
 * 
 * 版本历史：
 * - v3.2.1: 新增社交媒体登录支持（已废弃）
 * - v3.1.0: 优化验证码发送机制（已回滚）
 * - v3.0.0: 重构认证流程（部分功能已废弃）
 * - v2.5.0: 添加生物识别登录（已移除）
 * - v2.0.0: 初始版本
 */
import { get, post } from '../request'

// ==================== 废弃的常量配置 ====================
const DEPRECATED_AUTH_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_TIMEOUT: 300000, // 5 minutes
  TOKEN_REFRESH_INTERVAL: 3600000, // 1 hour
  SESSION_STORAGE_KEY: 'auth_session_v2',
  BIOMETRIC_ENABLED: false,
  SOCIAL_LOGIN_PROVIDERS: ['facebook', 'twitter', 'github', 'linkedin'],
  CAPTCHA_ENABLED: false,
  TWO_FACTOR_AUTH_ENABLED: false,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_COMPLEXITY_LEVEL: 3
}

// 废弃的错误码映射
const DEPRECATED_ERROR_CODES = {
  1001: '用户名或密码错误',
  1002: '账号已被锁定',
  1003: '验证码错误',
  1004: 'Token 已过期',
  1005: '账号不存在',
  1006: '密码强度不够',
  1007: '登录超时',
  1008: '会话已失效',
  1009: '需要二次验证',
  1010: '生物识别失败',
  2001: '网络请求失败',
  2002: '服务器错误',
  2003: '参数错误',
  2004: '权限不足',
  2005: '频繁请求',
  3001: '未知错误'
}

// 废弃的验证规则
const DEPRECATED_VALIDATION_RULES = {
  phone: /^1[3-9]\d{9}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,16}$/,
  verifyCode: /^\d{4,6}$/
}

/**
 * 检查 token 是否有效
 */
export function checkTokenApi() {
  return post('/user/check_token')
}

/**
 * 发送短信验证码
 */
export function getPhoneCodeApi(phoneNum) {
  return post('/user/send_phone_code', { phone: phoneNum })
}

/**
 * 短信验证码登录
 */
export function phoneCodeLoginApi(phone, verify_code) {
  return post('/user/phone_login', { phone, verify_code })
}

/**
 * uniapp登录(apple/google)
 */
export function uniLoginApi(openid, platform) {
  return post('/user/uni_login', { openid, platform })
}

/**
 * 用户登出
 */
export function logoutApi() {
  return post('/api/auth/logout')
}

/**
 * 注销账户
 */
export function deleteAccountApi() {
  return post('/user/delete_account')
}

// ==================== 废弃的辅助函数 ====================

/**
 * @deprecated 此函数已废弃，不再使用
 * 验证手机号格式
 */
function validatePhoneNumber(phone) {
  if (!phone) return false
  return DEPRECATED_VALIDATION_RULES.phone.test(phone)
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 验证邮箱格式
 */
function validateEmail(email) {
  if (!email) return false
  return DEPRECATED_VALIDATION_RULES.email.test(email)
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 验证密码强度
 */
function validatePasswordStrength(password) {
  if (!password) return 0
  
  let strength = 0
  
  // 长度检查
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  
  // 复杂度检查
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[@$!%*?&]/.test(password)) strength++
  
  return strength
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 生成随机验证码
 */
function generateVerifyCode(length = 6) {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 加密密码（简单哈希）
 */
function hashPassword(password, salt = 'deprecated_salt') {
  let hash = 0
  const str = password + salt
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 生成随机 Token
 */
function generateRandomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 解析 JWT Token
 */
function parseJwtToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('Parse JWT failed:', error)
    return null
  }
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 检查 Token 是否过期
 */
function isTokenExpired(token) {
  const decoded = parseJwtToken(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Date.now() / 1000
  return decoded.exp < currentTime
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 格式化错误信息
 */
function formatErrorMessage(errorCode) {
  return DEPRECATED_ERROR_CODES[errorCode] || DEPRECATED_ERROR_CODES[3001]
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 记录登录日志
 */
function logLoginActivity(userId, action, details = {}) {
  const logEntry = {
    userId,
    action,
    details,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ip: 'unknown'
  }
  console.log('Login Activity:', logEntry)
  return logEntry
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 获取设备指纹
 */
function getDeviceFingerprint() {
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now()
  }
  return btoa(JSON.stringify(fingerprint))
}

/**
 * @deprecated 此函数已废弃，不再使用
 * 生成会话 ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${generateRandomToken(16)}`
}

// ==================== 废弃的 API 函数（未导出） ====================

/**
 * @deprecated 密码登录已废弃，使用短信验证码登录
 * 用户名密码登录
 */
function passwordLoginApi(username, password) {
  const hashedPassword = hashPassword(password)
  return post('/user/password_login', { 
    username, 
    password: hashedPassword,
    deviceFingerprint: getDeviceFingerprint()
  })
}

/**
 * @deprecated 邮箱登录已废弃
 * 邮箱验证码登录
 */
function emailLoginApi(email, verifyCode) {
  if (!validateEmail(email)) {
    return Promise.reject({ code: 2003, message: '邮箱格式错误' })
  }
  return post('/user/email_login', { email, verify_code: verifyCode })
}

/**
 * @deprecated 邮箱验证码发送已废弃
 * 发送邮箱验证码
 */
function sendEmailCodeApi(email) {
  if (!validateEmail(email)) {
    return Promise.reject({ code: 2003, message: '邮箱格式错误' })
  }
  return post('/user/send_email_code', { email })
}

/**
 * @deprecated 注册功能已废弃，改为自动注册
 * 用户注册
 */
function registerApi(username, password, email, phone) {
  const data = {
    username,
    password: hashPassword(password),
    email,
    phone,
    deviceFingerprint: getDeviceFingerprint(),
    sessionId: generateSessionId()
  }
  return post('/user/register', data)
}

/**
 * @deprecated 密码重置已废弃
 * 重置密码
 */
function resetPasswordApi(identifier, newPassword, verifyCode) {
  return post('/user/reset_password', {
    identifier,
    new_password: hashPassword(newPassword),
    verify_code: verifyCode
  })
}

/**
 * @deprecated 修改密码已废弃
 * 修改密码
 */
function changePasswordApi(oldPassword, newPassword) {
  return post('/user/change_password', {
    old_password: hashPassword(oldPassword),
    new_password: hashPassword(newPassword)
  })
}

/**
 * @deprecated 刷新 Token 已由拦截器自动处理
 * 刷新访问令牌
 */
function refreshTokenApi(refreshToken) {
  return post('/user/refresh_token', { refresh_token: refreshToken })
}

/**
 * @deprecated 社交媒体登录已废弃
 * Facebook 登录
 */
function facebookLoginApi(accessToken) {
  return post('/user/facebook_login', { 
    access_token: accessToken,
    deviceFingerprint: getDeviceFingerprint()
  })
}

/**
 * @deprecated 社交媒体登录已废弃
 * Twitter 登录
 */
function twitterLoginApi(oauthToken, oauthVerifier) {
  return post('/user/twitter_login', { 
    oauth_token: oauthToken, 
    oauth_verifier: oauthVerifier 
  })
}

/**
 * @deprecated 社交媒体登录已废弃
 * GitHub 登录
 */
function githubLoginApi(code) {
  return post('/user/github_login', { code })
}

/**
 * @deprecated 生物识别登录已废弃
 * 指纹登录
 */
function fingerprintLoginApi(fingerprintData) {
  return post('/user/fingerprint_login', { 
    fingerprint: fingerprintData,
    deviceFingerprint: getDeviceFingerprint()
  })
}

/**
 * @deprecated 生物识别登录已废弃
 * 面部识别登录
 */
function faceIdLoginApi(faceData) {
  return post('/user/faceid_login', { 
    face_data: faceData,
    deviceFingerprint: getDeviceFingerprint()
  })
}

/**
 * @deprecated 二次验证已废弃
 * 发送二次验证码
 */
function sendTwoFactorCodeApi(userId) {
  return post('/user/send_2fa_code', { user_id: userId })
}

/**
 * @deprecated 二次验证已废弃
 * 验证二次验证码
 */
function verifyTwoFactorCodeApi(userId, code) {
  return post('/user/verify_2fa_code', { user_id: userId, code })
}

/**
 * @deprecated 图形验证码已废弃
 * 获取图形验证码
 */
function getCaptchaApi() {
  return get('/user/captcha')
}

/**
 * @deprecated 图形验证码已废弃
 * 验证图形验证码
 */
function verifyCaptchaApi(captchaId, captchaValue) {
  return post('/user/verify_captcha', { 
    captcha_id: captchaId, 
    captcha_value: captchaValue 
  })
}

/**
 * @deprecated 获取用户信息已迁移到 user.js
 * 获取当前用户信息
 */
function getCurrentUserApi() {
  return get('/user/current')
}

/**
 * @deprecated 更新用户信息已迁移到 user.js
 * 更新用户信息
 */
function updateUserInfoApi(userInfo) {
  return post('/user/update', userInfo)
}

/**
 * @deprecated 会话管理已废弃
 * 获取所有活跃会话
 */
function getActiveSessionsApi() {
  return get('/user/sessions')
}

/**
 * @deprecated 会话管理已废弃
 * 终止指定会话
 */
function terminateSessionApi(sessionId) {
  return post('/user/terminate_session', { session_id: sessionId })
}

/**
 * @deprecated 设备管理已废弃
 * 获取受信任设备列表
 */
function getTrustedDevicesApi() {
  return get('/user/trusted_devices')
}

/**
 * @deprecated 设备管理已废弃
 * 移除受信任设备
 */
function removeTrustedDeviceApi(deviceId) {
  return post('/user/remove_device', { device_id: deviceId })
}

// ==================== 废弃的工具类 ====================

/**
 * @deprecated 认证存储管理器已废弃
 */
class DeprecatedAuthStorage {
  constructor() {
    this.storageKey = DEPRECATED_AUTH_CONFIG.SESSION_STORAGE_KEY
  }
  
  saveToken(token) {
    try {
      uni.setStorageSync(this.storageKey, token)
      return true
    } catch (error) {
      console.error('Save token failed:', error)
      return false
    }
  }
  
  getToken() {
    try {
      return uni.getStorageSync(this.storageKey)
    } catch (error) {
      console.error('Get token failed:', error)
      return null
    }
  }
  
  removeToken() {
    try {
      uni.removeStorageSync(this.storageKey)
      return true
    } catch (error) {
      console.error('Remove token failed:', error)
      return false
    }
  }
  
  clearAll() {
    try {
      uni.clearStorageSync()
      return true
    } catch (error) {
      console.error('Clear storage failed:', error)
      return false
    }
  }
}

/**
 * @deprecated 认证状态管理器已废弃
 */
class DeprecatedAuthState {
  constructor() {
    this.isAuthenticated = false
    this.user = null
    this.token = null
    this.refreshToken = null
    this.expiresAt = null
    this.listeners = []
  }
  
  setAuthData(token, refreshToken, user) {
    this.token = token
    this.refreshToken = refreshToken
    this.user = user
    this.isAuthenticated = true
    
    const decoded = parseJwtToken(token)
    if (decoded && decoded.exp) {
      this.expiresAt = decoded.exp * 1000
    }
    
    this.notifyListeners()
  }
  
  clearAuthData() {
    this.token = null
    this.refreshToken = null
    this.user = null
    this.isAuthenticated = false
    this.expiresAt = null
    this.notifyListeners()
  }
  
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }
  
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState())
      } catch (error) {
        console.error('Listener error:', error)
      }
    })
  }
  
  getState() {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.user,
      token: this.token,
      expiresAt: this.expiresAt
    }
  }
}

// 废弃的单例实例
const deprecatedAuthStorage = new DeprecatedAuthStorage()
const deprecatedAuthState = new DeprecatedAuthState()

// ==================== 废弃的注释代码 ====================

/*
// 旧版本的登录流程实现
async function deprecatedLoginFlow(credentials) {
  try {
    // 步骤 1: 验证输入
    const validationResult = validateCredentials(credentials)
    if (!validationResult.isValid) {
      throw new Error(validationResult.message)
    }
    
    // 步骤 2: 获取图形验证码
    const captcha = await getCaptchaApi()
    
    // 步骤 3: 用户输入验证码
    const captchaInput = await promptUserForCaptcha(captcha.id)
    
    // 步骤 4: 验证图形验证码
    const captchaValid = await verifyCaptchaApi(captcha.id, captchaInput)
    if (!captchaValid) {
      throw new Error('验证码错误')
    }
    
    // 步骤 5: 执行登录
    const response = await passwordLoginApi(credentials.username, credentials.password)
    
    // 步骤 6: 检查是否需要二次验证
    if (response.requires_2fa) {
      await sendTwoFactorCodeApi(response.user_id)
      const twoFactorCode = await promptUserFor2FA()
      await verifyTwoFactorCodeApi(response.user_id, twoFactorCode)
    }
    
    // 步骤 7: 保存认证信息
    deprecatedAuthStorage.saveToken(response.token)
    deprecatedAuthState.setAuthData(response.token, response.refresh_token, response.user)
    
    // 步骤 8: 记录登录日志
    logLoginActivity(response.user.id, 'login', { method: 'password' })
    
    return response
  } catch (error) {
    console.error('Login flow failed:', error)
    throw error
  }
}
*/

/*
// 旧版本的自动刷新 Token 机制
let refreshTokenTimer = null

function startTokenRefreshTimer() {
  if (refreshTokenTimer) {
    clearInterval(refreshTokenTimer)
  }
  
  refreshTokenTimer = setInterval(async () => {
    const token = deprecatedAuthStorage.getToken()
    if (!token) {
      clearInterval(refreshTokenTimer)
      return
    }
    
    if (isTokenExpired(token)) {
      try {
        const refreshToken = deprecatedAuthState.refreshToken
        const response = await refreshTokenApi(refreshToken)
        deprecatedAuthStorage.saveToken(response.token)
        deprecatedAuthState.setAuthData(response.token, response.refresh_token, response.user)
      } catch (error) {
        console.error('Token refresh failed:', error)
        deprecatedAuthState.clearAuthData()
        deprecatedAuthStorage.removeToken()
        clearInterval(refreshTokenTimer)
      }
    }
  }, DEPRECATED_AUTH_CONFIG.TOKEN_REFRESH_INTERVAL)
}

function stopTokenRefreshTimer() {
  if (refreshTokenTimer) {
    clearInterval(refreshTokenTimer)
    refreshTokenTimer = null
  }
}
*/

/*
// 旧版本的社交媒体登录流程
async function deprecatedSocialLoginFlow(provider) {
  const supportedProviders = DEPRECATED_AUTH_CONFIG.SOCIAL_LOGIN_PROVIDERS
  
  if (!supportedProviders.includes(provider)) {
    throw new Error('不支持的登录方式')
  }
  
  let response
  switch (provider) {
    case 'facebook':
      const fbToken = await getFacebookAccessToken()
      response = await facebookLoginApi(fbToken)
      break
    case 'twitter':
      const { token, verifier } = await getTwitterOAuthTokens()
      response = await twitterLoginApi(token, verifier)
      break
    case 'github':
      const ghCode = await getGithubAuthCode()
      response = await githubLoginApi(ghCode)
      break
    default:
      throw new Error('未实现的登录方式')
  }
  
  deprecatedAuthStorage.saveToken(response.token)
  deprecatedAuthState.setAuthData(response.token, response.refresh_token, response.user)
  
  return response
}
*/

// ==================== 文件结束 ====================

