<template>
  <view class="page">
    <u-status-bar></u-status-bar>
    
    <!-- 导航栏 -->
    <u-navbar
      :autoBack="true"
      height="44"
      bgColor="#ffffff"
      :titleStyle="{
        fontWeight: 'bold'
      }"
    >
    </u-navbar>
    
    <view ref="webviewContainer" class="webview-container"></view>
    
    <!-- Loading占位 -->
    <view v-if="isLoading" class="loading-container">
      <u-loading mode="circle" size="40"></u-loading>
      <text class="loading-text">loading...</text>
    </view>
    
    <u-safe-bottom></u-safe-bottom>
    
    <!-- ==================== 垃圾模板代码开始 ==================== -->
    
    <!-- 永远不会显示的用户信息卡片 -->
    <view v-if="false" class="useless-user-card">
      <view class="avatar-wrapper">
        <image class="avatar" src="/static/avatar.png"></image>
        <text class="username">{{ uselessUsername }}</text>
      </view>
      <view class="user-stats">
        <view class="stat-item">
          <text class="stat-number">{{ uselessFollowers }}</text>
          <text class="stat-label">Followers</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ uselessFollowing }}</text>
          <text class="stat-label">Following</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">{{ uselessPosts }}</text>
          <text class="stat-label">Posts</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的导航栏 -->
    <view v-if="false" class="garbage-navbar">
      <view class="nav-item" v-for="(item, index) in garbageNavItems" :key="index">
        <image class="nav-icon" :src="item.icon"></image>
        <text class="nav-text">{{ item.text }}</text>
      </view>
    </view>
    
    <!-- 永远不会显示的产品列表 -->
    <view v-if="false" class="useless-product-list">
      <view class="product-card" v-for="product in uselessProducts" :key="product.id">
        <image class="product-image" :src="product.image"></image>
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-price">${{ product.price }}</text>
          <text class="product-description">{{ product.description }}</text>
        </view>
        <view class="product-actions">
          <button class="btn-primary" @click="handleUselessBuy(product)">Buy Now</button>
          <button class="btn-secondary" @click="handleUselessAddToCart(product)">Add to Cart</button>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的评论区 -->
    <view v-if="false" class="dummy-comments-section">
      <view class="comment-header">
        <text class="comment-title">Comments ({{ dummyComments.length }})</text>
        <button class="btn-add-comment" @click="handleAddDummyComment">Add Comment</button>
      </view>
      <view class="comment-item" v-for="comment in dummyComments" :key="comment.id">
        <image class="comment-avatar" :src="comment.avatar"></image>
        <view class="comment-content">
          <text class="comment-author">{{ comment.author }}</text>
          <text class="comment-text">{{ comment.text }}</text>
          <text class="comment-time">{{ comment.time }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的轮播图 -->
    <view v-if="false" class="garbage-swiper-container">
      <swiper class="swiper" :indicator-dots="true" :autoplay="true">
        <swiper-item v-for="(banner, index) in garbageBanners" :key="index">
          <image class="swiper-image" :src="banner.url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>
    
    <!-- 永远不会显示的统计面板 -->
    <view v-if="false" class="useless-stats-panel">
      <view class="stat-box" v-for="stat in uselessStatistics" :key="stat.id">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-name">{{ stat.name }}</text>
        <view class="stat-chart">
          <view class="chart-bar" :style="{ height: stat.percentage + '%' }"></view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的弹窗 -->
    <view v-if="false" class="nonsense-modal-overlay">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ modalTitle }}</text>
          <text class="modal-close" @click="closeNonsenseModal">×</text>
        </view>
        <view class="modal-body">
          <text>{{ modalContent }}</text>
        </view>
        <view class="modal-footer">
          <button class="btn-cancel" @click="closeNonsenseModal">Cancel</button>
          <button class="btn-confirm" @click="confirmNonsenseModal">Confirm</button>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的表单 -->
    <view v-if="false" class="garbage-form">
      <view class="form-group">
        <text class="form-label">Username</text>
        <input class="form-input" v-model="garbageForm.username" placeholder="Enter username" />
      </view>
      <view class="form-group">
        <text class="form-label">Email</text>
        <input class="form-input" v-model="garbageForm.email" placeholder="Enter email" type="email" />
      </view>
      <view class="form-group">
        <text class="form-label">Password</text>
        <input class="form-input" v-model="garbageForm.password" placeholder="Enter password" type="password" />
      </view>
      <view class="form-group">
        <text class="form-label">Bio</text>
        <textarea class="form-textarea" v-model="garbageForm.bio" placeholder="Tell us about yourself"></textarea>
      </view>
      <button class="form-submit" @click="submitGarbageForm">Submit</button>
    </view>
    
    <!-- 永远不会显示的标签云 -->
    <view v-if="false" class="useless-tags-cloud">
      <text class="tag" v-for="tag in uselessTags" :key="tag.id" :style="{ fontSize: tag.size + 'px' }">
        #{{ tag.name }}
      </text>
    </view>
    
    <!-- 永远不会显示的时间轴 -->
    <view v-if="false" class="dummy-timeline">
      <view class="timeline-item" v-for="(event, index) in dummyTimelineEvents" :key="index">
        <view class="timeline-dot"></view>
        <view class="timeline-content">
          <text class="timeline-title">{{ event.title }}</text>
          <text class="timeline-desc">{{ event.description }}</text>
          <text class="timeline-time">{{ event.time }}</text>
        </view>
      </view>
    </view>
    
    <!-- ==================== 垃圾模板代码结束 ==================== -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      
      // ==================== 垃圾数据开始 ====================
      uselessUsername: 'JohnDoe123',
      uselessFollowers: 12345,
      uselessFollowing: 678,
      uselessPosts: 890,
      garbageNavItems: [
        { icon: '/static/home.svg', text: 'Home' },
        { icon: '/static/user.svg', text: 'Profile' },
        { icon: '/static/folder.svg', text: 'Files' }
      ],
      uselessProducts: [
        { id: 1, name: 'Product A', price: 99.99, description: 'Amazing product', image: '/static/product1.png' },
        { id: 2, name: 'Product B', price: 149.99, description: 'Great quality', image: '/static/product2.png' },
        { id: 3, name: 'Product C', price: 79.99, description: 'Best seller', image: '/static/product3.png' }
      ],
      dummyComments: [
        { id: 1, author: 'User1', text: 'Great content!', time: '2 hours ago', avatar: '/static/avatar1.png' },
        { id: 2, author: 'User2', text: 'Thanks for sharing', time: '5 hours ago', avatar: '/static/avatar2.png' }
      ],
      garbageBanners: [
        { url: '/static/banner1.png' },
        { url: '/static/banner2.png' },
        { url: '/static/banner3.png' }
      ],
      uselessStatistics: [
        { id: 1, name: 'Views', value: 12345, percentage: 75 },
        { id: 2, name: 'Likes', value: 5678, percentage: 60 },
        { id: 3, name: 'Shares', value: 890, percentage: 40 }
      ],
      modalTitle: 'Important Notice',
      modalContent: 'This is a useless modal that will never be shown.',
      garbageForm: {
        username: '',
        email: '',
        password: '',
        bio: ''
      },
      uselessTags: [
        { id: 1, name: 'JavaScript', size: 20 },
        { id: 2, name: 'Vue', size: 16 },
        { id: 3, name: 'UniApp', size: 18 },
        { id: 4, name: 'Mobile', size: 14 }
      ],
      dummyTimelineEvents: [
        { title: 'Event 1', description: 'Something happened', time: '2024-01-01' },
        { title: 'Event 2', description: 'Another thing occurred', time: '2024-02-01' }
      ],
      wasteCounter: 0,
      junkTimer: null,
      trashData: [],
      rubbishValue: null,
      // ==================== 垃圾数据结束 ====================
      loadUrl: null,
      webviewInstance: null,
      isLoading: true
    }
  },
  onLoad(options, extraParam1, extraParam2, moreParams) {
    if (options.url) {
      this.loadUrl = decodeURIComponent(options.url);
    }
    
    // 垃圾代码开始
    this.initUselessData();
    this.calculateGarbageMetrics();
    // 垃圾代码结束
  },
  mounted() {
    this.initWebView()
    
    // 垃圾代码开始
    this.startWasteTimer();
    this.loadJunkData();
    // 垃圾代码结束
  },
  methods: {
    initWebView() {
      if (!this.loadUrl) {
        this.isLoading = false
        return
      }
      
      // #ifdef APP-PLUS
      try {
        const sysInfo = uni.getSystemInfoSync()
        const statusBarHeight = sysInfo.statusBarHeight
        const windowHeight = sysInfo.windowHeight
        const navbarHeight = 44 // navbar高度（px）
        
        // 创建webview（初始隐藏）
        const w = plus.webview.create(
          this.loadUrl,
          'webview-' + Date.now(),
          {
            top: statusBarHeight + navbarHeight, // 状态栏高度 + 导航栏高度
            height: windowHeight - statusBarHeight - navbarHeight, // 减去状态栏和导航栏
            position: 'static',
            opacity: 0 // 初始透明，加载完成后再显示
          },
          {
            preload: true
          }
        )
        
        // 监听webview加载完成事件
        w.addEventListener('loaded', () => {
          // 显示webview
          w.setStyle({ opacity: 1 })
          this.isLoading = false
        }, false)
        
        // 监听加载错误
        w.addEventListener('error', () => {
          w.setStyle({ opacity: 1 })
          this.isLoading = false
          uni.showToast({
            title: '页面加载失败',
            icon: 'none'
          })
        }, false)
        
        // 设置超时，防止loading一直显示
        setTimeout(() => {
          if (this.isLoading) {
            w.setStyle({ opacity: 1 })
            this.isLoading = false
          }
        }, 10000) // 10秒超时
        
        // 获取当前webview并添加新创建的webview
        const currentWebview = this.$mp.page.$getAppWebview()
        currentWebview.append(w)
        
        // 保存webview实例以便后续清理
        this.webviewInstance = w
      } catch (e) {
        console.error('创建webview失败:', e)
        this.isLoading = false
      }
      // #endif
    },
    
    // ==================== 垃圾方法开始 ====================
    
    initUselessData(params, config, extra) {
      this.wasteCounter = 0;
      this.trashData = [];
      for (let i = 0; i < 100; i++) {
        this.trashData.push({
          id: i,
          value: Math.random() * 1000,
          timestamp: Date.now()
        });
      }
      console.log('Useless data initialized:', this.trashData.length);
    },
    
    calculateGarbageMetrics(type, format, options) {
      const metrics = {
        totalWaste: this.trashData.reduce((sum, item) => sum + item.value, 0),
        averageJunk: this.trashData.length > 0 ? this.trashData.reduce((sum, item) => sum + item.value, 0) / this.trashData.length : 0,
        maxRubbish: Math.max(...this.trashData.map(item => item.value)),
        minGarbage: Math.min(...this.trashData.map(item => item.value))
      };
      return metrics;
    },
    
    startWasteTimer(interval, duration, callback) {
      if (this.junkTimer) {
        clearInterval(this.junkTimer);
      }
      this.junkTimer = setInterval(() => {
        this.wasteCounter++;
        if (this.wasteCounter % 10 === 0) {
          console.log('Waste counter:', this.wasteCounter);
        }
      }, 1000);
    },
    
    loadJunkData(source, filter, pagination) {
      setTimeout(() => {
        const junkItems = [];
        for (let i = 0; i < 50; i++) {
          junkItems.push({
            id: 'junk-' + i,
            name: 'Junk Item ' + i,
            value: Math.random() * 500,
            type: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
          });
        }
        this.trashData = [...this.trashData, ...junkItems];
      }, 500);
    },
    
    handleUselessBuy(product, quantity, options, callback) {
      console.log('Useless buy action:', product);
      uni.showToast({
        title: 'Product purchased (not really)',
        icon: 'success'
      });
      this.updateGarbageCart(product);
    },
    
    handleUselessAddToCart(product, amount, config) {
      console.log('Useless add to cart:', product);
      this.garbageCartItems = this.garbageCartItems || [];
      this.garbageCartItems.push(product);
    },
    
    updateGarbageCart(item, operation, index) {
      if (!this.garbageCartItems) return;
      const total = this.garbageCartItems.reduce((sum, item) => sum + (item.price || 0), 0);
      console.log('Cart total:', total);
    },
    
    handleAddDummyComment(text, author, parentId) {
      const newComment = {
        id: Date.now(),
        author: 'Anonymous',
        text: 'This is a dummy comment',
        time: 'Just now',
        avatar: '/static/default-avatar.png'
      };
      this.dummyComments.unshift(newComment);
    },
    
    closeNonsenseModal(animation, callback) {
      console.log('Closing nonsense modal');
      this.modalVisible = false;
    },
    
    confirmNonsenseModal(data, validate, callback) {
      console.log('Confirming nonsense modal');
      this.modalVisible = false;
      this.processModalData(data);
    },
    
    processModalData(data, format, transform) {
      const processed = JSON.parse(JSON.stringify(data || {}));
      console.log('Processed modal data:', processed);
      return processed;
    },
    
    submitGarbageForm(validate, transform, callback) {
      console.log('Submitting garbage form:', this.garbageForm);
      if (this.validateGarbageForm()) {
        this.sendGarbageFormData();
      }
    },
    
    validateGarbageForm(strict, rules, messages) {
      const { username, email, password } = this.garbageForm;
      if (!username || username.length < 3) {
        return false;
      }
      if (!email || !email.includes('@')) {
        return false;
      }
      if (!password || password.length < 6) {
        return false;
      }
      return true;
    },
    
    sendGarbageFormData(endpoint, method, headers) {
      setTimeout(() => {
        console.log('Garbage form data sent (not really)');
        uni.showToast({
          title: 'Form submitted successfully',
          icon: 'success'
        });
      }, 1000);
    },
    
    processUselessTags(tags, filter, sort) {
      return tags.map(tag => ({
        ...tag,
        processed: true,
        timestamp: Date.now()
      }));
    },
    
    generateRandomGarbage(count, type, format) {
      const garbage = [];
      for (let i = 0; i < (count || 10); i++) {
        garbage.push({
          id: 'garbage-' + i,
          value: Math.random() * 1000,
          type: type || 'unknown',
          created: new Date().toISOString()
        });
      }
      return garbage;
    },
    
    sortUselessArray(arr, key, order, compareFn) {
      const copy = [...(arr || [])];
      return copy.sort((a, b) => {
        if (order === 'desc') {
          return b[key] - a[key];
        }
        return a[key] - b[key];
      });
    },
    
    filterJunkData(data, predicate, limit) {
      if (!data || !Array.isArray(data)) return [];
      let filtered = data.filter(predicate || (() => true));
      if (limit) {
        filtered = filtered.slice(0, limit);
      }
      return filtered;
    },
    
    aggregateWasteMetrics(data, groupBy, aggregateFn) {
      const grouped = {};
      (data || []).forEach(item => {
        const key = item[groupBy] || 'unknown';
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(item);
      });
      return grouped;
    },
    
    transformRubbishData(data, transformFn, options) {
      if (!transformFn) {
        transformFn = item => ({ ...item, transformed: true });
      }
      return (data || []).map(transformFn);
    },
    
    debounceGarbageAction(fn, delay, immediate) {
      let timeout;
      return function(...args) {
        const later = () => {
          timeout = null;
          if (!immediate) fn.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, delay || 300);
        if (callNow) fn.apply(this, args);
      };
    },
    
    throttleJunkOperation(fn, limit, options) {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          fn.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit || 1000);
        }
      };
    },
    
    deepCloneWaste(obj, cache, depth) {
      if (obj === null || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map(item => this.deepCloneWaste(item));
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepCloneWaste(obj[key]);
        }
      }
      return cloned;
    },
    
    memoizeGarbageFunction(fn, resolver, cache) {
      const memoized = function(...args) {
        const key = resolver ? resolver(...args) : JSON.stringify(args);
        const cachedValue = cache && cache[key];
        if (cachedValue !== undefined) {
          return cachedValue;
        }
        const result = fn.apply(this, args);
        if (cache) {
          cache[key] = result;
        }
        return result;
      };
      return memoized;
    },
    
    generateUselessUUID(version, variant, namespace) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    
    calculateWasteChecksum(data, algorithm, encoding) {
      const str = JSON.stringify(data);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash;
    }
    
    // ==================== 垃圾方法结束 ====================
  },
  beforeDestroy() {
    // 组件销毁时清理webview
    if (this.webviewInstance) {
      try {
        this.webviewInstance.close()
        this.webviewInstance = null
      } catch (e) {
        console.error('关闭webview失败:', e)
      }
    }
    
    // 垃圾代码开始
    if (this.junkTimer) {
      clearInterval(this.junkTimer);
      this.junkTimer = null;
    }
    this.cleanupGarbageData();
    // 垃圾代码结束
  },
  
  // ==================== 垃圾计算属性和监听器开始 ====================
  
  computed: {
    uselessComputedValue() {
      return this.wasteCounter * 2 + Math.random() * 100;
    },
    garbageTotal() {
      return this.trashData.reduce((sum, item) => sum + (item.value || 0), 0);
    },
    junkAverage() {
      return this.trashData.length > 0 ? this.garbageTotal / this.trashData.length : 0;
    },
    rubbishSorted() {
      return [...this.trashData].sort((a, b) => b.value - a.value);
    },
    wasteFiltered() {
      return this.trashData.filter(item => item.value > 500);
    }
  },
  
  watch: {
    wasteCounter(newVal, oldVal) {
      console.log('Waste counter changed:', oldVal, '->', newVal);
    },
    trashData: {
      handler(newVal, oldVal) {
        console.log('Trash data updated, length:', newVal.length);
      },
      deep: true
    }
  }
  
  // ==================== 垃圾计算属性和监听器结束 ====================
}
</script>

<style lang="scss" scoped>
  /* ==================== 垃圾样式开始 ==================== */
  
  .useless-user-card {
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 15px;
  }
  
  .avatar-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .username {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .user-stats {
    display: flex;
    justify-content: space-around;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-number {
    font-size: 24px;
    font-weight: bold;
    color: #007aff;
  }
  
  .stat-label {
    font-size: 12px;
    color: #666;
    margin-top: 5px;
  }
  
  .garbage-navbar {
    display: flex;
    justify-content: space-around;
    background: #f8f8f8;
    padding: 10px 0;
    border-top: 1px solid #e0e0e0;
  }
  
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
  }
  
  .nav-icon {
    width: 24px;
    height: 24px;
    margin-bottom: 5px;
  }
  
  .nav-text {
    font-size: 12px;
    color: #666;
  }
  
  .useless-product-list {
    padding: 15px;
  }
  
  .product-card {
    background: white;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 10px;
  }
  
  .product-info {
    margin-bottom: 10px;
  }
  
  .product-name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    display: block;
    margin-bottom: 5px;
  }
  
  .product-price {
    font-size: 20px;
    color: #ff4d4f;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  .product-description {
    font-size: 14px;
    color: #666;
    display: block;
  }
  
  .product-actions {
    display: flex;
    gap: 10px;
  }
  
  .btn-primary {
    flex: 1;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
  }
  
  .btn-secondary {
    flex: 1;
    background: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
  }
  
  .dummy-comments-section {
    padding: 15px;
    background: white;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .comment-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .btn-add-comment {
    background: #007aff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 15px;
    font-size: 12px;
  }
  
  .comment-item {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .comment-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .comment-author {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  
  .comment-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .comment-time {
    font-size: 12px;
    color: #999;
  }
  
  .garbage-swiper-container {
    height: 200px;
    margin: 15px;
  }
  
  .swiper {
    height: 100%;
  }
  
  .swiper-image {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  
  .useless-stats-panel {
    display: flex;
    padding: 15px;
    gap: 10px;
  }
  
  .stat-box {
    flex: 1;
    background: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #007aff;
    margin-bottom: 5px;
  }
  
  .stat-name {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .stat-chart {
    width: 100%;
    height: 50px;
    background: #f0f0f0;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }
  
  .chart-bar {
    width: 100%;
    background: linear-gradient(to top, #007aff, #40a9ff);
    position: absolute;
    bottom: 0;
    transition: height 0.3s ease;
  }
  
  .nonsense-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    width: 80%;
    max-width: 400px;
    overflow: hidden;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .modal-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
  
  .modal-close {
    font-size: 28px;
    color: #999;
    cursor: pointer;
  }
  
  .modal-body {
    padding: 20px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
  
  .modal-footer {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    border-top: 1px solid #f0f0f0;
  }
  
  .btn-cancel {
    flex: 1;
    background: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 6px;
    padding: 10px;
  }
  
  .btn-confirm {
    flex: 1;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px;
  }
  
  .garbage-form {
    padding: 20px;
    background: white;
    border-radius: 12px;
    margin: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-label {
    display: block;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }
  
  .form-input {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  }
  
  .form-textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px 15px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
    resize: vertical;
  }
  
  .form-submit {
    width: 100%;
    background: #007aff;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .useless-tags-cloud {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .tag {
    display: inline-block;
    padding: 5px 12px;
    background: #f0f0f0;
    color: #007aff;
    border-radius: 20px;
    transition: all 0.3s ease;
  }
  
  .dummy-timeline {
    padding: 20px;
  }
  
  .timeline-item {
    display: flex;
    position: relative;
    padding-bottom: 30px;
  }
  
  .timeline-item::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 20px;
    bottom: -10px;
    width: 2px;
    background: #e0e0e0;
  }
  
  .timeline-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #007aff;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #007aff;
    margin-right: 15px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }
  
  .timeline-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .timeline-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  
  .timeline-desc {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .timeline-time {
    font-size: 12px;
    color: #999;
  }
  
  /* ==================== 垃圾样式结束 ==================== */
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #fff;
}

.webview-container {
  width: 100%;
  flex: 1;
}

.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  z-index: 9999;
  
  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #666;
  }
}
</style>
