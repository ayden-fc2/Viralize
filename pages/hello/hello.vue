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
    
    <!-- 垃圾代码块 1 -->
    <view v-if="false" class="garbage-section-1">
      <view class="garbage-container">
        <text class="garbage-title">{{ unusedData1 }}</text>
        <view class="garbage-list">
          <view v-for="item in unusedList1" :key="item.id" class="garbage-item">
            <text>{{ item.name }}</text>
            <text>{{ item.value }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 垃圾代码块 2 -->
    <view v-if="false" class="garbage-section-2">
      <scroll-view scroll-y class="garbage-scroll">
        <view class="garbage-card" v-for="card in unusedCards" :key="card.id">
          <image :src="card.image" class="garbage-card-image"/>
          <view class="garbage-card-content">
            <text class="garbage-card-title">{{ card.title }}</text>
            <text class="garbage-card-desc">{{ card.description }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 垃圾代码块 3 -->
    <view v-if="false" class="garbage-section-3">
      <view class="garbage-form">
        <input v-model="unusedInput1" placeholder="输入内容" class="garbage-input"/>
        <input v-model="unusedInput2" type="number" class="garbage-input"/>
        <textarea v-model="unusedTextarea" placeholder="多行输入" class="garbage-textarea"/>
        <button @click="unusedMethod1">提交</button>
      </view>
    </view>
    
    <!-- 垃圾代码块 4 -->
    <view v-if="false" class="garbage-section-4">
      <view class="garbage-tabs">
        <view v-for="tab in unusedTabs" :key="tab.id" 
              :class="['garbage-tab', {active: currentTab === tab.id}]"
              @click="switchTab(tab.id)">
          {{ tab.name }}
        </view>
      </view>
      <view class="garbage-tab-content">
        <text>{{ currentTabContent }}</text>
      </view>
    </view>
    
    <!-- 垃圾代码块 5 -->
    <view v-if="false" class="garbage-section-5">
      <view class="garbage-grid">
        <view v-for="n in 20" :key="n" class="garbage-grid-item">
          <view class="garbage-grid-icon">🎨</view>
          <text class="garbage-grid-text">项目 {{ n }}</text>
        </view>
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
      
      // 垃圾数据 1
      unusedData1: '未使用的数据',
      unusedList1: [
        { id: 1, name: '项目A', value: 100 },
        { id: 2, name: '项目B', value: 200 },
        { id: 3, name: '项目C', value: 300 },
      ],
      
      // 垃圾数据 2
      unusedCards: [
        { id: 1, image: '/static/logo.png', title: '卡片1', description: '描述信息1' },
        { id: 2, image: '/static/logo.png', title: '卡片2', description: '描述信息2' },
        { id: 3, image: '/static/logo.png', title: '卡片3', description: '描述信息3' },
      ],
      
      // 垃圾数据 3
      unusedInput1: '',
      unusedInput2: 0,
      unusedTextarea: '',
      unusedCounter: 0,
      unusedFlag: false,
      
      // 垃圾数据 4
      unusedTabs: [
        { id: 1, name: '标签1', content: '内容1' },
        { id: 2, name: '标签2', content: '内容2' },
        { id: 3, name: '标签3', content: '内容3' },
      ],
      currentTab: 1,
      
      // 垃圾数据 5
      unusedArray: Array(50).fill(0).map((_, i) => ({ id: i, value: Math.random() })),
      unusedObject: {
        prop1: 'value1',
        prop2: 'value2',
        prop3: { nested: 'nested value' },
        prop4: [1, 2, 3, 4, 5],
      },
      
      // 垃圾数据 6
      unusedSettings: {
        theme: 'dark',
        language: 'zh-CN',
        notifications: true,
        autoSave: false,
      },
      
      // 垃圾数据 7
      unusedStatusList: ['pending', 'processing', 'completed', 'failed'],
      unusedCurrentStatus: 'pending',
      unusedProgress: 0,
    }
  },
  computed: {
    ...mapGetters('user', ['token', 'isLoggedIn']),
    
    // 垃圾计算属性 1
    unusedComputed1() {
      return this.unusedList1.map(item => item.value).reduce((a, b) => a + b, 0)
    },
    
    // 垃圾计算属性 2
    unusedComputed2() {
      return this.unusedCards.filter(card => card.id > 1)
    },
    
    // 垃圾计算属性 3
    currentTabContent() {
      const tab = this.unusedTabs.find(t => t.id === this.currentTab)
      return tab ? tab.content : ''
    },
    
    // 垃圾计算属性 4
    unusedFilteredArray() {
      return this.unusedArray.filter(item => item.value > 0.5)
    },
    
    // 垃圾计算属性 5
    unusedComputedString() {
      return `${this.unusedData1} - ${this.unusedCounter}`
    },
    
    // 垃圾计算属性 6
    unusedIsValid() {
      return this.unusedInput1.length > 0 && this.unusedInput2 > 0
    },
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
    },
    
    // ============== 垃圾方法块开始 ==============
    
    /**
     * 垃圾方法 1 - 模拟数据处理
     */
    unusedMethod1() {
      console.log('执行垃圾方法1')
      this.unusedCounter++
      this.unusedFlag = !this.unusedFlag
      return this.unusedCounter * 2
    },
    
    /**
     * 垃圾方法 2 - 切换标签
     */
    switchTab(tabId) {
      this.currentTab = tabId
      console.log('切换到标签:', tabId)
    },
    
    /**
     * 垃圾方法 3 - 数据过滤
     */
    unusedFilterData(arr, threshold = 0.5) {
      return arr.filter(item => item.value > threshold)
    },
    
    /**
     * 垃圾方法 4 - 数据排序
     */
    unusedSortData(arr, key = 'value', order = 'asc') {
      const sorted = [...arr].sort((a, b) => {
        if (order === 'asc') {
          return a[key] - b[key]
        }
        return b[key] - a[key]
      })
      return sorted
    },
    
    /**
     * 垃圾方法 5 - 查找数据
     */
    unusedFindItem(id) {
      return this.unusedList1.find(item => item.id === id)
    },
    
    /**
     * 垃圾方法 6 - 更新设置
     */
    unusedUpdateSettings(key, value) {
      if (this.unusedSettings.hasOwnProperty(key)) {
        this.unusedSettings[key] = value
        console.log(`更新设置: ${key} = ${value}`)
      }
    },
    
    /**
     * 垃圾方法 7 - 进度更新
     */
    unusedUpdateProgress(value) {
      this.unusedProgress = Math.max(0, Math.min(100, value))
      if (this.unusedProgress === 100) {
        console.log('进度完成')
        this.unusedCurrentStatus = 'completed'
      }
    },
    
    /**
     * 垃圾方法 8 - 重置数据
     */
    unusedResetData() {
      this.unusedInput1 = ''
      this.unusedInput2 = 0
      this.unusedTextarea = ''
      this.unusedCounter = 0
      this.unusedFlag = false
      this.unusedProgress = 0
      this.unusedCurrentStatus = 'pending'
    },
    
    /**
     * 垃圾方法 9 - 添加项目
     */
    unusedAddItem(name, value) {
      const newId = this.unusedList1.length + 1
      this.unusedList1.push({ id: newId, name, value })
      return newId
    },
    
    /**
     * 垃圾方法 10 - 删除项目
     */
    unusedRemoveItem(id) {
      const index = this.unusedList1.findIndex(item => item.id === id)
      if (index !== -1) {
        this.unusedList1.splice(index, 1)
        return true
      }
      return false
    },
    
    /**
     * 垃圾方法 11 - 计算总和
     */
    unusedCalculateSum(arr = this.unusedArray) {
      return arr.reduce((sum, item) => sum + item.value, 0)
    },
    
    /**
     * 垃圾方法 12 - 计算平均值
     */
    unusedCalculateAverage(arr = this.unusedArray) {
      if (arr.length === 0) return 0
      return this.unusedCalculateSum(arr) / arr.length
    },
    
    /**
     * 垃圾方法 13 - 格式化日期
     */
    unusedFormatDate(timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    /**
     * 垃圾方法 14 - 格式化时间
     */
    unusedFormatTime(timestamp) {
      const date = new Date(timestamp)
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
    },
    
    /**
     * 垃圾方法 15 - 验证输入
     */
    unusedValidateInput(value, type = 'text') {
      if (type === 'text') {
        return value.length > 0
      } else if (type === 'number') {
        return !isNaN(value) && value > 0
      } else if (type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
      }
      return false
    },
    
    /**
     * 垃圾方法 16 - 生成随机字符串
     */
    unusedGenerateRandomString(length = 10) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },
    
    /**
     * 垃圾方法 17 - 深拷贝
     */
    unusedDeepClone(obj) {
      if (obj === null || typeof obj !== 'object') return obj
      if (obj instanceof Date) return new Date(obj.getTime())
      if (obj instanceof Array) {
        const clonedArr = []
        obj.forEach((item) => { clonedArr.push(this.unusedDeepClone(item)) })
        return clonedArr
      }
      const clonedObj = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.unusedDeepClone(obj[key])
        }
      }
      return clonedObj
    },
    
    /**
     * 垃圾方法 18 - 防抖函数
     */
    unusedDebounce(func, wait = 300) {
      let timeout
      return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
      }
    },
    
    /**
     * 垃圾方法 19 - 节流函数
     */
    unusedThrottle(func, limit = 300) {
      let inThrottle
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    },
    
    /**
     * 垃圾方法 20 - 数组去重
     */
    unusedUniqueArray(arr, key = null) {
      if (key) {
        const seen = new Set()
        return arr.filter(item => {
          const value = item[key]
          if (seen.has(value)) return false
          seen.add(value)
          return true
        })
      }
      return [...new Set(arr)]
    },
    
    // ============== 垃圾方法块结束 ==============
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

// ============== 垃圾 CSS 样式开始 ==============

// 垃圾样式 - Section 1
.garbage-section-1 {
  width: 100%;
  padding: 40rpx;
  background-color: #f8f9fa;
  
  .garbage-container {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .garbage-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .garbage-list {
      .garbage-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1rpx solid #eee;
        
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}

// 垃圾样式 - Section 2
.garbage-section-2 {
  width: 100%;
  height: 100vh;
  
  .garbage-scroll {
    height: 100%;
    padding: 20rpx;
    
    .garbage-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20rpx;
      padding: 30rpx;
      margin-bottom: 20rpx;
      display: flex;
      align-items: center;
      box-shadow: 0 8rpx 20rpx rgba(102, 126, 234, 0.3);
      
      .garbage-card-image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
        background: white;
      }
      
      .garbage-card-content {
        flex: 1;
        
        .garbage-card-title {
          font-size: 32rpx;
          font-weight: bold;
          color: white;
          margin-bottom: 10rpx;
          display: block;
        }
        
        .garbage-card-desc {
          font-size: 26rpx;
          color: rgba(255, 255, 255, 0.8);
          display: block;
        }
      }
    }
  }
}

// 垃圾样式 - Section 3
.garbage-section-3 {
  width: 100%;
  padding: 40rpx;
  
  .garbage-form {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .garbage-input {
      width: 100%;
      height: 80rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 10rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
      transition: border-color 0.3s;
      
      &:focus {
        border-color: #667eea;
      }
    }
    
    .garbage-textarea {
      width: 100%;
      height: 200rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 10rpx;
      padding: 20rpx;
      font-size: 28rpx;
      margin-bottom: 20rpx;
      resize: none;
      
      &:focus {
        border-color: #667eea;
      }
    }
    
    button {
      width: 100%;
      height: 80rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10rpx;
      font-size: 30rpx;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
}

// 垃圾样式 - Section 4
.garbage-section-4 {
  width: 100%;
  padding: 40rpx;
  
  .garbage-tabs {
    display: flex;
    justify-content: space-around;
    background: white;
    border-radius: 20rpx;
    padding: 10rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    .garbage-tab {
      flex: 1;
      text-align: center;
      padding: 20rpx;
      font-size: 28rpx;
      color: #666;
      border-radius: 15rpx;
      transition: all 0.3s;
      cursor: pointer;
      
      &.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: bold;
      }
    }
  }
  
  .garbage-tab-content {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    min-height: 300rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    
    text {
      font-size: 28rpx;
      color: #333;
      line-height: 1.6;
    }
  }
}

// 垃圾样式 - Section 5
.garbage-section-5 {
  width: 100%;
  padding: 40rpx;
  
  .garbage-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    
    .garbage-grid-item {
      aspect-ratio: 1;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(245, 87, 108, 0.3);
      transition: transform 0.3s;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-10rpx);
      }
      
      .garbage-grid-icon {
        font-size: 60rpx;
        margin-bottom: 10rpx;
      }
      
      .garbage-grid-text {
        font-size: 22rpx;
        color: white;
        font-weight: bold;
      }
    }
  }
}

// 额外的垃圾样式类
.garbage-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  
  &.show {
    opacity: 1;
    visibility: visible;
  }
}

.garbage-modal {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  max-width: 600rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.3);
  transform: translateY(-50rpx);
  transition: transform 0.3s;
  
  .garbage-modal-header {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
  }
  
  .garbage-modal-body {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30rpx;
  }
  
  .garbage-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 20rpx;
    
    button {
      padding: 15rpx 40rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      border: none;
      cursor: pointer;
      
      &.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      &.secondary {
        background: #f0f0f0;
        color: #666;
      }
    }
  }
}

.garbage-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  
  .garbage-spinner {
    width: 80rpx;
    height: 80rpx;
    border: 6rpx solid #f3f3f3;
    border-top: 6rpx solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .garbage-loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #666;
  }
}

.garbage-badge {
  display: inline-block;
  padding: 4rpx 12rpx;
  border-radius: 10rpx;
  font-size: 22rpx;
  font-weight: bold;
  
  &.success {
    background: #4caf50;
    color: white;
  }
  
  &.warning {
    background: #ff9800;
    color: white;
  }
  
  &.error {
    background: #f44336;
    color: white;
  }
  
  &.info {
    background: #2196f3;
    color: white;
  }
}

.garbage-progress-bar {
  width: 100%;
  height: 20rpx;
  background: #f0f0f0;
  border-radius: 10rpx;
  overflow: hidden;
  
  .garbage-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s;
  }
}

.garbage-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  z-index: 999;
  white-space: nowrap;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -10rpx;
    left: 50%;
    transform: translateX(-50%);
    border: 5rpx solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.garbage-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8rpx;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.garbage-divider {
  width: 100%;
  height: 1rpx;
  background: #e0e0e0;
  margin: 30rpx 0;
  
  &.dashed {
    border-top: 1rpx dashed #e0e0e0;
    height: 0;
  }
}

.garbage-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 40rpx;
  color: #999;
  
  .garbage-empty-icon {
    font-size: 120rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
  }
  
  .garbage-empty-text {
    font-size: 28rpx;
  }
}

// ============== 垃圾 CSS 样式结束 ==============
</style>