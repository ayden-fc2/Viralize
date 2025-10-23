<template>
  <view class="page">
    <u-status-bar></u-status-bar>
    <view ref="webviewContainer"></view>
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
export default {
  data() {
    return {
      url: null,
      webviewInstance: null
    }
  },
  onLoad(options) {
    if (options.url) {
      this.url = decodeURIComponent(options.url);
    }
  },
  mounted() {
    this.initWebView()
  },
  methods: {
    initWebView() {
      if (!this.url) return
      
      // #ifdef APP-PLUS
      try {
        const sysInfo = uni.getSystemInfoSync()
        const statusBarHeight = sysInfo.statusBarHeight
        const windowHeight = sysInfo.windowHeight
        
        // 创建webview
        const w = plus.webview.create(
          this.url,
          'webview-' + Date.now(),
          {
            top: statusBarHeight, // 状态栏高度
            height: windowHeight - statusBarHeight, // 总高度减去状态栏
            position: 'static'
          },
          {
            preload: true
          }
        )
        
        // 获取当前webview并添加新创建的webview
        const currentWebview = this.$mp.page.$getAppWebview()
        currentWebview.append(w)
        
        // 保存webview实例以便后续清理
        this.webviewInstance = w
      } catch (e) {
        console.error('创建webview失败:', e)
      }
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
</style>
