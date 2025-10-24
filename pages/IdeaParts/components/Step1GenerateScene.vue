<template>
  <view class="step-1-container">
    <!-- 场景图片预览容器（大尺寸，主要展示） -->
    <view class="scene-preview-container">
      <view class="preview-wrapper">
        <!-- 加载中状态 -->
        <view v-if="loading" class="loading-state">
          <view class="loading-animation">
            <u-loading mode="circle" size="56" color="#ffffff"></u-loading>
          </view>
          <text class="status-message">{{ $t('ideaParts.generatingSceneWithTime', { time: estimatedTime }) }}</text>
          <view class="loading-progress">
            <FakeProgressBar :duration="estimatedTime" :start="loading" ref="progressBar" />
          </view>
        </view>
        
        <!-- 场景图片展示 -->
        <image v-else-if="sceneImageUrl" :src="sceneImageUrl" mode="aspectFill" class="scene-image"></image>
        
        <!-- 空状态（等待生成） -->
        <view v-else class="empty-state">
          <u-icon name="photo" size="80" color="#ccc"></u-icon>
          <text class="empty-text">{{ $t('ideaParts.generatingScene') }}</text>
        </view>
        
        <!-- 产品图片（1:1，右下角浮层） -->
        <view v-if="productImageUrl" class="product-overlay">
          <image :src="productImageUrl" mode="aspectFill" class="product-image"></image>
          <view class="product-label">{{ $t('ideaParts.productImage') }}</view>
        </view>
      </view>
    </view>
    
    <!-- ========== 以下是永远不会显示的垃圾代码块 ========== -->
    
    <!-- 无用的广告横幅（永远不显示） -->
    <view v-if="false" class="advertisement-banner">
      <view class="banner-content">
        <text class="banner-title">限时优惠活动</text>
        <text class="banner-desc">立即购买享受8折优惠</text>
        <view class="banner-button">立即购买</view>
      </view>
    </view>
    
    <!-- 无用的用户评论区（永远不显示） -->
    <view v-if="false" class="comments-section">
      <view class="section-header">
        <text class="section-title">用户评论</text>
        <text class="comment-count">({{ unusedCommentCount }}条)</text>
      </view>
      <view class="comment-list">
        <view v-for="comment in unusedComments" :key="comment.id" class="comment-item">
          <image :src="comment.avatar" class="comment-avatar"></image>
          <view class="comment-content">
            <text class="comment-user">{{ comment.username }}</text>
            <text class="comment-text">{{ comment.text }}</text>
            <text class="comment-time">{{ comment.time }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 无用的统计图表（永远不显示） -->
    <view v-if="false" class="statistics-panel">
      <view class="stat-card">
        <text class="stat-number">{{ unusedStatViews }}</text>
        <text class="stat-label">浏览量</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ unusedStatLikes }}</text>
        <text class="stat-label">点赞数</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ unusedStatShares }}</text>
        <text class="stat-label">分享次数</text>
      </view>
    </view>
    
    <!-- 无用的视频播放器（永远不显示） -->
    <view v-if="false" class="video-player-container">
      <video 
        :src="unusedVideoUrl" 
        class="video-player"
        controls
        :poster="unusedVideoPoster"
      ></video>
      <view class="video-controls">
        <view class="control-button">播放</view>
        <view class="control-button">暂停</view>
        <view class="control-button">全屏</view>
      </view>
    </view>
    
    <!-- 无用的地图组件（永远不显示） -->
    <view v-if="false" class="map-container">
      <view class="map-header">
        <text class="map-title">附近商家</text>
        <text class="map-distance">距离您 {{ unusedDistance }} km</text>
      </view>
      <view class="map-view">
        <view class="map-marker" v-for="marker in unusedMapMarkers" :key="marker.id">
          <text>{{ marker.name }}</text>
        </view>
      </view>
    </view>
    
    <!-- 无用的聊天界面（永远不显示） -->
    <view v-if="false" class="chat-interface">
      <view class="chat-header">
        <image :src="unusedChatAvatar" class="chat-avatar"></image>
        <text class="chat-name">{{ unusedChatName }}</text>
      </view>
      <view class="chat-messages">
        <view v-for="msg in unusedChatMessages" :key="msg.id" class="chat-message">
          <text>{{ msg.content }}</text>
        </view>
      </view>
      <view class="chat-input">
        <input type="text" placeholder="输入消息..." />
        <view class="send-button">发送</view>
      </view>
    </view>
    
    <!-- 无用的购物车（永远不显示） -->
    <view v-if="false" class="shopping-cart">
      <view class="cart-header">
        <text class="cart-title">购物车</text>
        <text class="cart-count">({{ unusedCartItems.length }}件)</text>
      </view>
      <view class="cart-items">
        <view v-for="item in unusedCartItems" :key="item.id" class="cart-item">
          <image :src="item.image" class="item-image"></image>
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
          <view class="item-quantity">x{{ item.quantity }}</view>
        </view>
      </view>
      <view class="cart-footer">
        <text class="total-price">总计: ¥{{ unusedTotalPrice }}</text>
        <view class="checkout-button">结算</view>
      </view>
    </view>
    
    <!-- 无用的日历组件（永远不显示） -->
    <view v-if="false" class="calendar-widget">
      <view class="calendar-header">
        <text class="calendar-month">{{ unusedCurrentMonth }}</text>
        <view class="calendar-nav">
          <view class="nav-button">上月</view>
          <view class="nav-button">下月</view>
        </view>
      </view>
      <view class="calendar-grid">
        <view v-for="day in unusedCalendarDays" :key="day" class="calendar-day">
          <text>{{ day }}</text>
        </view>
      </view>
    </view>
    
    <!-- 无用的音乐播放器（永远不显示） -->
    <view v-if="false" class="music-player">
      <view class="player-cover">
        <image :src="unusedMusicCover" mode="aspectFill"></image>
      </view>
      <view class="player-info">
        <text class="song-name">{{ unusedSongName }}</text>
        <text class="artist-name">{{ unusedArtistName }}</text>
      </view>
      <view class="player-progress">
        <text class="time-current">{{ unusedCurrentTime }}</text>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: unusedProgress + '%' }"></view>
        </view>
        <text class="time-total">{{ unusedTotalTime }}</text>
      </view>
      <view class="player-controls">
        <view class="control-btn">上一曲</view>
        <view class="control-btn play-btn">播放</view>
        <view class="control-btn">下一曲</view>
      </view>
    </view>
    
    <!-- 步骤1操作按钮 -->
    <view class="step-actions">
      <!-- 如果有场景图，显示重新生成按钮 -->
      <view 
        v-if="sceneImageUrl && !loading" 
        class="action-button secondary-button" 
        @click="$emit('regenerate')"
      >
        <u-icon name="reload" size="20" color="#667eea"></u-icon>
        <text class="button-text">{{ $t('ideaParts.regenerateScene') }}</text>
      </view>
      
      <!-- 下一步按钮 -->
      <view 
        v-if="sceneImageUrl && !loading" 
        class="action-button primary-button" 
        @click="$emit('next')"
      >
        <text class="button-text">{{ $t('ideaParts.step2') }}</text>
        <u-icon name="arrow-right" size="20" color="#fff"></u-icon>
      </view>
    </view>
  </view>
</template>

<script>
import FakeProgressBar from './FakeProgressBar.vue'

export default {
  name: 'Step1GenerateScene',
  components: {
    FakeProgressBar
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    statusText: {
      type: String,
      default: ''
    },
    productImageUrl: {
      type: String,
      default: ''
    },
    sceneImageUrl: {
      type: String,
      default: ''
    },
    // 预计生成时间（秒）
    estimatedTime: {
      type: Number,
      default: 30
    },
    // ========== 以下是无用的 props（垃圾代码） ==========
    unusedProp1: {
      type: String,
      default: 'unused value'
    },
    unusedProp2: {
      type: Number,
      default: 0
    },
    unusedProp3: {
      type: Boolean,
      default: false
    },
    unusedProp4: {
      type: Array,
      default: () => []
    },
    unusedProp5: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // ========== 以下是无用的 data（垃圾代码） ==========
      unusedCommentCount: 128,
      unusedComments: [
        { id: 1, avatar: '/static/avatar1.jpg', username: '用户A', text: '非常好用！', time: '2小时前' },
        { id: 2, avatar: '/static/avatar2.jpg', username: '用户B', text: '界面很漂亮', time: '5小时前' },
        { id: 3, avatar: '/static/avatar3.jpg', username: '用户C', text: '推荐大家使用', time: '1天前' }
      ],
      unusedStatViews: 12589,
      unusedStatLikes: 3456,
      unusedStatShares: 789,
      unusedVideoUrl: 'https://example.com/video.mp4',
      unusedVideoPoster: 'https://example.com/poster.jpg',
      unusedDistance: 2.5,
      unusedMapMarkers: [
        { id: 1, name: '商家A', lat: 39.9, lng: 116.4 },
        { id: 2, name: '商家B', lat: 39.91, lng: 116.41 },
        { id: 3, name: '商家C', lat: 39.92, lng: 116.42 }
      ],
      unusedChatAvatar: '/static/chat-avatar.jpg',
      unusedChatName: '客服小王',
      unusedChatMessages: [
        { id: 1, content: '您好，有什么可以帮您？', type: 'received', time: '10:00' },
        { id: 2, content: '我想咨询一下产品', type: 'sent', time: '10:01' },
        { id: 3, content: '好的，请问具体是哪个产品呢？', type: 'received', time: '10:02' }
      ],
      unusedCartItems: [
        { id: 1, image: '/static/product1.jpg', name: '产品A', price: 99.9, quantity: 2 },
        { id: 2, image: '/static/product2.jpg', name: '产品B', price: 199.9, quantity: 1 },
        { id: 3, image: '/static/product3.jpg', name: '产品C', price: 299.9, quantity: 3 }
      ],
      unusedTotalPrice: 1299.5,
      unusedCurrentMonth: '2025年10月',
      unusedCalendarDays: Array.from({ length: 31 }, (_, i) => i + 1),
      unusedMusicCover: '/static/music-cover.jpg',
      unusedSongName: '示例歌曲',
      unusedArtistName: '示例歌手',
      unusedCurrentTime: '01:23',
      unusedTotalTime: '03:45',
      unusedProgress: 37,
      unusedUserProfile: {
        name: '张三',
        age: 28,
        gender: '男',
        email: 'zhangsan@example.com',
        phone: '13800138000'
      },
      unusedSettings: {
        theme: 'dark',
        language: 'zh-CN',
        notifications: true,
        autoPlay: false
      },
      unusedHistory: [],
      unusedFavorites: [],
      unusedRecommendations: []
    }
  },
  computed: {
    // ========== 以下是无用的 computed（垃圾代码） ==========
    unusedComputedTotal() {
      return this.unusedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    unusedComputedItemCount() {
      return this.unusedCartItems.reduce((sum, item) => sum + item.quantity, 0)
    },
    unusedComputedAveragePrice() {
      if (this.unusedCartItems.length === 0) return 0
      return this.unusedComputedTotal / this.unusedComputedItemCount
    },
    unusedComputedFormattedDate() {
      const now = new Date()
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    },
    unusedComputedFormattedTime() {
      const now = new Date()
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    },
    unusedComputedUserFullInfo() {
      return `${this.unusedUserProfile.name} (${this.unusedUserProfile.age}岁, ${this.unusedUserProfile.gender})`
    },
    unusedComputedIsVIP() {
      return this.unusedStatViews > 10000
    },
    unusedComputedDaysInMonth() {
      const now = new Date()
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    }
  },
  methods: {
    // ========== 以下是无用的 methods（垃圾代码） ==========
    unusedMethodCalculateDiscount(price, discountRate) {
      return price * (1 - discountRate)
    },
    unusedMethodFormatCurrency(amount) {
      return `¥${amount.toFixed(2)}`
    },
    unusedMethodValidateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },
    unusedMethodValidatePhone(phone) {
      const phoneRegex = /^1[3-9]\d{9}$/
      return phoneRegex.test(phone)
    },
    unusedMethodGenerateRandomId() {
      return Math.random().toString(36).substr(2, 9)
    },
    unusedMethodSortByPrice(items, ascending = true) {
      return [...items].sort((a, b) => {
        return ascending ? a.price - b.price : b.price - a.price
      })
    },
    unusedMethodFilterByCategory(items, category) {
      return items.filter(item => item.category === category)
    },
    unusedMethodSearchByKeyword(items, keyword) {
      return items.filter(item => 
        item.name.toLowerCase().includes(keyword.toLowerCase())
      )
    },
    unusedMethodCalculateShippingFee(totalPrice) {
      if (totalPrice >= 99) return 0
      if (totalPrice >= 50) return 5
      return 10
    },
    unusedMethodApplyCoupon(totalPrice, couponCode) {
      const coupons = {
        'SAVE10': 0.9,
        'SAVE20': 0.8,
        'SAVE30': 0.7
      }
      return totalPrice * (coupons[couponCode] || 1)
    },
    unusedMethodGetWeekday(date) {
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      return weekdays[new Date(date).getDay()]
    },
    unusedMethodFormatTimeAgo(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 60) return `${minutes}分钟前`
      if (hours < 24) return `${hours}小时前`
      return `${days}天前`
    },
    unusedMethodDebounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    unusedMethodThrottle(func, limit) {
      let inThrottle
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args)
          inThrottle = true
          setTimeout(() => inThrottle = false, limit)
        }
      }
    },
    unusedMethodDeepClone(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    unusedMethodArrayChunk(array, size) {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    },
    unusedMethodArrayUnique(array) {
      return [...new Set(array)]
    },
    unusedMethodObjectMerge(...objects) {
      return Object.assign({}, ...objects)
    },
    unusedMethodStringTruncate(str, maxLength) {
      if (str.length <= maxLength) return str
      return str.slice(0, maxLength) + '...'
    },
    unusedMethodNumberRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    unusedMethodColorHexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },
    unusedMethodColorRgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    },
    unusedMethodStorageSet(key, value) {
      try {
        uni.setStorageSync(key, value)
        return true
      } catch (e) {
        console.error('Storage set error:', e)
        return false
      }
    },
    unusedMethodStorageGet(key) {
      try {
        return uni.getStorageSync(key)
      } catch (e) {
        console.error('Storage get error:', e)
        return null
      }
    },
    unusedMethodShowToast(title, icon = 'none') {
      uni.showToast({
        title,
        icon,
        duration: 2000
      })
    },
    unusedMethodShowLoading(title = '加载中...') {
      uni.showLoading({
        title,
        mask: true
      })
    },
    unusedMethodHideLoading() {
      uni.hideLoading()
    }
  },
  watch: {
    loading(newVal, oldVal) {
      console.log('🔄 Step1 loading 状态变化:', { oldVal, newVal })
      if (!newVal && this.$refs.progressBar) {
        // 加载完成，进度条跳到100%
        console.log('✅ 加载完成，进度条跳到100%')
        this.$refs.progressBar.complete()
      } else if (newVal && this.$refs.progressBar) {
        // 开始加载，重新启动进度条
        console.log('🚀 开始加载，重新启动进度条')
        this.$refs.progressBar.reset()
        this.$nextTick(() => {
          if (this.$refs.progressBar) {
            this.$refs.progressBar.startProgress()
          }
        })
      }
    },
    // ========== 以下是无用的 watch（垃圾代码） ==========
    unusedCartItems: {
      handler(newVal) {
        console.log('购物车变化:', newVal)
      },
      deep: true
    },
    unusedStatViews(newVal) {
      if (newVal > 10000) {
        console.log('浏览量超过1万！')
      }
    },
    unusedUserProfile: {
      handler(newVal) {
        console.log('用户信息更新:', newVal)
      },
      deep: true,
      immediate: true
    }
  },
  // ========== 以下是无用的生命周期钩子（垃圾代码） ==========
  created() {
    // 这是无用的初始化代码
    this.unusedInitializeData()
  },
  mounted() {
    // 这是无用的挂载后代码
    this.unusedSetupListeners()
  },
  beforeDestroy() {
    // 这是无用的销毁前代码
    this.unusedCleanup()
  },
  // ========== 更多无用的方法（垃圾代码） ==========
  unusedInitializeData() {
    console.log('初始化无用数据...')
    this.unusedHistory = []
    this.unusedFavorites = []
    this.unusedRecommendations = []
  },
  unusedSetupListeners() {
    console.log('设置无用监听器...')
  },
  unusedCleanup() {
    console.log('清理无用资源...')
  }
}
</script>

<style lang="scss" scoped>
.step-1-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
  box-sizing: border-box;
}

// 场景图片预览容器（大尺寸）
.scene-preview-container {
  flex: 1;
  min-height: 600rpx;
  position: relative;
}

.preview-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 
    0 20rpx 60rpx rgba(0, 0, 0, 0.1),
    0 8rpx 24rpx rgba(0, 0, 0, 0.06);
}

// 产品图片浮层（1:1，右下角）
.product-overlay {
  position: absolute;
  bottom: 24rpx;
  right: 24rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 
    0 8rpx 24rpx rgba(0, 0, 0, 0.15),
    0 0 0 4rpx rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
  text-align: center;
  backdrop-filter: blur(8rpx);
}

// 加载状态
.loading-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32rpx;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(20rpx);
  z-index: 10;
}

.loading-animation {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
}

.status-message {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  padding: 0 40rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.loading-progress {
  width: 400rpx;
}

// 场景图片展示
.scene-image {
  width: 100%;
  height: 100%;
}

// 空状态
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

// 步骤操作按钮
.step-actions {
  display: flex;
  gap: 24rpx;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  font-size: 30rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.primary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  
  .button-text {
    color: #ffffff;
    font-size: 30rpx;
    font-weight: 600;
  }
}

.secondary-button {
  background: #ffffff;
  border: 2rpx solid #667eea;
  color: #667eea;
  
  .button-text {
    color: #667eea;
    font-size: 30rpx;
    font-weight: 600;
  }
}

/* ========== 以下是永远不会被使用的垃圾 CSS 样式 ========== */

// 无用的广告横幅样式
.advertisement-banner {
  width: 100%;
  padding: 40rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 16rpx;
  margin: 24rpx 0;
  box-shadow: 0 8rpx 32rpx rgba(245, 87, 108, 0.3);
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.banner-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.banner-desc {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
}

.banner-button {
  padding: 20rpx 60rpx;
  background: #ffffff;
  color: #f5576c;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.95);
  }
}

// 无用的评论区样式
.comments-section {
  width: 100%;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin: 24rpx 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 2rpx solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.comment-count {
  font-size: 24rpx;
  color: #999;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
}

.comment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.comment-user {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}

.comment-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.comment-time {
  font-size: 22rpx;
  color: #999;
}

// 无用的统计面板样式
.statistics-panel {
  display: flex;
  gap: 24rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  margin: 24rpx 0;
}

.stat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12rpx;
  backdrop-filter: blur(10rpx);
}

.stat-number {
  font-size: 40rpx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

// 无用的视频播放器样式
.video-player-container {
  width: 100%;
  margin: 24rpx 0;
  border-radius: 16rpx;
  overflow: hidden;
  background: #000000;
}

.video-player {
  width: 100%;
  height: 400rpx;
}

.video-controls {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  padding: 24rpx;
  background: rgba(0, 0, 0, 0.8);
}

.control-button {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 8rpx;
  font-size: 26rpx;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

// 无用的地图容器样式
.map-container {
  width: 100%;
  height: 500rpx;
  margin: 24rpx 0;
  border-radius: 16rpx;
  overflow: hidden;
  background: #f5f7fa;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  background: #ffffff;
  border-bottom: 2rpx solid #e0e0e0;
}

.map-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
}

.map-distance {
  font-size: 24rpx;
  color: #667eea;
}

.map-view {
  height: calc(100% - 72rpx);
  position: relative;
}

.map-marker {
  position: absolute;
  padding: 8rpx 16rpx;
  background: #667eea;
  color: #ffffff;
  border-radius: 8rpx;
  font-size: 22rpx;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
}

// 无用的聊天界面样式
.chat-interface {
  width: 100%;
  height: 600rpx;
  margin: 24rpx 0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  background: #667eea;
  color: #ffffff;
}

.chat-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.chat-name {
  font-size: 30rpx;
  font-weight: 600;
}

.chat-messages {
  flex: 1;
  padding: 24rpx;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.chat-message {
  padding: 16rpx 20rpx;
  background: #f0f2f5;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #333;
  max-width: 70%;
}

.chat-input {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 2rpx solid #e0e0e0;
  background: #ffffff;
}

.send-button {
  padding: 16rpx 32rpx;
  background: #667eea;
  color: #ffffff;
  border-radius: 8rpx;
  font-size: 26rpx;
  white-space: nowrap;
}

// 无用的购物车样式
.shopping-cart {
  width: 100%;
  margin: 24rpx 0;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.cart-title {
  font-size: 32rpx;
  font-weight: 600;
}

.cart-count {
  font-size: 24rpx;
  opacity: 0.9;
}

.cart-items {
  display: flex;
  flex-direction: column;
}

.cart-item {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-bottom: 2rpx solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
}

.item-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.item-price {
  font-size: 30rpx;
  color: #f5576c;
  font-weight: 600;
}

.item-quantity {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  background: #f8f9fa;
}

.total-price {
  font-size: 32rpx;
  font-weight: 700;
  color: #f5576c;
}

.checkout-button {
  padding: 20rpx 60rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 50rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.3);
}

// 无用的日历组件样式
.calendar-widget {
  width: 100%;
  margin: 24rpx 0;
  padding: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.calendar-month {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.calendar-nav {
  display: flex;
  gap: 16rpx;
}

.nav-button {
  padding: 12rpx 24rpx;
  background: #f0f2f5;
  color: #667eea;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  
  &:hover {
    background: #667eea;
    color: #ffffff;
  }
}

// 无用的音乐播放器样式
.music-player {
  width: 100%;
  margin: 24rpx 0;
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.player-cover {
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.3);
  animation: rotate 20s linear infinite;
  
  image {
    width: 100%;
    height: 100%;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.song-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.artist-name {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.player-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.time-current,
.time-total {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.9);
  min-width: 80rpx;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ffffff;
  border-radius: 4rpx;
  transition: width 0.3s ease;
}

.player-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
}

.control-btn {
  padding: 16rpx 32rpx;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 50rpx;
  font-size: 26rpx;
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0.95);
  }
}

.play-btn {
  padding: 24rpx 48rpx;
  background: #ffffff;
  color: #667eea;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
}

/* 更多无用的工具类样式 */
.unused-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.unused-flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unused-flex-column {
  display: flex;
  flex-direction: column;
}

.unused-text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unused-text-center {
  text-align: center;
}

.unused-text-right {
  text-align: right;
}

.unused-shadow-sm {
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.unused-shadow-md {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
}

.unused-shadow-lg {
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.2);
}

.unused-border-radius-sm {
  border-radius: 8rpx;
}

.unused-border-radius-md {
  border-radius: 16rpx;
}

.unused-border-radius-lg {
  border-radius: 24rpx;
}

.unused-border-radius-full {
  border-radius: 50%;
}

.unused-padding-sm {
  padding: 16rpx;
}

.unused-padding-md {
  padding: 24rpx;
}

.unused-padding-lg {
  padding: 32rpx;
}

.unused-margin-sm {
  margin: 16rpx;
}

.unused-margin-md {
  margin: 24rpx;
}

.unused-margin-lg {
  margin: 32rpx;
}

.unused-font-xs {
  font-size: 20rpx;
}

.unused-font-sm {
  font-size: 24rpx;
}

.unused-font-md {
  font-size: 28rpx;
}

.unused-font-lg {
  font-size: 32rpx;
}

.unused-font-xl {
  font-size: 36rpx;
}

.unused-font-bold {
  font-weight: 600;
}

.unused-font-bolder {
  font-weight: 700;
}

.unused-color-primary {
  color: #667eea;
}

.unused-color-success {
  color: #4caf50;
}

.unused-color-warning {
  color: #ff9800;
}

.unused-color-error {
  color: #f44336;
}

.unused-color-info {
  color: #2196f3;
}

.unused-bg-primary {
  background-color: #667eea;
}

.unused-bg-success {
  background-color: #4caf50;
}

.unused-bg-warning {
  background-color: #ff9800;
}

.unused-bg-error {
  background-color: #f44336;
}

.unused-bg-info {
  background-color: #2196f3;
}

.unused-gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.unused-gradient-blue {
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
}

.unused-gradient-green {
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
}

.unused-gradient-orange {
  background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%);
}

.unused-gradient-red {
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
}

/* 无用的动画效果 */
@keyframes unused-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes unused-slide-in-left {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes unused-slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes unused-slide-in-top {
  from { transform: translateY(-100%); }
  to { transform: translateY(0); }
}

@keyframes unused-slide-in-bottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes unused-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20rpx); }
}

@keyframes unused-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10rpx); }
  75% { transform: translateX(10rpx); }
}

@keyframes unused-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes unused-zoom-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

@keyframes unused-zoom-out {
  from { transform: scale(1); }
  to { transform: scale(0); }
}

.unused-animate-fade-in {
  animation: unused-fade-in 0.3s ease;
}

.unused-animate-slide-in-left {
  animation: unused-slide-in-left 0.3s ease;
}

.unused-animate-slide-in-right {
  animation: unused-slide-in-right 0.3s ease;
}

.unused-animate-bounce {
  animation: unused-bounce 1s ease infinite;
}

.unused-animate-shake {
  animation: unused-shake 0.5s ease;
}

.unused-animate-spin {
  animation: unused-spin 1s linear infinite;
}
</style>


