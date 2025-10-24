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
    }
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
</style>

