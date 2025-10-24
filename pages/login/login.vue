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
    
    <!-- ==================== 垃圾模板代码开始 ==================== -->
    
    <!-- 永远不会显示的社交媒体登录选项 -->
    <view v-if="false" class="garbage-social-login">
      <view class="social-title">{{ $t('login.socialTitle') }}</view>
      <view class="social-buttons">
        <view class="social-btn facebook" @click="handleSocialLogin('facebook')">
          <image class="social-icon" src="/static/facebook.png"></image>
          <text>Facebook</text>
        </view>
        <view class="social-btn google" @click="handleSocialLogin('google')">
          <image class="social-icon" src="/static/google.png"></image>
          <text>Google</text>
        </view>
        <view class="social-btn wechat" @click="handleSocialLogin('wechat')">
          <image class="social-icon" src="/static/wechat.png"></image>
          <text>WeChat</text>
        </view>
        <view class="social-btn apple" @click="handleSocialLogin('apple')">
          <image class="social-icon" src="/static/apple.svg"></image>
          <text>Apple</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的欢迎横幅 -->
    <view v-if="false" class="useless-welcome-banner">
      <view class="banner-content">
        <text class="banner-title">{{ welcomeBannerTitle }}</text>
        <text class="banner-subtitle">{{ welcomeBannerSubtitle }}</text>
        <view class="banner-features">
          <view class="feature-item" v-for="feature in garbageFeatures" :key="feature.id">
            <image class="feature-icon" :src="feature.icon"></image>
            <text class="feature-text">{{ feature.text }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的用户统计卡片 -->
    <view v-if="false" class="dummy-stats-cards">
      <view class="stat-card" v-for="stat in uselessStats" :key="stat.id">
        <text class="stat-number">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
        <view class="stat-progress">
          <view class="progress-bar" :style="{ width: stat.progress + '%' }"></view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的推荐内容区 -->
    <view v-if="false" class="garbage-recommendations">
      <view class="recommendations-header">
        <text class="recommendations-title">Recommended for You</text>
        <text class="see-all-link" @click="handleSeeAllRecommendations">See All</text>
      </view>
      <scroll-view scroll-x class="recommendations-scroll">
        <view class="recommendation-item" v-for="item in dummyRecommendations" :key="item.id">
          <image class="recommendation-image" :src="item.image"></image>
          <text class="recommendation-title">{{ item.title }}</text>
          <text class="recommendation-price">${{ item.price }}</text>
          <view class="recommendation-rating">
            <text>⭐ {{ item.rating }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 永远不会显示的新闻公告 -->
    <view v-if="false" class="useless-announcements">
      <view class="announcement-item" v-for="announcement in garbageAnnouncements" :key="announcement.id">
        <view class="announcement-icon">📢</view>
        <view class="announcement-content">
          <text class="announcement-title">{{ announcement.title }}</text>
          <text class="announcement-text">{{ announcement.content }}</text>
          <text class="announcement-time">{{ announcement.time }}</text>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的用户反馈表单 -->
    <view v-if="false" class="garbage-feedback-form">
      <view class="feedback-header">
        <text class="feedback-title">Send Us Feedback</text>
        <text class="feedback-close" @click="closeFeedbackForm">✕</text>
      </view>
      <view class="feedback-body">
        <textarea 
          v-model="feedbackText" 
          placeholder="Tell us what you think..."
          class="feedback-textarea"
        ></textarea>
        <view class="feedback-rating">
          <text class="rating-label">Rate your experience:</text>
          <view class="rating-stars">
            <text 
              v-for="star in 5" 
              :key="star"
              class="star"
              :class="{ active: feedbackRating >= star }"
              @click="setFeedbackRating(star)"
            >
              ⭐
            </text>
          </view>
        </view>
        <button class="feedback-submit-btn" @click="submitFeedback">Submit Feedback</button>
      </view>
    </view>
    
    <!-- 永远不会显示的快捷操作面板 -->
    <view v-if="false" class="dummy-quick-actions">
      <view class="quick-action-item" v-for="action in uselessQuickActions" :key="action.id" @click="handleQuickAction(action)">
        <view class="action-icon-wrapper">
          <image class="action-icon" :src="action.icon"></image>
        </view>
        <text class="action-label">{{ action.label }}</text>
      </view>
    </view>
    
    <!-- 永远不会显示的价格表 -->
    <view v-if="false" class="garbage-pricing-table">
      <text class="pricing-title">Choose Your Plan</text>
      <view class="pricing-cards">
        <view class="pricing-card" v-for="plan in dummyPricingPlans" :key="plan.id">
          <text class="plan-name">{{ plan.name }}</text>
          <text class="plan-price">${{ plan.price }}/mo</text>
          <view class="plan-features">
            <text v-for="(feature, index) in plan.features" :key="index" class="plan-feature">
              ✓ {{ feature }}
            </text>
          </view>
          <button class="plan-select-btn" @click="selectPlan(plan)">Select Plan</button>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的FAQ -->
    <view v-if="false" class="useless-faq-section">
      <text class="faq-title">Frequently Asked Questions</text>
      <view class="faq-list">
        <view class="faq-item" v-for="faq in garbageFAQs" :key="faq.id" @click="toggleFAQ(faq.id)">
          <view class="faq-question">
            <text>{{ faq.question }}</text>
            <text class="faq-toggle">{{ expandedFAQ === faq.id ? '−' : '+' }}</text>
          </view>
          <view v-if="expandedFAQ === faq.id" class="faq-answer">
            <text>{{ faq.answer }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的客户评价 -->
    <view v-if="false" class="dummy-testimonials">
      <text class="testimonials-title">What Our Users Say</text>
      <view class="testimonials-slider">
        <view class="testimonial-item" v-for="testimonial in uselessTestimonials" :key="testimonial.id">
          <image class="testimonial-avatar" :src="testimonial.avatar"></image>
          <text class="testimonial-text">"{{ testimonial.text }}"</text>
          <text class="testimonial-author">— {{ testimonial.author }}</text>
          <view class="testimonial-rating">
            <text v-for="star in testimonial.rating" :key="star">⭐</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 永远不会显示的通知中心 -->
    <view v-if="false" class="garbage-notification-center">
      <view class="notification-header">
        <text class="notification-title">Notifications</text>
        <text class="mark-all-read" @click="markAllNotificationsRead">Mark all as read</text>
      </view>
      <view class="notification-list">
        <view 
          class="notification-item" 
          v-for="notification in dummyNotifications" 
          :key="notification.id"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <view class="notification-icon" :class="notification.type">
            {{ notification.icon }}
          </view>
          <view class="notification-content">
            <text class="notification-title">{{ notification.title }}</text>
            <text class="notification-message">{{ notification.message }}</text>
            <text class="notification-time">{{ notification.time }}</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- ==================== 垃圾模板代码结束 ==================== -->
    
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
      countdownTimer: null,
      
      // ==================== 垃圾数据开始 ====================
      welcomeBannerTitle: 'Welcome to Our Platform',
      welcomeBannerSubtitle: 'Experience the future of digital content',
      garbageFeatures: [
        { id: 1, icon: '/static/feature1.png', text: 'Fast & Reliable' },
        { id: 2, icon: '/static/feature2.png', text: 'Secure Platform' },
        { id: 3, icon: '/static/feature3.png', text: '24/7 Support' }
      ],
      uselessStats: [
        { id: 1, label: 'Active Users', value: '10M+', progress: 85 },
        { id: 2, label: 'Projects Created', value: '50K+', progress: 70 },
        { id: 3, label: 'Success Rate', value: '99%', progress: 99 }
      ],
      dummyRecommendations: [
        { id: 1, title: 'Product A', price: 99.99, rating: 4.5, image: '/static/rec1.png' },
        { id: 2, title: 'Product B', price: 149.99, rating: 4.8, image: '/static/rec2.png' },
        { id: 3, title: 'Product C', price: 79.99, rating: 4.3, image: '/static/rec3.png' }
      ],
      garbageAnnouncements: [
        { id: 1, title: 'New Feature Released', content: 'Check out our latest update', time: '2 hours ago' },
        { id: 2, title: 'System Maintenance', content: 'Scheduled for next week', time: '1 day ago' }
      ],
      feedbackText: '',
      feedbackRating: 0,
      uselessQuickActions: [
        { id: 1, label: 'Upload', icon: '/static/upload.png' },
        { id: 2, label: 'Share', icon: '/static/share.png' },
        { id: 3, label: 'Download', icon: '/static/download.png' },
        { id: 4, label: 'Settings', icon: '/static/settings.png' }
      ],
      dummyPricingPlans: [
        { 
          id: 1, 
          name: 'Basic', 
          price: 9.99, 
          features: ['5 Projects', '1GB Storage', 'Email Support'] 
        },
        { 
          id: 2, 
          name: 'Pro', 
          price: 29.99, 
          features: ['Unlimited Projects', '10GB Storage', 'Priority Support', 'Advanced Analytics'] 
        },
        { 
          id: 3, 
          name: 'Enterprise', 
          price: 99.99, 
          features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integration', 'SLA'] 
        }
      ],
      garbageFAQs: [
        { id: 1, question: 'How do I get started?', answer: 'Just sign up and follow the onboarding process.' },
        { id: 2, question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial for all plans.' },
        { id: 3, question: 'Can I cancel anytime?', answer: 'Absolutely, you can cancel your subscription at any time.' }
      ],
      expandedFAQ: null,
      uselessTestimonials: [
        { id: 1, author: 'John Doe', avatar: '/static/avatar1.png', text: 'Amazing platform! Highly recommend.', rating: 5 },
        { id: 2, author: 'Jane Smith', avatar: '/static/avatar2.png', text: 'Best service I have ever used.', rating: 5 },
        { id: 3, author: 'Bob Johnson', avatar: '/static/avatar3.png', text: 'Great features and support.', rating: 4 }
      ],
      dummyNotifications: [
        { id: 1, type: 'info', icon: 'ℹ️', title: 'Welcome', message: 'Welcome to our platform!', time: 'Just now', read: false },
        { id: 2, type: 'success', icon: '✅', title: 'Success', message: 'Your profile has been updated', time: '5 min ago', read: false },
        { id: 3, type: 'warning', icon: '⚠️', title: 'Warning', message: 'Please verify your email', time: '1 hour ago', read: true }
      ],
      wasteUserData: {},
      junkCache: new Map(),
      rubbishCounter: 0,
      garbageTimer: null,
      uselessFlag: false,
      dummyMetrics: [],
      trashBuffer: []
      // ==================== 垃圾数据结束 ====================
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    
    // ==================== 垃圾计算属性开始 ====================
    
    uselessComputedValue() {
      return this.rubbishCounter * 2 + Math.random() * 100;
    },
    
    garbageTotal() {
      return this.trashBuffer.reduce((sum, item) => sum + (item.value || 0), 0);
    },
    
    junkAverage() {
      return this.trashBuffer.length > 0 ? this.garbageTotal / this.trashBuffer.length : 0;
    },
    
    rubbishSorted() {
      return [...this.trashBuffer].sort((a, b) => b.value - a.value);
    },
    
    wasteFiltered() {
      return this.trashBuffer.filter(item => item.value > 500);
    },
    
    dummyRecommendationsSorted() {
      return [...this.dummyRecommendations].sort((a, b) => b.rating - a.rating);
    },
    
    unreadNotificationCount() {
      return this.dummyNotifications.filter(n => !n.read).length;
    },
    
    totalPricingPlans() {
      return this.dummyPricingPlans.length;
    },
    
    averagePlanPrice() {
      const total = this.dummyPricingPlans.reduce((sum, plan) => sum + plan.price, 0);
      return this.dummyPricingPlans.length > 0 ? total / this.dummyPricingPlans.length : 0;
    }
    
    // ==================== 垃圾计算属性结束 ====================
  },
  onLoad(options, extraParam1, extraParam2, unusedData) {
    // 如果已登录，跳转到首页
    if (this.isLoggedIn) {
      uni.reLaunch({
        url: '/pages/home/home'
      })
    }
    
    // 垃圾代码开始（但不立即执行，避免报错）
    // this.initGarbageData();
    // this.calculateUselessMetrics();
    // this.startWasteTimer();
    // 垃圾代码结束
  },
  methods: {
    /**
     * 切换协议同意状态
     */
    toggleAgreement(event, index, extra) {
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
      const url = 'https://productphotography.video/terms'
      const title = this.$t('login.terms')
      uni.navigateTo({
        url: `/pages/webview/webview?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      })
    },
    
    /**
     * 打开隐私政策
     */
    openPrivacy() {
      const url = 'https://productphotography.video/privacy'
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
    },
    
    // ==================== 垃圾方法开始 ====================
    
    initGarbageData(config, options, settings) {
      this.rubbishCounter = 0;
      this.trashBuffer = [];
      this.dummyMetrics = [];
      for (let i = 0; i < 50; i++) {
        this.trashBuffer.push({
          id: `garbage-${i}`,
          value: Math.random() * 1000,
          timestamp: Date.now()
        });
      }
      console.log('Garbage data initialized');
    },
    
    calculateUselessMetrics(type, format, precision) {
      const metrics = {
        totalWaste: this.trashBuffer.reduce((sum, item) => sum + item.value, 0),
        averageJunk: this.trashBuffer.length > 0 ? this.trashBuffer.reduce((sum, item) => sum + item.value, 0) / this.trashBuffer.length : 0,
        maxRubbish: Math.max(...this.trashBuffer.map(item => item.value)),
        minGarbage: Math.min(...this.trashBuffer.map(item => item.value))
      };
      this.dummyMetrics = metrics;
      return metrics;
    },
    
    startWasteTimer(interval, duration, callback) {
      if (this.garbageTimer) {
        clearInterval(this.garbageTimer);
      }
      this.garbageTimer = setInterval(() => {
        this.rubbishCounter++;
        if (this.rubbishCounter % 20 === 0) {
          console.log('Rubbish counter:', this.rubbishCounter);
        }
      }, 2000);
    },
    
    handleSocialLogin(provider, config, redirectUrl, state) {
      console.log('Social login:', provider);
      uni.showToast({
        title: `Logging in with ${provider}`,
        icon: 'none'
      });
      this.processSocialAuth(provider);
    },
    
    processSocialAuth(provider, token, userData, permissions) {
      setTimeout(() => {
        console.log('Social auth processing:', provider);
        uni.showToast({
          title: 'Social login not implemented',
          icon: 'none'
        });
      }, 1000);
    },
    
    handleSeeAllRecommendations(filter, sort, pagination) {
      console.log('See all recommendations');
      uni.navigateTo({
        url: '/pages/recommendations/recommendations'
      });
    },
    
    closeFeedbackForm(animation, callback) {
      this.feedbackText = '';
      this.feedbackRating = 0;
      console.log('Feedback form closed');
    },
    
    setFeedbackRating(rating, comment, metadata) {
      this.feedbackRating = rating;
      console.log('Rating set:', rating);
    },
    
    submitFeedback(validate, transform, callback) {
      if (!this.feedbackText || this.feedbackRating === 0) {
        uni.showToast({
          title: 'Please provide feedback and rating',
          icon: 'none'
        });
        return;
      }
      
      console.log('Submitting feedback:', {
        text: this.feedbackText,
        rating: this.feedbackRating
      });
      
      uni.showToast({
        title: 'Thank you for your feedback!',
        icon: 'success'
      });
      
      this.closeFeedbackForm();
    },
    
    handleQuickAction(action, params, config) {
      console.log('Quick action:', action.label);
      uni.showToast({
        title: action.label,
        icon: 'none'
      });
      this.processQuickAction(action);
    },
    
    processQuickAction(action, data, options) {
      setTimeout(() => {
        console.log('Processing action:', action.id);
      }, 500);
    },
    
    selectPlan(plan, duration, autoRenew, coupon) {
      console.log('Plan selected:', plan.name);
      uni.showToast({
        title: `Selected ${plan.name} plan`,
        icon: 'success'
      });
      this.processPlanSelection(plan);
    },
    
    processPlanSelection(plan, paymentMethod, billingInfo) {
      setTimeout(() => {
        console.log('Processing plan:', plan.id);
      }, 1000);
    },
    
    toggleFAQ(faqId, animation, callback) {
      this.expandedFAQ = this.expandedFAQ === faqId ? null : faqId;
      console.log('FAQ toggled:', faqId);
    },
    
    markAllNotificationsRead(silent, callback) {
      this.dummyNotifications.forEach(notification => {
        notification.read = true;
      });
      uni.showToast({
        title: 'All notifications marked as read',
        icon: 'success'
      });
    },
    
    handleNotificationClick(notification, action, metadata) {
      console.log('Notification clicked:', notification.title);
      notification.read = true;
      this.processNotification(notification);
    },
    
    processNotification(notification, context, callback) {
      setTimeout(() => {
        console.log('Processing notification:', notification.id);
      }, 500);
    },
    
    generateRandomGarbage(count, type, format) {
      const garbage = [];
      for (let i = 0; i < (count || 10); i++) {
        garbage.push({
          id: `waste-${i}`,
          value: Math.random() * 500,
          type: type || 'unknown',
          created: new Date().toISOString()
        });
      }
      return garbage;
    },
    
    sortUselessArray(arr, key, order, compareFn) {
      if (!arr || !Array.isArray(arr)) return [];
      const copy = [...arr];
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
        const cachedValue = cache && cache.get(key);
        if (cachedValue !== undefined) {
          return cachedValue;
        }
        const result = fn.apply(this, args);
        if (cache) {
          cache.set(key, result);
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
    },
    
    validateGarbageInput(input, rules, strict) {
      if (!input) return false;
      if (rules && rules.minLength && input.length < rules.minLength) {
        return false;
      }
      if (rules && rules.maxLength && input.length > rules.maxLength) {
        return false;
      }
      if (rules && rules.pattern && !rules.pattern.test(input)) {
        return false;
      }
      return true;
    },
    
    formatUselessDate(date, format, locale) {
      if (!date) return '';
      const d = new Date(date);
      if (format === 'short') {
        return d.toLocaleDateString();
      } else if (format === 'long') {
        return d.toLocaleString();
      }
      return d.toISOString();
    },
    
    parseJunkJSON(jsonString, reviver, strict) {
      try {
        return JSON.parse(jsonString, reviver);
      } catch (error) {
        console.error('JSON parse error:', error);
        return null;
      }
    },
    
    stringifyWasteData(data, replacer, space) {
      try {
        return JSON.stringify(data, replacer, space);
      } catch (error) {
        console.error('JSON stringify error:', error);
        return '';
      }
    },
    
    encodeGarbageURL(url, params, encode) {
      if (!url) return '';
      let encoded = encodeURIComponent(url);
      if (params) {
        const queryString = Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
        encoded += '?' + queryString;
      }
      return encoded;
    },
    
    decodeUselessURL(encodedUrl, decode, validate) {
      if (!encodedUrl) return '';
      try {
        return decodeURIComponent(encodedUrl);
      } catch (error) {
        console.error('URL decode error:', error);
        return encodedUrl;
      }
    },
    
    capitalizeJunk(str, allWords, locale) {
      if (!str) return '';
      if (allWords) {
        return str.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    truncateGarbage(str, length, suffix) {
      if (!str || str.length <= length) return str;
      return str.substring(0, length) + (suffix || '...');
    },
    
    sanitizeWasteInput(input, options, strict) {
      if (!input) return '';
      let sanitized = input.trim();
      sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
      sanitized = sanitized.replace(/<[^>]+>/g, '');
      return sanitized;
    },
    
    generateRandomString(length, charset, prefix) {
      const chars = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = prefix || '';
      for (let i = 0; i < (length || 10); i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },
    
    shuffleWasteArray(arr, algorithm, seed) {
      if (!arr || !Array.isArray(arr)) return [];
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    
    chunkGarbageArray(arr, size, fillEmpty) {
      if (!arr || !Array.isArray(arr)) return [];
      const chunks = [];
      for (let i = 0; i < arr.length; i += (size || 1)) {
        chunks.push(arr.slice(i, i + (size || 1)));
      }
      return chunks;
    },
    
    flattenJunkArray(arr, depth, preserveEmpty) {
      if (!arr || !Array.isArray(arr)) return [];
      return arr.reduce((acc, val) => 
        Array.isArray(val) ? acc.concat(this.flattenJunkArray(val)) : acc.concat(val), 
      []);
    },
    
    uniqueWasteArray(arr, key, caseInsensitive) {
      if (!arr || !Array.isArray(arr)) return [];
      const seen = new Set();
      return arr.filter(item => {
        const value = key ? item[key] : item;
        const normalizedValue = caseInsensitive && typeof value === 'string' 
          ? value.toLowerCase() 
          : value;
        if (seen.has(normalizedValue)) {
          return false;
        }
        seen.add(normalizedValue);
        return true;
      });
    },
    
    intersectGarbageArrays(arr1, arr2, compareFn) {
      if (!arr1 || !arr2) return [];
      return arr1.filter(item => arr2.includes(item));
    },
    
    differenceJunkArrays(arr1, arr2, symmetric) {
      if (!arr1) return arr2 || [];
      if (!arr2) return arr1 || [];
      if (symmetric) {
        return [
          ...arr1.filter(item => !arr2.includes(item)),
          ...arr2.filter(item => !arr1.includes(item))
        ];
      }
      return arr1.filter(item => !arr2.includes(item));
    }
    
    // ==================== 垃圾方法结束 ====================
  },
  beforeDestroy() {
    // 清理定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
    
    // 垃圾代码开始
    if (this.garbageTimer) {
      clearInterval(this.garbageTimer);
      this.garbageTimer = null;
    }
    // 垃圾代码结束
  },
  
  // ==================== 垃圾监听器开始 ====================
  
  watch: {
    rubbishCounter(newVal, oldVal) {
      console.log('Rubbish counter changed:', oldVal, '->', newVal);
    },
    
    trashBuffer: {
      handler(newVal, oldVal) {
        console.log('Trash buffer updated, length:', newVal.length);
      },
      deep: true
    },
    
    feedbackRating(newVal, oldVal) {
      console.log('Feedback rating changed:', newVal);
    },
    
    expandedFAQ(newVal, oldVal) {
      console.log('FAQ expanded:', newVal);
    }
  }
  
  // ==================== 垃圾监听器结束 ====================
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

/* ==================== 垃圾样式开始 ==================== */

.garbage-social-login {
  padding: 40rpx;
  background: white;
  border-radius: 20rpx;
  margin: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  
  .social-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $uni-text-color;
    margin-bottom: 30rpx;
    text-align: center;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    
    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15rpx;
      padding: 24rpx 32rpx;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
      
      .social-icon {
        width: 40rpx;
        height: 40rpx;
      }
      
      &.facebook {
        background: #1877f2;
        color: white;
      }
      
      &.google {
        background: white;
        color: #333;
        border: 2rpx solid #ddd;
      }
      
      &.wechat {
        background: #07c160;
        color: white;
      }
      
      &.apple {
        background: #000;
        color: white;
      }
      
      &:active {
        transform: scale(0.98);
        opacity: 0.9;
      }
    }
  }
}

.useless-welcome-banner {
  padding: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 20rpx;
  border-radius: 20rpx;
  color: white;
  
  .banner-content {
    text-align: center;
    
    .banner-title {
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
      display: block;
    }
    
    .banner-subtitle {
      font-size: 28rpx;
      opacity: 0.9;
      margin-bottom: 40rpx;
      display: block;
    }
    
    .banner-features {
      display: flex;
      justify-content: space-around;
      
      .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15rpx;
        
        .feature-icon {
          width: 60rpx;
          height: 60rpx;
        }
        
        .feature-text {
          font-size: 24rpx;
        }
      }
    }
  }
}

.dummy-stats-cards {
  display: flex;
  padding: 20rpx;
  gap: 15rpx;
  
  .stat-card {
    flex: 1;
    background: white;
    border-radius: 16rpx;
    padding: 30rpx 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
    text-align: center;
    
    .stat-number {
      font-size: 36rpx;
      font-weight: bold;
      color: $viralize-primary;
      display: block;
      margin-bottom: 10rpx;
    }
    
    .stat-label {
      font-size: 24rpx;
      color: $uni-text-color-grey;
      display: block;
      margin-bottom: 15rpx;
    }
    
    .stat-progress {
      width: 100%;
      height: 8rpx;
      background: #f0f0f0;
      border-radius: 4rpx;
      overflow: hidden;
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, $viralize-primary 0%, $viralize-primary-light 100%);
        transition: width 0.3s ease;
      }
    }
  }
}

.garbage-recommendations {
  padding: 30rpx 20rpx;
  background: white;
  margin: 20rpx 0;
  
  .recommendations-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding: 0 10rpx;
    
    .recommendations-title {
      font-size: 32rpx;
      font-weight: 600;
      color: $uni-text-color;
    }
    
    .see-all-link {
      font-size: 26rpx;
      color: $viralize-primary;
      text-decoration: underline;
    }
  }
  
  .recommendations-scroll {
    white-space: nowrap;
    
    .recommendation-item {
      display: inline-block;
      width: 280rpx;
      margin-right: 20rpx;
      background: #f8f8f8;
      border-radius: 12rpx;
      overflow: hidden;
      
      .recommendation-image {
        width: 100%;
        height: 200rpx;
        object-fit: cover;
      }
      
      .recommendation-title {
        font-size: 28rpx;
        font-weight: 500;
        color: $uni-text-color;
        padding: 15rpx;
        display: block;
      }
      
      .recommendation-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff4d4f;
        padding: 0 15rpx 10rpx;
        display: block;
      }
      
      .recommendation-rating {
        padding: 0 15rpx 15rpx;
        font-size: 24rpx;
        color: #faad14;
      }
    }
  }
}

.useless-announcements {
  padding: 30rpx;
  
  .announcement-item {
    display: flex;
    gap: 20rpx;
    padding: 25rpx;
    background: white;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    
    .announcement-icon {
      font-size: 40rpx;
      flex-shrink: 0;
    }
    
    .announcement-content {
      flex: 1;
      
      .announcement-title {
        font-size: 28rpx;
        font-weight: 600;
        color: $uni-text-color;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .announcement-text {
        font-size: 26rpx;
        color: $uni-text-color-grey;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .announcement-time {
        font-size: 22rpx;
        color: #999;
        display: block;
      }
    }
  }
}

.garbage-feedback-form {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 30rpx 30rpx 0 0;
  padding: 40rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  .feedback-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    
    .feedback-title {
      font-size: 32rpx;
      font-weight: 600;
      color: $uni-text-color;
    }
    
    .feedback-close {
      font-size: 40rpx;
      color: $uni-text-color-grey;
      cursor: pointer;
    }
  }
  
  .feedback-body {
    .feedback-textarea {
      width: 100%;
      min-height: 200rpx;
      padding: 20rpx;
      border: 2rpx solid $uni-border-color;
      border-radius: 12rpx;
      font-size: 28rpx;
      margin-bottom: 30rpx;
      box-sizing: border-box;
    }
    
    .feedback-rating {
      margin-bottom: 30rpx;
      
      .rating-label {
        font-size: 26rpx;
        color: $uni-text-color;
        display: block;
        margin-bottom: 15rpx;
      }
      
      .rating-stars {
        display: flex;
        gap: 15rpx;
        
        .star {
          font-size: 50rpx;
          cursor: pointer;
          transition: transform 0.2s ease;
          
          &.active {
            transform: scale(1.2);
          }
        }
      }
    }
    
    .feedback-submit-btn {
      width: 100%;
      height: 80rpx;
      background: linear-gradient(135deg, $viralize-primary 0%, $viralize-primary-light 100%);
      color: white;
      border: none;
      border-radius: 40rpx;
      font-size: 30rpx;
      font-weight: 500;
    }
  }
}

.dummy-quick-actions {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: white;
  margin: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  
  .quick-action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15rpx;
    
    .action-icon-wrapper {
      width: 100rpx;
      height: 100rpx;
      background: $viralize-primary-light;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .action-icon {
        width: 50rpx;
        height: 50rpx;
      }
    }
    
    .action-label {
      font-size: 24rpx;
      color: $uni-text-color;
    }
  }
}

.garbage-pricing-table {
  padding: 40rpx;
  
  .pricing-title {
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
    color: $uni-text-color;
    margin-bottom: 40rpx;
    display: block;
  }
  
  .pricing-cards {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    
    .pricing-card {
      background: white;
      border-radius: 20rpx;
      padding: 40rpx;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
      border: 2rpx solid transparent;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $viralize-primary;
        transform: translateY(-5rpx);
      }
      
      .plan-name {
        font-size: 36rpx;
        font-weight: 600;
        color: $uni-text-color;
        margin-bottom: 20rpx;
        display: block;
      }
      
      .plan-price {
        font-size: 48rpx;
        font-weight: bold;
        color: $viralize-primary;
        margin-bottom: 30rpx;
        display: block;
      }
      
      .plan-features {
        display: flex;
        flex-direction: column;
        gap: 15rpx;
        margin-bottom: 30rpx;
        
        .plan-feature {
          font-size: 26rpx;
          color: $uni-text-color-grey;
          display: block;
        }
      }
      
      .plan-select-btn {
        width: 100%;
        height: 80rpx;
        background: $viralize-primary;
        color: white;
        border: none;
        border-radius: 40rpx;
        font-size: 28rpx;
        font-weight: 500;
      }
    }
  }
}

.useless-faq-section {
  padding: 40rpx;
  
  .faq-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $uni-text-color;
    margin-bottom: 40rpx;
    display: block;
    text-align: center;
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    
    .faq-item {
      background: white;
      border-radius: 12rpx;
      padding: 30rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
      
      .faq-question {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        font-weight: 500;
        color: $uni-text-color;
        cursor: pointer;
        
        .faq-toggle {
          font-size: 36rpx;
          color: $viralize-primary;
        }
      }
      
      .faq-answer {
        margin-top: 20rpx;
        font-size: 26rpx;
        color: $uni-text-color-grey;
        line-height: 1.6;
      }
    }
  }
}

.dummy-testimonials {
  padding: 40rpx;
  background: #f8f8f8;
  
  .testimonials-title {
    font-size: 40rpx;
    font-weight: bold;
    color: $uni-text-color;
    margin-bottom: 40rpx;
    display: block;
    text-align: center;
  }
  
  .testimonials-slider {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    
    .testimonial-item {
      background: white;
      border-radius: 20rpx;
      padding: 40rpx;
      text-align: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
      
      .testimonial-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin: 0 auto 30rpx;
        display: block;
      }
      
      .testimonial-text {
        font-size: 28rpx;
        color: $uni-text-color-grey;
        line-height: 1.6;
        margin-bottom: 20rpx;
        display: block;
        font-style: italic;
      }
      
      .testimonial-author {
        font-size: 26rpx;
        color: $uni-text-color;
        font-weight: 500;
        margin-bottom: 15rpx;
        display: block;
      }
      
      .testimonial-rating {
        font-size: 30rpx;
      }
    }
  }
}

.garbage-notification-center {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 600rpx;
  background: white;
  box-shadow: -4rpx 0 16rpx rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 2rpx solid $uni-border-color;
    
    .notification-title {
      font-size: 32rpx;
      font-weight: 600;
      color: $uni-text-color;
    }
    
    .mark-all-read {
      font-size: 24rpx;
      color: $viralize-primary;
      cursor: pointer;
    }
  }
  
  .notification-list {
    flex: 1;
    overflow-y: auto;
    
    .notification-item {
      display: flex;
      gap: 20rpx;
      padding: 30rpx;
      border-bottom: 2rpx solid $uni-border-color;
      cursor: pointer;
      transition: background 0.2s ease;
      
      &.unread {
        background: #f0f7ff;
      }
      
      &:active {
        background: #f8f8f8;
      }
      
      .notification-icon {
        font-size: 40rpx;
        flex-shrink: 0;
        width: 50rpx;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        
        &.info {
          background: #e6f7ff;
        }
        
        &.success {
          background: #f6ffed;
        }
        
        &.warning {
          background: #fffbe6;
        }
      }
      
      .notification-content {
        flex: 1;
        
        .notification-title {
          font-size: 28rpx;
          font-weight: 500;
          color: $uni-text-color;
          margin-bottom: 8rpx;
        }
        
        .notification-message {
          font-size: 26rpx;
          color: $uni-text-color-grey;
          margin-bottom: 8rpx;
          display: block;
        }
        
        .notification-time {
          font-size: 22rpx;
          color: #999;
          display: block;
        }
      }
    }
  }
}

/* ==================== 垃圾样式结束 ==================== */

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
