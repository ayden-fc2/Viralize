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
  </view>
</template>

<script>
export default {
  data() {
    return {
      loadUrl: null,
      webviewInstance: null,
      isLoading: true
    }
  },
  onLoad(options) {
    if (options.url) {
      this.loadUrl = decodeURIComponent(options.url);
    }
  },
  mounted() {
    this.initWebView()
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
      
      // #ifndef APP-PLUS
      // 非APP环境，直接隐藏loading
      this.isLoading = false
      // #endif
    }
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
  }
}
</script>

<style lang="scss" scoped>
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
