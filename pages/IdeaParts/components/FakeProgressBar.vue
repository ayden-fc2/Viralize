<template>
  <view class="fake-progress-bar">
    <view class="progress-track">
      <view class="progress-fill" :style="{ width: progress + '%' }"></view>
    </view>
    <text class="progress-text">{{ Math.floor(progress) }}%</text>
  </view>
</template>

<script>
export default {
  name: 'FakeProgressBar',
  props: {
    // 预计总时长（秒）
    duration: {
      type: Number,
      default: 30
    },
    // 是否开始进度
    start: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      progress: 0,
      timer: null
    }
  },
  watch: {
    start(newVal) {
      if (newVal) {
        this.startProgress()
      } else {
        this.stopProgress()
      }
    }
  },
  mounted() {
    // 组件挂载时如果 start 为 true，立即开始进度
    if (this.start) {
      this.startProgress()
    }
  },
  beforeDestroy() {
    this.stopProgress()
  },
  methods: {
    startProgress() {
      this.progress = 0
      this.stopProgress()
      
      // 计算每次增长的间隔（毫秒）
      // 更新频率：每200ms更新一次
      const updateInterval = 200
      // 总共需要多少次更新才能到达99%
      const totalUpdates = (this.duration * 1000) / updateInterval
      // 每次增长的百分比
      const incrementPerUpdate = 99 / totalUpdates
      
      this.timer = setInterval(() => {
        if (this.progress < 99) {
          this.progress += incrementPerUpdate
          // 确保不超过99%
          if (this.progress > 99) {
            this.progress = 99
          }
        }
      }, updateInterval)
    },
    
    stopProgress() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    
    // 完成进度（外部调用）
    complete() {
      this.stopProgress()
      this.progress = 100
    },
    
    // 重置进度（外部调用）
    reset() {
      this.stopProgress()
      this.progress = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.fake-progress-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.progress-track {
  width: 100%;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 4rpx;
  transition: width 0.2s ease-out;
  box-shadow: 0 0 12rpx rgba(255, 255, 255, 0.5);
}

.progress-text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  letter-spacing: 0.5rpx;
}
</style>

