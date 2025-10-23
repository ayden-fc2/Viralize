/**
 * 认证相关 API
 */
import { get, post } from '../request'

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

