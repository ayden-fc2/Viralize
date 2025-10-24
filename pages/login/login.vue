<template>
  <view class="login-page">
    <u-status-bar></u-status-bar>
    <view class="content-area">
      <!-- Logo 和标题区域 -->
      <view class="header-section">
        <view class="logo-wrapper">
          <image mode="aspectFit" src="/static/logo.png" class="logo-image"/>
        </view>
        <view class="title-section">
          <text class="title">{{ $t('login.title') }}</text>
          <text class="subtitle">{{ $t('login.subtitle') }}</text>
        </view>
      </view>
      
      <!-- 登录按钮区域 -->
      <view class="actions-section">
        <!-- 手机号登录 -->
        <view class="login-btn primary-btn" @click="handlePhoneLogin">
          <u-icon name="../../static/phone.svg" size="20" color="#ffffff"></u-icon>
          <text class="btn-text">{{ $t('login.phone') }}</text>
        </view>
      </view>
      
      <!-- 隐私协议区域 -->
      <view class="agreement-section">
        <u-checkbox-group @change="toggleAgreement">
          <u-checkbox
            size="14"
            :checked="agreedToTerms"
            activeColor="#667eea"
          >
          </u-checkbox>
        </u-checkbox-group>
        <text class="agreement-text">{{ $t('login.agreePrefix') }}</text>
        <text class="link-text" @click="openTerms">{{ $t('login.terms') }}</text>
        <text class="agreement-text">{{ $t('login.and') }}</text>
        <text class="link-text" @click="openPrivacy">{{ $t('login.privacy') }}</text>
      </view>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
    
    <!-- SMS 登录弹窗 -->
    <u-popup 
      :show="showSmsPopup" 
      @close="closeSmsPopup" 
      mode="bottom"
      :closeable="true"
      :closeOnClickOverlay="false"
    >
      <view class="sms-popup-content">
        <!-- 步骤1: 输入手机号 -->
        <view v-if="smsStep === 1" class="popup-step">
          <view class="popup-title">{{ $t('sms.phoneTitle') }}</view>
          <view class="popup-subtitle">{{ $t('sms.phoneSubtitle') }}</view>
          
          <view class="input-wrapper">
            <u--input 
              v-model="phoneNumber" 
              :placeholder="$t('sms.phonePlaceholder')"
              type="number"
              :maxlength="11"
              :border="false"
              class="phone-input"
            />
          </view>
          
          <view class="popup-btn primary-popup-btn" @click="sendVerifyCode">
            {{ $t('sms.sendCode') }}
          </view>
        </view>
        
        <!-- 步骤2: 输入验证码 -->
        <view v-else-if="smsStep === 2" class="popup-step">
          <view class="popup-title">{{ $t('sms.codeTitle') }}</view>
          <view class="popup-subtitle">{{ $t('sms.codeSubtitle') }} {{ phoneNumber }}</view>
          
          <view class="code-input-wrapper">
            <u-code-input 
              v-model="verifyCode" 
              :maxlength="6"
              :hair-line="false"
              :size="50"
              :bold="true"
              :font-size="20"
              @finish="onCodeFilled"
            ></u-code-input>
          </view>
          
          <view 
            class="resend-link" 
            :class="countdown > 0 || isSpecialAccount(phoneNumber) ? 'disabled' : ''"
            @click="resendCode"
          >
            {{ countdown > 0 ? $t('sms.resendCountdown').replace('{countdown}', countdown) : $t('sms.resendCode') }}
          </view>
          
          <view class="popup-btn primary-popup-btn" @click="submitVerifyCode">
            {{ $t('sms.loginBtn') }}
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getPhoneCodeApi, phoneCodeLoginApi } from '@/api/modules/auth'

const CODE_LENGTH = 6
const COUNTDOWN_SECONDS = 60
const SPECIAL_ACCOUNT = '12312341234'  // 测试账号

export default {
  data() {
    return {
      agreedToTerms: false,
      showSmsPopup: false,
      smsStep: 1, // 1: 输入手机号, 2: 输入验证码
      phoneNumber: '',
      verifyCode: '',
      countdown: 0,
      countdownTimer: null
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  onLoad() {
    // 如果已登录，跳转到首页
    if (this.isLoggedIn) {
      uni.reLaunch({
        url: '/pages/home/home'
      })
    }
  },
  methods: {
    /**
     * 切换协议同意状态
     */
    toggleAgreement() {
      this.agreedToTerms = !this.agreedToTerms
    },
    
    /**
     * 手机号登录
     */
    handlePhoneLogin() {
      if (!this.agreedToTerms) {
        uni.showToast({
          title: this.$t('login.notAgreed'),
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      // 打开 SMS 登录弹窗
      this.showSmsPopup = true
      this.smsStep = 1
      this.phoneNumber = ''
      this.verifyCode = ''
    },
    
    /**
     * 打开服务条款
     */
    openTerms() {
      const url = 'https://genshot.ai/terms'
      const title = this.$t('login.terms')
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    },
    
    /**
     * 打开隐私政策
     */
    openPrivacy() {
      const url = 'https://genshot.ai/privacy'
      const title = this.$t('login.privacy')
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    },
    
    /**
     * 关闭 SMS 弹窗
     */
    closeSmsPopup() {
      this.showSmsPopup = false
      this.smsStep = 1
      this.phoneNumber = ''
      this.verifyCode = ''
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      this.countdown = 0
    },
    
    /**
     * 验证手机号格式
     */
    isValidPhoneNumber(phone) {
      // 测试账号直接通过
      if (phone === SPECIAL_ACCOUNT) {
        return true
      }
      // 简单的手机号验证（11位数字）
      return /^1[3-9]\d{9}$/.test(phone)
    },
    
    /**
     * 是否为测试账号
     */
    isSpecialAccount(phone) {
      return phone === SPECIAL_ACCOUNT
    },
    
    /**
     * 发送验证码
     */
    sendVerifyCode() {
      if (!this.isValidPhoneNumber(this.phoneNumber)) {
        uni.showToast({
          title: this.$t('sms.invalidPhone'),
          icon: 'none'
        })
        return
      }
      
      // 测试账号直接跳到验证码输入页面，不调用 API
      if (this.isSpecialAccount(this.phoneNumber)) {
        console.log('测试账号，跳过 API 调用')
        this.smsStep = 2
        this.startCountdown()
        uni.showToast({
          title: this.$t('sms.codeSent'),
          icon: 'success'
        })
        return
      }
      
      uni.showLoading({
        title: this.$t('sms.sending'),
        mask: true
      })
      
      // 调用发送验证码 API
      getPhoneCodeApi(this.phoneNumber).then(res => {
        console.log('发送验证码成功:', res)
        this.smsStep = 2
        this.startCountdown()
        uni.showToast({
          title: this.$t('sms.codeSent'),
          icon: 'success'
        })
      }).catch(err => {
        console.error('发送验证码失败:', err)
        uni.showToast({
          title: err.message || this.$t('sms.sending') + '失败',
          icon: 'none'
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
    
    /**
     * 开始倒计时
     */
    startCountdown() {
      this.countdown = COUNTDOWN_SECONDS
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          clearInterval(this.countdownTimer)
          this.countdownTimer = null
        }
      }, 1000)
    },
    
    /**
     * 重新发送验证码
     */
    resendCode() {
      if (this.countdown > 0) {
        return
      }
      
      // 测试账号不允许重新发送
      if (this.isSpecialAccount(this.phoneNumber)) {
        uni.showToast({
          title: '测试账号无需重新发送',
          icon: 'none'
        })
        return
      }
      
      if (!this.isValidPhoneNumber(this.phoneNumber)) {
        uni.showToast({
          title: this.$t('sms.invalidPhone'),
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: this.$t('sms.sending'),
        mask: true
      })
      
      // 调用发送验证码 API
      getPhoneCodeApi(this.phoneNumber).then(res => {
        console.log('重新发送验证码成功:', res)
        this.startCountdown()
        uni.showToast({
          title: this.$t('sms.codeSent'),
          icon: 'success'
        })
      }).catch(err => {
        console.error('重新发送验证码失败:', err)
        uni.showToast({
          title: err.message || this.$t('sms.sending') + '失败',
          icon: 'none'
        })
      }).finally(() => {
        uni.hideLoading()
      })
    },
    
    /**
     * 验证码输入完成
     */
    onCodeFilled(code) {
      this.verifyCode = code
      // 自动提交登录
      this.submitVerifyCode()
    },
    
    /**
     * 提交验证码登录
     */
    submitVerifyCode() {
      if (this.verifyCode.length !== CODE_LENGTH) {
        uni.showToast({
          title: this.$t('sms.invalidCode'),
          icon: 'none'
        })
        return
      }
      
      uni.showLoading({
        title: this.$t('sms.loggingIn'),
        mask: true
      })
      
      let loginSuccess = false
      
      // 调用验证码登录 API
      phoneCodeLoginApi(this.phoneNumber, this.verifyCode).then(res => {
        console.log('登录成功:', res)
        
        if (res.access_token) {
          loginSuccess = true
          
          // 保存 token 到 store 和本地存储
          this.$store.dispatch('user/setToken', res.access_token)
          
          // 关闭弹窗并跳转
          this.closeSmsPopup()
          
          uni.showToast({
            title: this.$t('sms.loginSuccess'),
            icon: 'success'
          })
          
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/home/home'
            })
          }, 500)
        }
      }).catch(err => {
        console.error('登录失败:', err)
        uni.showToast({
          title: err.message || '登录失败',
          icon: 'none'
        })
        // 清空验证码以便重新输入
        this.verifyCode = ''
      }).finally(() => {
        uni.hideLoading()
      })
    }
  },
  beforeDestroy() {
    // 清理定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f5f7fa 0%,
    #c3cfe2 100%
  );
  display: flex;
  flex-direction: column;
  
  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 40rpx 80rpx;
    
    .header-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 60rpx;
      animation: fadeIn 0.8s ease-in-out;
      
      .logo-wrapper {
        width: 160rpx;
        height: 160rpx;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 32rpx;
        padding: 28rpx;
        box-shadow: 
          0 8rpx 32rpx rgba(0, 0, 0, 0.08),
          0 2rpx 8rpx rgba(0, 0, 0, 0.05);
        border: 1rpx solid rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        animation: float 3s ease-in-out infinite;
        
        .logo-image {
          width: 100%;
          height: 100%;
        }
      }
      
      .title-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16rpx;
        
        .title {
          font-size: 48rpx;
          font-weight: 600;
          color: $uni-text-color;
          text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
        }
        
        .subtitle {
          font-size: 28rpx;
          color: $uni-text-color-secondary;
          opacity: 0.85;
        }
      }
    }
    
    .actions-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24rpx;
      margin-top: 120rpx;
      
      .login-btn {
        width: 100%;
        height: 96rpx;
        border-radius: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16rpx;
        font-size: 32rpx;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
        
        &:active {
          transform: scale(0.98);
          opacity: 0.9;
        }
        
        .btn-text {
          color: inherit;
        }
        
        // 主要按钮 - 手机号登录
        &.primary-btn {
          background: linear-gradient(135deg, $viralize-primary 0%, $viralize-primary-light 100%);
          color: $uni-text-color-inverse;
        }
      }
    }
    
    .agreement-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 8rpx;
      font-size: 24rpx;
      margin-top: 60rpx;
      padding: 0 20rpx;
      
      .agreement-text {
        color: $uni-text-color-grey;
      }
      
      .link-text {
        color: $viralize-primary;
        text-decoration: underline;
        cursor: pointer;
        
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

/* SMS 登录弹窗样式 */
.sms-popup-content {
  width: 100vw !important;
  padding: 60rpx 40rpx 40rpx 40rpx;
  background: $uni-bg-color;
  border-radius: 20rpx;
  
  .popup-step {
    width: 670rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
    .popup-title {
      font-size: 40rpx;
      font-weight: 600;
      color: $uni-text-color;
      margin-bottom: 16rpx;
    }
    
    .popup-subtitle {
      font-size: 28rpx;
      color: $uni-text-color-grey;
      margin-bottom: 60rpx;
      text-align: center;
    }
    
    .input-wrapper {
      width: 600rpx;
      height: 96rpx;
      background: $uni-bg-color-grey;
      border-radius: $uni-border-radius-lg;
      padding: 0 32rpx;
      margin-bottom: 40rpx;
      border: 2rpx solid $uni-border-color;
      
      .phone-input {
        height: 96rpx;
        font-size: 32rpx;
      }

      ::v-deep .u-input {
        height: 72rpx !important;
      }
    }
    
    .code-input-wrapper {
      width: 100%;
      margin-bottom: 40rpx;
      position: relative;

      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .resend-link {
      font-size: 28rpx;
      color: $viralize-primary;
      text-decoration: underline;
      margin-bottom: 40rpx;
      cursor: pointer;
      
      &.disabled {
        color: $uni-text-color-grey;
        text-decoration: none;
        cursor: not-allowed;
      }
      
      &:active:not(.disabled) {
        opacity: 0.7;
      }
    }
    
    .popup-btn {
      width: 100%;
      height: 88rpx;
      border-radius: 44rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
      
      &.primary-popup-btn {
        background: linear-gradient(135deg, $viralize-primary 0%, $viralize-primary-light 100%);
        color: $uni-text-color-inverse;
      }
    }
  }
}

// uview 组件样式覆盖
::v-deep .u-code-input {
  .u-code-input__item {
    border: 2rpx solid $uni-border-color !important;
    background-color: $uni-bg-color-grey !important;
    color: $uni-text-color !important;
    border-radius: $uni-border-radius-base !important;
    margin: 0 8rpx !important;

    text {
      color: $uni-text-color !important;
    }
    
    &.u-code-input__item--focus {
      border-color: $viralize-primary !important;
      background-color: $uni-bg-color !important;
      box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.15) !important;
    }
  }
}
</style>
