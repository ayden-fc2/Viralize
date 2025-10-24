<template>
  <view class="step-3-container">
    <!-- 媒体预览 -->
    <view class="media-preview-container">
      <view class="preview-wrapper">
        <!-- 加载中状态 -->
        <view v-if="loading" class="loading-state">
          <view class="loading-animation">
            <u-loading mode="circle" size="56" color="#ffffff"></u-loading>
          </view>
          <text class="status-message">{{ $t('ideaParts.generatingVideoWithTime', { time: estimatedTime }) }}</text>
          <text class="leave-tip">{{ $t('ideaParts.canLeavePageTip') }}</text>
          <view class="loading-progress">
            <FakeProgressBar :duration="estimatedTime" :start="loading" ref="progressBar" />
          </view>
        </view>
        
        <!-- 视频封面展示（第一帧） -->
        <image v-else-if="videoUrl" :src="videoUrl + '?ci-process=snapshot&time=0'" mode="aspectFill" class="media-image"></image>
        
        <!-- 场景图片展示 -->
        <image v-else :src="imageUrl" mode="aspectFill" class="media-image"></image>
        
        <!-- 视频控制按钮组 -->
        <view v-if="videoUrl && !loading" class="video-controls">
          <view class="control-button play-button" @click="$emit('play')">
            <u-icon name="play-circle-fill" size="28" color="#fff"></u-icon>
          </view>
          <view class="control-button download-button" @click="$emit('download')">
            <u-icon name="download" size="24" color="#fff"></u-icon>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 内容预览 -->
    <view class="content-preview">
      <view class="preview-item">
        <text class="preview-label">{{ $t('ideaParts.sceneDesc') }}:</text>
        <text class="preview-text">{{ description || $t('ideaParts.descPlaceholder') }}</text>
      </view>
      <view class="preview-item">
        <text class="preview-label">{{ $t('ideaParts.voiceScript') }}:</text>
        <text class="preview-text">{{ script || $t('ideaParts.scriptPlaceholder') }}</text>
      </view>
    </view>
    
    <!-- 步骤3操作按钮 -->
    <view class="step-actions">
      <view class="action-button secondary-button" @click="$emit('prev')">
        <u-icon name="arrow-left" size="20" color="#667eea"></u-icon>
        <text class="button-text">{{ $t('ideaParts.step2') }}</text>
      </view>
      <view 
        v-if="!isDemo"
        class="action-button primary-button generate-button" 
        :class="{ 'button-disabled': !canGenerate && !videoUrl }"
        @click="$emit('generate')"
      >
        <u-icon name="play-circle" size="24" color="#fff"></u-icon>
        <text class="button-text">{{ buttonText }}</text>
        <view class="button-glow"></view>
      </view>
    </view>
  </view>
</template>

<script>
import FakeProgressBar from './FakeProgressBar.vue'

export default {
  name: 'Step3GenerateVideo',
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
    imageUrl: {
      type: String,
      default: ''
    },
    videoUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    script: {
      type: String,
      default: ''
    },
    canGenerate: {
      type: Boolean,
      default: false
    },
    buttonText: {
      type: String,
      default: ''
    },
    isDemo: {
      type: Boolean,
      default: false
    },
    // 预计生成时间（秒）
    estimatedTime: {
      type: Number,
      default: 180 // 3分钟
    }
  },
  mounted() {
    // 🆕 进入步骤3时自动触发视频生成（仅当没有视频时）
    if (!this.videoUrl && !this.loading && !this.isDemo) {
      console.log('✨ Step3 mounted: 自动触发视频生成')
      this.$nextTick(() => {
        this.$emit('generate')
      })
    } else if (this.videoUrl) {
      console.log('✨ Step3 mounted: 已有视频，不自动生成')
    }
  },
  watch: {
    loading(newVal) {
      if (!newVal && this.$refs.progressBar) {
        // 加载完成，进度条跳到100%
        this.$refs.progressBar.complete()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.step-3-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

// 媒体预览容器
.media-preview-container {
  margin: 0 32rpx;
  flex: 1;
  position: relative;
  min-height: 600rpx;
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
  gap: 24rpx;
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
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 600;
  text-align: center;
  padding: 0 40rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.leave-tip {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  padding: 0 40rpx;
  margin-top: 8rpx;
}

.loading-progress {
  width: 500rpx;
  margin-top: 16rpx;
}

// 图片展示
.media-image {
  width: 100%;
  height: 100%;
}

// 视频控制按钮组
.video-controls {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  z-index: 10;
}

.control-button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20rpx);
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.3);
  
  &:active {
    transform: scale(0.88);
  }
}

.play-button {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.45);
}

// 内容预览
.content-preview {
  padding: 0 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 24rpx;
  background: #f8f9ff;
  border-radius: 12rpx;
}

.preview-label {
  font-size: 26rpx;
  font-weight: 600;
  color: #667eea;
}

.preview-text {
  font-size: 28rpx;
  color: #2c3e50;
  line-height: 40rpx;
}

// 步骤操作按钮
.step-actions {
  display: flex;
  gap: 24rpx;
  padding: 0 32rpx 32rpx;
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
  position: relative;
  overflow: hidden;
  
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
  
  &.button-disabled {
    opacity: 0.5;
    pointer-events: none;
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

.generate-button {
  .button-glow {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
    animation: button-shine 3s ease-in-out infinite;
    z-index: 1;
  }
}

@keyframes button-shine {
  0% { left: -100%; }
  50%, 100% { left: 200%; }
}
</style>

