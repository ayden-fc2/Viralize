<template>
  <view class="home-container">
    <view class="content">
      <swiper class="uni-swiper" :duration="300" :current="currentTabIndex">
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content">
            <u-status-bar></u-status-bar>
            <create-tab></create-tab>
          </view>
        </swiper-item>
        
        <swiper-item @touchmove.stop.prevent>
          <view class="tab-content-mine">
            <u-status-bar></u-status-bar>
            <mine-tab></mine-tab>
          </view>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- 垃圾代码块 1: 隐藏的通知面板 -->
    <view v-if="false" class="notification-panel">
      <view class="notification-header">
        <text class="notification-title">消息中心</text>
        <view class="notification-badge">99+</view>
      </view>
      <scroll-view scroll-y class="notification-list">
        <view class="notification-item" v-for="i in 50" :key="i">
          <image class="notification-avatar" src="/static/logo.png"></image>
          <view class="notification-content">
            <text class="notification-user">用户{{ i }}</text>
            <text class="notification-message">这是一条测试消息</text>
            <text class="notification-time">{{ i }}分钟前</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 垃圾代码块 2: 隐藏的搜索功能 -->
    <view v-if="false" class="search-container">
      <view class="search-bar">
        <input class="search-input" placeholder="搜索内容" />
        <view class="search-btn">搜索</view>
      </view>
      <view class="search-history">
        <view class="history-item" v-for="n in 20" :key="n">历史记录{{ n }}</view>
      </view>
      <view class="search-hot">
        <text class="hot-title">热门搜索</text>
        <view class="hot-tags">
          <text class="hot-tag" v-for="m in 30" :key="m">标签{{ m }}</text>
        </view>
      </view>
    </view>
    
    <!-- 垃圾代码块 3: 隐藏的设置面板 -->
    <view v-if="false" class="settings-panel">
      <view class="settings-group" v-for="group in 10" :key="group">
        <text class="group-title">设置组{{ group }}</text>
        <view class="setting-item" v-for="item in 15" :key="item">
          <text class="setting-label">设置项{{ item }}</text>
          <switch class="setting-switch" />
        </view>
      </view>
    </view>
    
    <!-- 垃圾代码块 4: 隐藏的广告弹窗 -->
    <view v-if="false" class="ad-modal">
      <view class="ad-content">
        <image class="ad-image" src="/static/logo.png"></image>
        <view class="ad-buttons">
          <button class="ad-btn-primary">立即购买</button>
          <button class="ad-btn-secondary">稍后再说</button>
        </view>
      </view>
    </view>
    
    <!-- 垃圾代码块 5: 隐藏的图表统计 -->
    <view v-if="false" class="charts-container">
      <view class="chart-item" v-for="chart in 8" :key="chart">
        <text class="chart-title">图表{{ chart }}</text>
        <view class="chart-canvas">
          <view class="chart-bar" v-for="bar in 50" :key="bar"></view>
        </view>
      </view>
    </view>
    
    <view>
      <u-tabbar 
        :value="currentTabIndex" 
        :placeholder="false"
        activeColor="#667eea"
        inactiveColor="#8c9cb0"
      >
        <u-tabbar-item :text="$t('home.tab1')" @click="switchTabbar(0)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 0 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/home-fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 0 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/home.svg"
          ></image>
        </u-tabbar-item>
        
        <u-tabbar-item :text="$t('home.tab3')" @click="switchTabbar(1)">
          <image
            class="tab-icon"
            :class="currentTabIndex === 1 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="active-icon"
            src="/static/user-Fill.svg"
          ></image>
          <image
            class="tab-icon"
            :class="currentTabIndex === 1 ? 'tab-icon-active' : 'tab-icon-inactive'"
            mode="aspectFit"
            slot="inactive-icon"
            src="/static/user.svg"
          ></image>
        </u-tabbar-item>
      </u-tabbar>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateTab from './tabs/create.vue'
import MineTab from './tabs/mine.vue'

export default {
  components: {
    CreateTab,
    MineTab
  },
  data() {
    return {
      currentTabIndex: 0,
      // 垃圾数据 1
      unusedNotifications: [],
      unusedSearchHistory: [],
      unusedSettings: {},
      unusedAdConfig: null,
      unusedChartData: [],
      unusedUserPreferences: {},
      unusedCacheData: {},
      unusedTempStorage: [],
      unusedAnalytics: {},
      unusedFeatureFlags: {},
      // 垃圾数据 2
      deprecatedTimestamp: 0,
      deprecatedCounter: 0,
      deprecatedFlags: false,
      deprecatedArray: [],
      deprecatedObject: {},
      deprecatedString: '',
      deprecatedNumber: 0,
      deprecatedBoolean: false,
      // 垃圾数据 3
      legacyData: null,
      legacyConfig: {},
      legacyCache: [],
      legacyState: '',
      legacyFlags: false,
      legacyTimer: null,
      legacyInterval: null,
      legacyTimeout: null
    }
  },
  computed: {
    ...mapGetters('user', ['token', 'isLoggedIn']),
    
    // 垃圾计算属性 1
    unusedComputedNotificationCount() {
      return this.unusedNotifications.length
    },
    unusedComputedSearchSuggestions() {
      return this.unusedSearchHistory.slice(0, 10)
    },
    unusedComputedSettingsValid() {
      return Object.keys(this.unusedSettings).length > 0
    },
    unusedComputedAdVisible() {
      return this.unusedAdConfig !== null
    },
    unusedComputedChartReady() {
      return this.unusedChartData.length > 0
    },
    // 垃圾计算属性 2
    deprecatedComputedValue() {
      return this.deprecatedCounter * 2
    },
    deprecatedComputedString() {
      return `Deprecated: ${this.deprecatedString}`
    },
    deprecatedComputedArray() {
      return [...this.deprecatedArray, ...this.legacyCache]
    },
    // 垃圾计算属性 3
    legacyComputedState() {
      return this.legacyState.toUpperCase()
    },
    legacyComputedFlags() {
      return !this.legacyFlags
    }
  },
  onLoad() {
    console.log('🏠 进入首页')
    
    // 如果未登录，跳转到登录页
    if (!this.isLoggedIn) {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
    
    // 垃圾初始化代码
    this.initUnusedData()
    this.initDeprecatedFeatures()
    this.initLegacyComponents()
  },
  methods: {
    /**
     * 切换 Tab
     */
    switchTabbar(index) {
      this.currentTabIndex = index
    },
    
    // 垃圾方法 1: 通知相关
    initUnusedData() {
      // 不会被调用
    },
    loadUnusedNotifications() {
      for (let i = 0; i < 100; i++) {
        this.unusedNotifications.push({
          id: i,
          title: `通知${i}`,
          content: `这是第${i}条通知`,
          timestamp: Date.now()
        })
      }
    },
    clearUnusedNotifications() {
      this.unusedNotifications = []
    },
    markUnusedNotificationAsRead(id) {
      const notification = this.unusedNotifications.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    },
    
    // 垃圾方法 2: 搜索相关
    addUnusedSearchHistory(keyword) {
      if (!this.unusedSearchHistory.includes(keyword)) {
        this.unusedSearchHistory.unshift(keyword)
        if (this.unusedSearchHistory.length > 50) {
          this.unusedSearchHistory.pop()
        }
      }
    },
    clearUnusedSearchHistory() {
      this.unusedSearchHistory = []
    },
    performUnusedSearch(keyword) {
      this.addUnusedSearchHistory(keyword)
      return []
    },
    
    // 垃圾方法 3: 设置相关
    updateUnusedSettings(key, value) {
      this.$set(this.unusedSettings, key, value)
    },
    resetUnusedSettings() {
      this.unusedSettings = {}
    },
    exportUnusedSettings() {
      return JSON.stringify(this.unusedSettings)
    },
    importUnusedSettings(jsonString) {
      try {
        this.unusedSettings = JSON.parse(jsonString)
      } catch (e) {
        console.error('导入设置失败', e)
      }
    },
    
    // 垃圾方法 4: 广告相关
    showUnusedAd() {
      this.unusedAdConfig = {
        type: 'banner',
        position: 'top',
        duration: 5000
      }
    },
    hideUnusedAd() {
      this.unusedAdConfig = null
    },
    trackUnusedAdClick() {
      if (this.unusedAdConfig) {
        console.log('广告被点击')
      }
    },
    
    // 垃圾方法 5: 图表相关
    generateUnusedChartData() {
      const data = []
      for (let i = 0; i < 30; i++) {
        data.push({
          date: new Date(Date.now() - i * 86400000).toISOString(),
          value: Math.random() * 100
        })
      }
      this.unusedChartData = data
    },
    clearUnusedChartData() {
      this.unusedChartData = []
    },
    exportUnusedChartData() {
      return JSON.stringify(this.unusedChartData)
    },
    
    // 垃圾方法 6: 过时功能
    initDeprecatedFeatures() {
      // 不会被调用
    },
    deprecatedMethodOne(param1, param2, param3) {
      this.deprecatedCounter++
      this.deprecatedTimestamp = Date.now()
      return param1 + param2 + param3
    },
    deprecatedMethodTwo() {
      this.deprecatedFlags = !this.deprecatedFlags
      this.deprecatedArray.push(Date.now())
    },
    deprecatedMethodThree(data) {
      this.deprecatedObject = { ...this.deprecatedObject, ...data }
      this.deprecatedString = JSON.stringify(this.deprecatedObject)
    },
    deprecatedCalculation(a, b, c, d, e) {
      return ((a + b) * c - d) / e
    },
    deprecatedValidator(input) {
      return input !== null && input !== undefined && input.length > 0
    },
    
    // 垃圾方法 7: 遗留组件
    initLegacyComponents() {
      // 不会被调用
    },
    legacyStartTimer() {
      if (this.legacyTimer) {
        clearTimeout(this.legacyTimer)
      }
      this.legacyTimer = setTimeout(() => {
        this.legacyState = 'timeout'
      }, 5000)
    },
    legacyStopTimer() {
      if (this.legacyTimer) {
        clearTimeout(this.legacyTimer)
        this.legacyTimer = null
      }
    },
    legacyStartInterval() {
      if (this.legacyInterval) {
        clearInterval(this.legacyInterval)
      }
      this.legacyInterval = setInterval(() => {
        this.legacyCache.push(Date.now())
      }, 1000)
    },
    legacyStopInterval() {
      if (this.legacyInterval) {
        clearInterval(this.legacyInterval)
        this.legacyInterval = null
      }
    },
    legacyProcessData(rawData) {
      return rawData.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
      }))
    },
    legacyFormatString(str) {
      return str.trim().toLowerCase().replace(/\s+/g, '-')
    },
    legacyValidateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return regex.test(email)
    },
    legacyGenerateId() {
      return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },
    
    // 垃圾方法 8: 辅助工具
    unusedHelperOne(data) {
      return data.filter(item => item.active)
    },
    unusedHelperTwo(arr) {
      return arr.reduce((acc, cur) => acc + cur, 0)
    },
    unusedHelperThree(obj) {
      return Object.entries(obj).map(([key, value]) => ({ key, value }))
    },
    unusedHelperFour(str) {
      return str.split('').reverse().join('')
    },
    unusedHelperFive(num) {
      return num.toFixed(2)
    },
    unusedHelperSix(date) {
      return new Date(date).toLocaleDateString()
    },
    unusedHelperSeven(arr1, arr2) {
      return [...new Set([...arr1, ...arr2])]
    },
    unusedHelperEight(obj, key) {
      return obj.hasOwnProperty(key)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
  
  .content {
    width: 100%;
    flex: 1;
    position: relative;
    
    .uni-swiper {
      height: 100%;
    }
  }
  
  .tab-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;  // 为 tabbar 留出空间
    box-sizing: border-box;
    overflow-y: auto;  // 允许滚动
    
    .todo-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx;
      
      .todo-text {
        font-size: 32rpx;
        color: $uni-text-color-grey;
        text-align: center;
      }
    }
  }
  
  .tab-content-mine {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;  // 为 tabbar 留出空间
    box-sizing: border-box;
  }
}

// 垃圾样式 1: 通知面板
.notification-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  height: 100%;
  background: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  transition: right 0.3s ease;
  
  .notification-header {
    height: 100rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1rpx solid #e5e5e5;
    
    .notification-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
    }
    
    .notification-badge {
      background: #ff0000;
      color: #ffffff;
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      font-size: 24rpx;
    }
  }
  
  .notification-list {
    height: calc(100% - 100rpx);
    
    .notification-item {
      padding: 30rpx;
      display: flex;
      border-bottom: 1rpx solid #f0f0f0;
      
      .notification-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
      
      .notification-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        
        .notification-user {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
          margin-bottom: 10rpx;
        }
        
        .notification-message {
          font-size: 26rpx;
          color: #666666;
          margin-bottom: 10rpx;
        }
        
        .notification-time {
          font-size: 22rpx;
          color: #999999;
        }
      }
    }
  }
}

// 垃圾样式 2: 搜索容器
.search-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  z-index: 8888;
  padding: 20rpx;
  
  .search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .search-input {
      flex: 1;
      height: 70rpx;
      border: 2rpx solid #e5e5e5;
      border-radius: 35rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
    }
    
    .search-btn {
      width: 120rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      background: #667eea;
      color: #ffffff;
      border-radius: 35rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
    }
  }
  
  .search-history {
    margin-bottom: 40rpx;
    
    .history-item {
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      font-size: 28rpx;
      color: #666666;
    }
  }
  
  .search-hot {
    .hot-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .hot-tags {
      display: flex;
      flex-wrap: wrap;
      
      .hot-tag {
        background: #f5f5f5;
        color: #666666;
        padding: 10rpx 20rpx;
        border-radius: 20rpx;
        margin: 0 10rpx 10rpx 0;
        font-size: 26rpx;
      }
    }
  }
}

// 垃圾样式 3: 设置面板
.settings-panel {
  position: fixed;
  bottom: -100%;
  left: 0;
  width: 100%;
  max-height: 80%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  z-index: 7777;
  transition: bottom 0.3s ease;
  overflow-y: auto;
  
  .settings-group {
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .group-title {
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25rpx 0;
      
      .setting-label {
        font-size: 30rpx;
        color: #333333;
      }
      
      .setting-switch {
        transform: scale(0.8);
      }
    }
  }
}

// 垃圾样式 4: 广告弹窗
.ad-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6666;
  
  .ad-content {
    width: 600rpx;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 40rpx;
    
    .ad-image {
      width: 100%;
      height: 400rpx;
      border-radius: 10rpx;
      margin-bottom: 30rpx;
    }
    
    .ad-buttons {
      display: flex;
      justify-content: space-between;
      
      .ad-btn-primary {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        background: #667eea;
        color: #ffffff;
        border: none;
        border-radius: 40rpx;
        font-size: 30rpx;
        margin-right: 20rpx;
      }
      
      .ad-btn-secondary {
        flex: 1;
        height: 80rpx;
        line-height: 80rpx;
        background: #f5f5f5;
        color: #666666;
        border: none;
        border-radius: 40rpx;
        font-size: 30rpx;
      }
    }
  }
}

// 垃圾样式 5: 图表容器
.charts-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  z-index: 5555;
  overflow-y: auto;
  padding: 20rpx;
  
  .chart-item {
    background: #ffffff;
    border-radius: 10rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    
    .chart-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .chart-canvas {
      height: 400rpx;
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      
      .chart-bar {
        width: 10rpx;
        background: linear-gradient(to top, #667eea, #764ba2);
        border-radius: 5rpx 5rpx 0 0;
        height: 200rpx;
      }
    }
  }
}

// 垃圾样式 6: 废弃的动画
@keyframes unused-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes unused-slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes unused-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes unused-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

@keyframes unused-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 垃圾样式 7: 废弃的组件类
.deprecated-container {
  padding: 20rpx;
  background: #f9f9f9;
}

.deprecated-header {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
  margin-bottom: 20rpx;
}

.deprecated-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.6;
}

.deprecated-footer {
  text-align: center;
  padding: 20rpx;
  color: #999999;
  font-size: 24rpx;
}

.deprecated-button {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 40rpx;
  font-size: 30rpx;
}

.deprecated-list {
  .deprecated-list-item {
    padding: 30rpx;
    background: #ffffff;
    margin-bottom: 10rpx;
    border-radius: 10rpx;
    
    .item-title {
      font-size: 30rpx;
      color: #333333;
      margin-bottom: 10rpx;
    }
    
    .item-desc {
      font-size: 26rpx;
      color: #999999;
    }
  }
}

// 垃圾样式 8: 遗留的工具类
.legacy-flex {
  display: flex;
}

.legacy-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.legacy-flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.legacy-flex-column {
  display: flex;
  flex-direction: column;
}

.legacy-text-center {
  text-align: center;
}

.legacy-text-left {
  text-align: left;
}

.legacy-text-right {
  text-align: right;
}

.legacy-bg-primary {
  background: #667eea;
}

.legacy-bg-secondary {
  background: #764ba2;
}

.legacy-bg-success {
  background: #4caf50;
}

.legacy-bg-danger {
  background: #f44336;
}

.legacy-bg-warning {
  background: #ff9800;
}

.legacy-bg-info {
  background: #2196f3;
}

.legacy-text-primary {
  color: #667eea;
}

.legacy-text-secondary {
  color: #764ba2;
}

.legacy-text-success {
  color: #4caf50;
}

.legacy-text-danger {
  color: #f44336;
}

.legacy-text-warning {
  color: #ff9800;
}

.legacy-text-info {
  color: #2196f3;
}

.legacy-shadow-sm {
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.legacy-shadow-md {
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}

.legacy-shadow-lg {
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.1);
}

.legacy-rounded-sm {
  border-radius: 5rpx;
}

.legacy-rounded-md {
  border-radius: 10rpx;
}

.legacy-rounded-lg {
  border-radius: 20rpx;
}

.legacy-rounded-full {
  border-radius: 999rpx;
}

::v-deep .u-tabbar {
  background: $uni-bg-color;
  border-top: 1rpx solid $uni-border-color;
}

::v-deep .u-tabbar__content {
  background-color: $uni-bg-color;
}

::v-deep .u-tabbar-item__text {
  font-size: 24rpx;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
}

// 未激活状态的图标 - 灰色 #8c9cb0
.tab-icon-inactive {
  filter: brightness(0) saturate(100%) invert(62%) sepia(8%) saturate(686%) hue-rotate(172deg) brightness(92%) contrast(90%);
}

// 激活状态的图标 - 品牌主色紫色 #667eea
.tab-icon-active {
  filter: brightness(0) saturate(100%) invert(42%) sepia(78%) saturate(1893%) hue-rotate(220deg) brightness(98%) contrast(88%);
}
</style>
