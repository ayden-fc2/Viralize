<template>
  <view class="welcome-wrapper">
    <view class="content-container">
      <view class="logo-section">
        <view class="logo-container">
          <image mode="aspectFit" src="/static/logo.png" class="logo-image"/>
        </view>
      </view>
      
      <view class="text-section">
        <text class="title-text">{{ $t('welcome.title') }}</text>
        <text class="subtitle-text">{{ $t('welcome.subtitle') }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkTokenApi } from '@/api/modules/auth'

const MIN_DISPLAY_TIME = 2400  // 最短首屏显示时间
const MAX_WAIT_TIME = 5000     // 最长等待时间
const RETRY_INTERVAL = 200     // 重试间隔

export default {
  data() {
    return {
      minTimeElapsed: false,      // 最短时间是否已过
      authCheckComplete: false,   // 认证检查是否完成
      navigationState: -1,        // 导航状态：-1 未完成，0 跳转首页，1 跳转登录
      timeoutTimer: null,         // 超时定时器
    }
  },
  computed: {
    ...mapGetters('user', ['token', 'isLoggedIn'])
  },
  onLoad() {
    console.log('🚀 应用启动')
    this.startMinTimer()
    this.startMaxTimer()
    this.initAuth()
  },
  onUnload() {
    // 清理定时器
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer)
    }
  },
  methods: {
    /**
     * 初始化认证检查
     */
    initAuth() {
      console.log('🔐 开始认证检查')
      
      // 直接从 storage 读取 token
      const token = uni.getStorageSync('user-token') || uni.getStorageSync('token')
      console.log('📦 从 Storage 读取 Token:', token ? '存在' : '不存在')
      
      // 如果 token 存在但 store 中没有，先同步到 store
      if (token && !this.token) {
        console.log('🔄 同步 Token 到 Store')
        this.$store.dispatch('user/setToken', token)
      }
      
      this.verifyToken()
        .then(res => {
          console.log('✅ Token 有效，准备跳转首页')
          this.navigationState = 0
          this.authCheckComplete = true
          this.proceedNext()
        })
        .catch(err => {
          console.log('❌ Token 无效或未登录，准备跳转登录页', err)
          this.$store.dispatch('user/clearToken')
          this.navigationState = 1
          this.authCheckComplete = true
          this.proceedNext()
        })
    },
    
    /**
     * 验证 Token
     */
    verifyToken() {
      return new Promise((resolve, reject) => {
        // 从 storage 读取最新的 token
        const token = uni.getStorageSync('user-token') || uni.getStorageSync('token')
        
        if (!token) {
          console.log('⚠️ Storage 中没有 Token')
          reject({ message: '未登录' })
          return
        }
        
        console.log('🔍 验证 Token 有效性')
        checkTokenApi()
          .then(res => {
            console.log('✅ Token 验证通过')
            // API 调用成功即表示 token 有效
            resolve(res)
          })
          .catch(err => {
            console.log('❌ Token 验证失败:', err)
            reject(err)
          })
      })
    },
    
    /**
     * 启动最短展示时间计时器
     */
    startMinTimer() {
      setTimeout(() => {
        this.minTimeElapsed = true
        console.log('⏱️ 最短展示时间已到')
        this.proceedNext()
      }, MIN_DISPLAY_TIME)
    },
    
    /**
     * 启动最长等待时间计时器（超时保护）
     */
    startMaxTimer() {
      this.timeoutTimer = setTimeout(() => {
        if (!this.authCheckComplete) {
          console.warn('⚠️ 认证检查超时，直接跳转登录页')
          this.navigationState = 1
          this.authCheckComplete = true
          this.$store.dispatch('user/clearToken')
          this.proceedNext()
        }
      }, MAX_WAIT_TIME)
    },
    
    /**
     * 执行页面跳转
     */
    proceedNext() {
      // 必须同时满足：最短时间已过 && 认证检查完成
      if (!this.minTimeElapsed || !this.authCheckComplete) {
        return
      }
      
      // 清除超时定时器
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer)
      }
      
      if (this.navigationState === 0) {
        console.log('🏠 跳转到首页')
        uni.reLaunch({
          url: '/pages/home/home'
        })
      } else if (this.navigationState === 1) {
        console.log('🔑 跳转到登录页')
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome-wrapper {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    135deg,
    #f5f7fa 0%,
    #c3cfe2 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 80rpx;
    animation: fadeIn 0.8s ease-in-out;
  }
  
  .logo-section {
    display: flex;
    justify-content: center;
    align-items: center;
    
    .logo-container {
      width: 200rpx;
      height: 200rpx;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 40rpx;
      padding: 30rpx;
      box-shadow: 
        0 10rpx 40rpx rgba(0, 0, 0, 0.08),
        0 2rpx 10rpx rgba(0, 0, 0, 0.05);
      border: 1rpx solid rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      transition: transform 0.3s ease;
      animation: float 3s ease-in-out infinite;
      
      .logo-image {
        width: 100%;
        height: 100%;
      }
    }
  }
  
  .text-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
    
    .title-text {
      font-size: 52rpx;
      font-weight: 600;
      color: #2c3e50;
      text-align: center;
      letter-spacing: 2rpx;
      text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    }
    
    .subtitle-text {
      font-size: 28rpx;
      color: #5a6c7d;
      text-align: center;
      opacity: 0.85;
      font-weight: 400;
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
    transform: translateY(-20rpx);
  }
}
</style>